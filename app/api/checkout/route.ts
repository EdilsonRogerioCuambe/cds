import { NextRequest, NextResponse } from "next/server";
import { preApproval } from "@/lib/mercadopago";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const preApprovalResult = await preApproval.create({
      body: {
        reason: `Assinatura: ${course.title}`,
        external_reference: `${user.id}_${course.id}`,
        payer_email: user.email,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: course.price,
          currency_id: "BRL",
        },
        back_url: `${appUrl}/student/courses/${courseId}/success`,
        status: "pending",
      },
    });

    return NextResponse.json({
      id: preApprovalResult.id,
      init_point: preApprovalResult.init_point,
    });
  } catch (error: any) {
    console.error("Checkout Preference Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
