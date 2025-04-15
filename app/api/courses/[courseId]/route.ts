import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from "@clerk/nextjs/server";
// import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()
    const userId = authResponse.userId;
  
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


export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()
    const userId = authResponse.userId;
  
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return new NextResponse('Course deleted', { status: 200 });
  } catch (error) {
    console.error('[COURSE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}