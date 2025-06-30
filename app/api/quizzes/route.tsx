import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  if (!moduleId) {
    return NextResponse.json({ error: "Missing moduleId" }, { status: 400 });
  }

  try {
    const quiz = await db.quiz.findFirst({
      where: { moduleId },
      include: {
        questions: {
          include: { options: true },
          orderBy: { createdAt: "asc" }, // consistently order questions
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("[QUIZZES_GET]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}