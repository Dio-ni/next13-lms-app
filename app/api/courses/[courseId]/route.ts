import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl,
        isPublished: values.isPublished,
        categoryId: values.categoryId, // Assumes categoryId can be passed
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSE_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
