import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { db } from '@/lib/db';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      lessonId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    const { courseId, lessonId } = params;

    // Ensure the user is the owner of the course
    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse request body
    const values = await req.json();

    // Update the lesson content
    const lesson = await db.lesson.update({
      where: {
        id: lessonId,
        },
      data: {
        ...values, // Assuming values include fields like title, content, videoUrl, etc.
      },
    });

    // Handle video URL if provided
    // if (lesson.videoUrl) {
    //   const existingMuxData = await db.muxData.findFirst({
    //     where: {
    //       lessonId: params.lessonId,
    //     },
    //   });

    //   if (existingMuxData) {
    //     // Delete existing Mux asset if it exists
    //     await Video.Assets.del(existingMuxData.assetId);
    //     await db.muxData.delete({
    //       where: {
    //         id: existingMuxData.id,
    //       },
    //     });
    //   }

    //   // Create a new Mux asset
    //   const asset = await Video.Assets.create({
    //     input: lesson.videoUrl,
    //     playback_policy: 'public',
    //     test: false,
    //   });

    //   // Store the new Mux data
    //   await db.muxData.create({
    //     data: {
    //       lessonId: params.lessonId,
    //       assetId: asset.id,
    //       playbackId: asset.playback_ids?.[0]?.id,
    //     },
    //   });
    // }

    // Return updated lesson data
    return NextResponse.json(lesson);
  } catch (error) {
    console.log('[COURSES_LESSON_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      lessonId: string;
    };
  }
) {
  try {
    const authResponse = await auth();  // Await the response from auth()
    const userId = authResponse.userId;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId, lessonId } = params;

    // Ensure the lesson exists and belongs to a course the user owns
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete the lesson
    const deletedLesson = await db.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    return NextResponse.json(deletedLesson);
  } catch (error) {
    console.error('[LESSON_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}