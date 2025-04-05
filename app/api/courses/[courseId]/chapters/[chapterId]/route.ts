import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!title || title.trim() === '') {
      return new NextResponse('Title is required', { status: 400 });
    }

    const existingChapter = await db.chapter.findUnique({
      where: { id: params.chapterId },
      include: { course: true },
    });

    if (!existingChapter || existingChapter.course.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updated = await db.chapter.update({
      where: { id: params.chapterId },
      data: { title },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[CHAPTER_UPDATE_ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
