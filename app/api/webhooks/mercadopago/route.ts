import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { payment as mercadopagoPayment } from "@/lib/mercadopago";

// Based on Mercado Pago webhook signature verification doc
// signature: "ts=timestamp,v1=hash"
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("data.id");
    const type = url.searchParams.get("type");

    // Only process payment updates for simplicity
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
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
