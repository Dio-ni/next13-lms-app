import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        modules: true,
      },
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Validate required fields
    const hasTitle = !!course.title?.trim();
    const hasDescription = !!course.description?.trim();
    const hasImageUrl = !!course.imageUrl?.trim();
    const hasCategory = !!course.categoryId;

    if (!hasTitle || !hasDescription || !hasImageUrl || !hasCategory) {
      return new NextResponse('Missing required fields to publish the course.', {
        status: 400,
      });
    }

    // Proceed with updating the course after validation
    const updatedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log('[COURSE_ID_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
