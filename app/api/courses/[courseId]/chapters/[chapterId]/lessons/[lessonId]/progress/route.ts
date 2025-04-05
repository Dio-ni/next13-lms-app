import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: params.lessonId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        lessonId: params.lessonId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log('[LESSON_PROGRESS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const progress = await db.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: params.lessonId,
        },
      },
    });

    return NextResponse.json({ isCompleted: progress?.isCompleted ?? false });
  } catch (error) {
    console.error("[GET_LESSON_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
