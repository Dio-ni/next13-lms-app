import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;

    if (!courseId) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        finalQuiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!course || !course.finalQuiz) {
      return NextResponse.json(
        { error: "Final quiz not found for this course" },
        { status: 404 }
      );
    }

    return NextResponse.json(course.finalQuiz);
  } catch (error) {
    console.error("[FINAL_QUIZ_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
