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
  
    if (!user || !user.id || !user.emailAddresses[0].emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });
    const enroll = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (enroll) {
      return new NextResponse('Already Enrolled', { status: 400 });
    }

    if (!course) {
      return new NextResponse('Course Not Found', { status: 404 });
    }
    
    await db.enrollment.create({
      data: {
        userId: user.id,
        courseId: params.courseId,
      },
    });

    return new NextResponse('Enrolled Successfully', { status: 200 });
  } catch (error) {
    console.log('[COURSE_ID_ENROLL]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}