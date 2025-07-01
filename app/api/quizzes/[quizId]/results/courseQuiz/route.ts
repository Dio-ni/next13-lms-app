import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // get the quiz to find its courseId
    const quiz = await db.quiz.findUnique({
      where: { id: params.quizId },
      select: { courseId: true },
    });

    if (!quiz || !quiz.courseId) {
      return new NextResponse('Quiz not found or missing courseId', { status: 404 });
    }

    const result = await db.quizResult.findFirst({
      where: {
        userId,
        courseId: quiz.courseId,
      },
    });

    if (!result) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[COURSEQUIZRESULT_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { answers, score, courseId  } = await req.json();

    if (typeof score !== 'number' || !Array.isArray(answers)) {
      return new NextResponse('Invalid input', { status: 400 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: params.quizId },
      select: { courseId: true },
    });

    if (!quiz || !quiz.courseId) {
      return new NextResponse('Quiz not found or missing courseId', { status: 404 });
    }
    
    const result = await db.quizResult.upsert({
      where: {
        userId_moduleId_courseId: {
          userId,
          moduleId: '',
          courseId: quiz.courseId,
        },
      },
      update: {
        answers,
        score,
      },
      create: {
        userId,
        answers,
        courseId: quiz.courseId,
        score,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[COURSEQUIZRESULT_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
