import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from '@/lib/db';



export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()
    const userId = authResponse.userId;
  
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

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
