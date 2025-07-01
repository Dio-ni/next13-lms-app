import { db } from "@/lib/db";
import {  NextRequest,NextResponse } from "next/server";

// Create or update a quiz for a module
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[QUIZZES_POST] Received body:', body);

    const { moduleId, title, questions } = body;

    if (!moduleId || !title || !questions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if a quiz already exists for this module
    const existingQuiz = await db.quiz.findFirst({
      where: { moduleId },
      include: { questions: { include: { options: true } } },
    });

    let quiz;

    if (existingQuiz) {
      // Delete existing questions and options to avoid duplication
      await db.question.deleteMany({
        where: { quizId: existingQuiz.id },
      });

      // Update the existing quiz with the new title and questions
      quiz = await db.quiz.update({
        where: { id: existingQuiz.id },
        data: {
          title,
          questions: {
            create: questions.map((q: any) => ({
              text: q.text,
              options: {
                create: q.options.map((o: any) => ({
                  text: o.text,
                  isCorrect: o.isCorrect,
                })),
              },
            })),
          },
        },
        include: {
          questions: { include: { options: true } },
        },
      });
    } else {
      // Create a new quiz
      quiz = await db.quiz.create({
        data: {
          title,
          moduleId,
          questions: {
            create: questions.map((q: any) => ({
              text: q.text,
              options: {
                create: q.options.map((o: any) => ({
                  text: o.text,
                  isCorrect: o.isCorrect,
                })),
              },
            })),
          },
        },
        include: {
          questions: { include: { options: true } },
        },
      });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error('[QUIZZES_POST]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Fetch a quiz for a specific module

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");
  const courseId = searchParams.get("courseId");

  if (!moduleId && !courseId) {
    return NextResponse.json(
      { error: "Missing moduleId or courseId" },
      { status: 400 }
    );
  }

  try {
    let quiz = null;

    if (moduleId) {
      // Fetch for module
      quiz = await db.quiz.findFirst({
        where: { moduleId },
        include: {
          questions: {
            include: { options: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    } else if (courseId) {
      // Fetch for course
      // Usually finalQuizId on the course
      const course = await db.course.findUnique({
        where: { id: courseId },
        select: { finalQuizId: true },
      });

      if (!course?.finalQuizId) {
        return NextResponse.json(null, { status: 200 });
      }

      quiz = await db.quiz.findUnique({
        where: { id: course.finalQuizId },
        include: {
          questions: {
            include: { options: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("[QUIZZES_GET]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");
  const courseId = searchParams.get("courseId");

  if (!moduleId && !courseId) {
    return NextResponse.json(
      { error: "moduleId немесе courseId қажет" },
      { status: 400 }
    );
  }

  try {
    if (moduleId) {
      // Найти и удалить quiz по moduleId
      const quiz = await db.quiz.findFirst({
        where: { moduleId },
      });

      if (!quiz) {
        return NextResponse.json(
          { error: "Модульдік тест табылмады" },
          { status: 404 }
        );
      }

      await db.quiz.delete({
        where: { id: quiz.id },
      });

      return NextResponse.json({ success: true, message: "Модуль тесті жойылды" });
    }

    if (courseId) {
      // Найти и удалить quiz по courseId
      const quiz = await db.quiz.findFirst({
        where: { courseId },
      });

      if (!quiz) {
        return NextResponse.json(
          { error: "Курстық тест табылмады" },
          { status: 404 }
        );
      }

      await db.quiz.delete({
        where: { id: quiz.id },
      });

      // Обновить finalQuizId курса
      await db.course.update({
        where: { id: courseId },
        data: { finalQuizId: null },
      });

      return NextResponse.json({ success: true, message: "Курстық тест жойылды" });
    }
  } catch (error) {
    console.error("[API /quizzes DELETE]", error);
    return NextResponse.json(
      { error: "Ішкі сервер қатесі" },
      { status: 500 }
    );
  }
}
