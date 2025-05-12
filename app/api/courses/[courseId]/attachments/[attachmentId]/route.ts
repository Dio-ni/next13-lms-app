import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('COURSE_ID_ATTACHMENTS', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}


export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const attachment = await db.attachment.findUnique({
      where: { id: params.attachmentId },
    });

    if (!attachment) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // Fetch the file from the remote URL
    const fileRes = await fetch(attachment.url);

    if (!fileRes.ok) {
      return new NextResponse("Failed to fetch file", { status: 500 });
    }

    // Get the file as a buffer
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a response with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": fileRes.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${attachment.name}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("DOWNLOAD_ATTACHMENT_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
