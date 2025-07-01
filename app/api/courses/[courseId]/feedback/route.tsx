import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth,currentUser  } from "@clerk/nextjs";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // ❗ await здесь — обязательно!
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: userId }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const { courseId } = params;
    const body = await req.json();

    const { position, timeSpent, impression, difficulty, suggestions } = body;

    // Upsert feedback
    const feedback = await db.courseFeedback.create({
      data: {
        userId,
        email,
        courseId,
        position,
        timeSpent,
        impression,
        difficulty,
        suggestions,
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("[FEEDBACK_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Ensure user is logged in
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    // Get all feedback for this course
    const feedbacks = await db.courseFeedback.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("[GET_FEEDBACK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
