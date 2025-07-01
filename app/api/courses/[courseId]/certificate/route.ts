
// app/api/courses/[courseId]/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()

    const userId = authResponse.userId;

    const body = await req.json();
    const { certificateEnabled } = body;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        certificateEnabled,
      },
    });

    return Response.json(course);
  } catch (error) {
    console.error("[COURSE_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}


export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const result = await db.quizResult.findFirst({
      where: {
        userId,
        courseId: params.courseId,
      },
      select: {
        score: true,
      },
    });

    if (!result) {
      return NextResponse.json({ score: null });
    }

    return NextResponse.json({ score: result.score });
  } catch (error) {
    console.error('[CERTIFICATE_RESULT_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
