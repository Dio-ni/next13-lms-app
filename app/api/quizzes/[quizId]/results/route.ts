import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// GET /api/quizzes/results/[quizId]
export async function GET(
  _req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const quiz = await db.quiz.findUnique({
      where: { id: params.quizId },
      select: { moduleId: true },
    });

    if (!quiz || !quiz.moduleId) {
      return new NextResponse('Quiz not found or missing moduleId', { status: 404 });
    }
    const result = await db.quizResult.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId: quiz.moduleId,
        },
      },
    });

    if (!result) return new NextResponse(null, { status: 404 });

    return NextResponse.json(result);
  } catch (error) {
    console.error(`[QUIZRESULTS_GET]: ${error}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/quizzes/results/[quizId]
export async function POST(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { score, answers } = await req.json();

    if (typeof score !== 'number' || !Array.isArray(answers)) {
      return new NextResponse('Invalid input', { status: 400 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: params.quizId },
      select: { moduleId: true },
    });
    if (!quiz || !quiz.moduleId) {
      return new NextResponse('Quiz not found or missing moduleId', { status: 404 });
    }
    const result = await db.quizResult.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId: quiz.moduleId,
        },
      },
      update: {
        score,
        answers,
        updatedAt: new Date(),
      },
      create: {
        userId,
        moduleId: quiz.moduleId,
        score,
        answers,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(`[QUIZRESULTS_POST]: ${error}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
