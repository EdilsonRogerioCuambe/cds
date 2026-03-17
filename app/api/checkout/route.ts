import { NextRequest, NextResponse } from "next/server";
import { preference } from "@/lib/mercadopago";
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

    const preferenceResult = await preference.create({
      body: {
        items: [
          {
            id: course.id,
            title: course.title,
            quantity: 1,
            unit_price: course.price,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: user.email,
          name: user.name || undefined,
        },
        back_urls: {
          success: `${appUrl}/courses/${courseId}/success`,
          failure: `${appUrl}/courses/${courseId}`,
          pending: `${appUrl}/courses/${courseId}`,
        },
        auto_return: "approved",
        metadata: {
          courseId: course.id,
          userId: user.id,
        },
        external_reference: `${user.id}_${course.id}`,
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({
      id: preferenceResult.id,
      init_point: preferenceResult.init_point,
    });
  } catch (error: any) {
    console.error("Checkout Preference Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
