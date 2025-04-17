import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse the incoming request body and ensure we have a title
    const { title } = await req.json();
    if (!title || title.trim() === '') {
      return new NextResponse('Title is required', { status: 400 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
        moduleId: params.moduleId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        moduleId: params.moduleId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[CHAPTERS_CREATE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()
    const userId = authResponse.userId;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        moduleId: params.moduleId,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('[CHAPTERS_GET_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// New DELETE handler for chapter deletion
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string;  chapterId: string } }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()
    const userId = authResponse.userId;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId },
    });

    if (!chapter) {
      return new NextResponse('Chapter not found', { status: 404 });
    }

    if (chapter.courseId !== params.courseId) {
      return new NextResponse('Invalid course or module for this chapter', { status: 400 });
    }

    await db.chapter.delete({
      where: { id: params.chapterId },
    });

    // Optionally, update the positions of remaining chapters
    await db.chapter.updateMany({
      where: {
        courseId: params.courseId,
        position: { gt: chapter.position },
      },
      data: {
        position: { decrement: 1 },
      },
    });

    return new NextResponse('Chapter deleted successfully');
  } catch (error) {
    console.error('[CHAPTERS_DELETE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}