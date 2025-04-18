import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      chapterId: string;
      lessonId: string;
    };
  }
) {
  try {
    const authResponse = await auth();
    const userId = authResponse.userId;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId, chapterId, lessonId } = params;
    const values = await req.json();

    // Check if the course belongs to the user
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update the lesson with the provided fields (allowing dynamic updates)
    const updatedLesson = await db.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        ...values, // Dynamically spread the values to update all fields (e.g., videoUrl, title, content, etc.)
      },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('[LESSON_UPDATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
