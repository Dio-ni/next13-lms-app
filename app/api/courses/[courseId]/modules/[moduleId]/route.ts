import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: { courseId: string; moduleId: string };
  }
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

    const coursemodule = await db.module.update({
      where: {
        id: params.moduleId,
        courseId: params.courseId,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(coursemodule);
  } catch (error) {
    console.error('[MODULE_UPDATE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// DELETE handler for deleting the module
export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; moduleId: string } }
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
        return new NextResponse('Unauthorized', { status: 401 });
      }

      const coursemodule = await db.module.findUnique({
        where: {
          id: params.moduleId,
          courseId: params.courseId,
        },
      });

      if (!coursemodule) {
        return new NextResponse('Module not found', { status: 404 });
      }

      // Delete the module
      await db.module.delete({
        where: {
          id: params.moduleId,
        },
      });

      return new NextResponse('Module deleted successfully', { status: 200 });
    } catch (error) {
      console.error('[MODULE_DELETE_ERROR]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }