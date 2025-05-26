import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const url = new URL(req.url);
    const moduleId = url.searchParams.get('moduleId');
    if (!moduleId) return new NextResponse('moduleId is required', { status: 400 });

    const result = await db.quizResult.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
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

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { moduleId, score, answers } = await req.json();

    if (!moduleId || typeof score !== 'number' || !Array.isArray(answers)) {
      return new NextResponse('Invalid input', { status: 400 });
    }

    const result = await db.quizResult.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
      update: {
        score,
        answers,
        updatedAt: new Date(),
      },
      create: {
        userId,
        moduleId,
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
