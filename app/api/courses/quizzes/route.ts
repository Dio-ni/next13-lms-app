import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, questions, courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Missing courseId" },
        { status: 400 }
      );
    }

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Invalid quiz data" },
        { status: 400 }
      );
    }

    // 1. Create the Quiz linked to the Course
    const quiz = await db.quiz.create({
      data: {
        title,
        course: {
          connect: { id: courseId },
        },
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
        questions: {
          include: { options: true },
        },
      },
    });

    // 2. Update Course to set finalQuizId
    await db.course.update({
      where: { id: courseId },
      data: {
        finalQuizId: quiz.id,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("[API /courses/quizzes] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
