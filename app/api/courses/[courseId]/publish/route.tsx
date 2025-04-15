import { db } from '@/lib/db';
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()
    const userId = authResponse.userId;
  

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the course by ID and userId
    const course = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapter: true, // direct relation in your schema
      },
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
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

    // Publish course
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
    console.error('[COURSE_PUBLISH_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
