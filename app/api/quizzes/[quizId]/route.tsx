import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    console.log('[API CALL] quizId:', params.quizId); // Проверка
    const quiz = await db.quiz.findUnique({
      where: { id: params.quizId },
      include: {
        questions: {
          include: { options: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error('[QUIZ_GET_BY_ID]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
