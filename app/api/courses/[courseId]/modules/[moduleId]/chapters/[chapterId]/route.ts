import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()
    const userId = authResponse.userId;

    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!title || title.trim() === '') {
      return new NextResponse('Title is required', { status: 400 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });
   // Check if chapter or module is null, and return an error if so
   if (!chapter || !chapter.module || chapter.module.course.userId !== userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }


    const updatedChapter = await db.chapter.update({
      where: { id: params.chapterId },
      data: { title },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('[CHAPTER_UPDATE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}