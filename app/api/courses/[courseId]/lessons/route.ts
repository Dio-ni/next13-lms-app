import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title } = await req.json();

    // Ensure the course owner exists
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Ensure the chapter exists for the given course
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse('Chapter not found', { status: 404 });
    }

    // Get the position of the last lesson in this chapter (if any)
    const lastLesson = await db.lesson.findFirst({
      where: {
        chapterId: params.chapterId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });


    // Create the new lesson
    const lesson = await db.lesson.create({
      data: {
        title,
        chapterId: params.chapterId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.log('[LESSON_CREATION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse('Chapter not found', { status: 404 });
    }

    const lessons = await db.lesson.findMany({
      where: {
        chapterId: params.chapterId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}