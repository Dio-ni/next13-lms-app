import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from '@clerk/nextjs'; // Clerk auth

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // ✅ Получаем текущего пользователя через Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    // ✅ Удаляем весь прогресс пользователя по всем урокам курса
    const deletedProgress = await db.userProgress.deleteMany({
      where: {
        userId,
        lesson: {
          chapter: {
            courseId,
          },
        },
      },
    });

    // ✅ Удаляем все результаты квизов этого курса (включая модульные и финальный)
    const deletedQuizResults = await db.quizResult.deleteMany({
      where: {
        userId,
        OR: [
          { courseId },
          {
            module: {
              courseId,
            },
          },
        ],
      },
    });

    return NextResponse.json({
      message: "Course progress has been reset successfully.",
      deletedProgressCount: deletedProgress.count,
      deletedQuizResultsCount: deletedQuizResults.count,
    });
  } catch (error) {
    console.error("[RESET_PROGRESS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
