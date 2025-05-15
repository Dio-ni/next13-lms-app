import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
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

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lastModule = await db.module.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastModule ? lastModule.position + 1 : 1;

    const coursemodule = await db.module.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(coursemodule);
  } catch (error) {
    console.error('[MODULE_CREATE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}