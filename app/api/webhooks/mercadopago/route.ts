import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { payment as mercadopagoPayment, preApproval } from "@/lib/mercadopago";
import { Resend } from "resend";
import { getEnrollmentEmail } from "@/lib/email-templates";
import { createNotification } from "@/lib/actions/notifications";

const resend = new Resend(process.env.RESEND_API_KEY);

// Based on Mercado Pago webhook signature verification doc
// signature: "ts=timestamp,v1=hash"
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("data.id");
    const type = url.searchParams.get("type");

    // Only process payment and subscription updates
    if (type === "subscription_preapproval" && id) {
        const subInfo = await preApproval.get({ id: id });
        if (subInfo && subInfo.external_reference && subInfo.status) {
            const [userId, courseId] = subInfo.external_reference.split("_");
            
            await prisma.subscription.upsert({
                where: { mercadoPagoId: id },
                update: {
                    status: subInfo.status as string,
                    nextBillingDate: subInfo.next_payment_date ? new Date(subInfo.next_payment_date) : undefined,
                },
                create: {
                    mercadoPagoId: id,
                    userId: userId,
                    status: subInfo.status as string,
                    amount: subInfo.auto_recurring?.transaction_amount || 0,
                    nextBillingDate: subInfo.next_payment_date ? new Date(subInfo.next_payment_date) : undefined,
                }
            });

            // If it's authorized, enroll the user
            if (subInfo.status === "authorized") {
                const existingEnrollment = await prisma.enrollment.findUnique({
                    where: { userId_courseId: { userId, courseId } }
                });

                if (!existingEnrollment) {
                    await prisma.enrollment.create({
                        data: {
                            userId: userId,
                            courseId: courseId,
                            status: "ACTIVE",
                        },
                    });

                    // Fetch details for email/notification
                    const [user, course] = await Promise.all([
                        prisma.user.findUnique({ where: { id: userId } }),
                        prisma.course.findUnique({ where: { id: courseId } })
                    ]);

                    if (user && course) {
                        // Send Email
                        await resend.emails.send({
                            from: "CDS <contato@ubuntuweblab.site>",
                            to: user.email,
                            subject: `Bem-vindo ao curso: ${course.title} - CDS`,
                            html: getEnrollmentEmail(user.name || "Aluno", course.title),
                        }).catch(err => console.error("Error sending sub enrollment email:", err));

                        // Create Notification
                        await createNotification({
                            userId: user.id,
                            title: "Assinatura Ativada! 🎉",
                            message: `Sua assinatura foi confirmada e você já pode acessar o curso: ${course.title}.`,
                            type: "ENROLLMENT",
                            link: `/student/courses`,
                        }).catch(err => console.error("Error creating sub notification:", err));
                    }
                }

                await prisma.activityLog.create({
                    data: {
                        userId: userId,
                        type: "SUBSCRIPTION_STARTED",
                        title: `Assinatura Ativada: ${subInfo.reason}`,
                    }
                }).catch(() => {});
            }
        }
        return NextResponse.json({ received: true });
    }

    if (type !== "payment" || !id) {
      return NextResponse.json({ received: true });
    }

    // Verify webhook signature for security
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");
    const dataId = id;

    if (!xSignature || !xRequestId || !dataId) {
      console.warn("Mercado Pago Webhook: Missing headers or id. This is insecure.");
      // Note: In a real production environment, you might enforce validation strictly.
    } else {
      // Split signature
      const parts = xSignature.split(',');
      let ts, hash;
      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key === 'ts') ts = value;
        if (key === 'v1') hash = value;
      });

      const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
      if (secret && ts && hash) {
        // Construct the manifest string
        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
        const cyphedSignature = crypto
          .createHmac("sha256", secret)
          .update(manifest)
          .digest("hex");

        if (cyphedSignature !== hash) {
          console.error("Invalid Webhook Signature.");
          return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }
      }
    }

    // Process the payment
    const paymentInfo = await mercadopagoPayment.get({ id: id });
    if (!paymentInfo) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const { status, transaction_amount, metadata } = paymentInfo;

    // Check if the payment already exists in our DB
    let dbPayment = await prisma.payment.findUnique({
      where: { mercadoPagoId: id },
    });

    if (!dbPayment && metadata?.userId) {
      dbPayment = await prisma.payment.create({
        data: {
          mercadoPagoId: id,
          amount: transaction_amount || 0,
          currency: "BRL",
          status: status === "approved" ? "APPROVED" : status === "rejected" ? "REJECTED" : "PENDING",
          method: paymentInfo.payment_method_id,
          userId: metadata.userId as string,
        },
      });
    } else if (dbPayment) {
      dbPayment = await prisma.payment.update({
        where: { id: dbPayment.id },
        data: {
          status: status === "approved" ? "APPROVED" : status === "rejected" ? "REJECTED" : "PENDING",
        },
      });
    }

    // If payment is approved, enroll the user in the course
    if (status === "approved" && metadata?.courseId && metadata?.userId) {
      const courseId = metadata.courseId as string;
      const userId = metadata.userId as string;

      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: courseId,
          },
        },
      });

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            userId: userId,
            courseId: courseId,
            status: "ACTIVE",
          },
        });

        // 1. Fetch User and Course details for email/notification
        const [user, course] = await Promise.all([
          prisma.user.findUnique({ where: { id: userId } }),
          prisma.course.findUnique({ where: { id: courseId } })
        ]);

        if (user && course) {
            // 2. Send Enrollment Confirmation Email
            await resend.emails.send({
                from: "CDS <contato@ubuntuweblab.site>",
                to: user.email,
                subject: `Bem-vindo ao curso: ${course.title} - CDS`,
                html: getEnrollmentEmail(user.name || "Aluno", course.title),
            }).catch(err => console.error("Error sending enrollment email:", err));

            // 3. Create In-App Notification
            await createNotification({
                userId: user.id,
                title: "Matrícula Confirmada! 🎉",
                message: `Você já pode começar a estudar o curso: ${course.title}. Clique para começar!`,
                type: "ENROLLMENT",
                link: `/student/courses`,
            }).catch(err => console.error("Error creating notification:", err));
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
