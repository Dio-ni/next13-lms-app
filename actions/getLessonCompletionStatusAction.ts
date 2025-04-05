// lib/lessons/getLessonCompletionStatusAction.ts
import { db } from "@/lib/db"; // Prisma instance

export async function getLessonCompletionStatusAction(
  lessonId: string,
  userId: string
) {
  try {
    // Check if the lesson is completed by the user
    const progress = await db.userProgress.findFirst({
      where: {
        lessonId: lessonId,
        userId: userId,
      },
    });

    return progress?.isCompleted ?? false; // Returns true if the lesson is completed, otherwise false
  } catch (error) {
    console.error("Error getting lesson completion status:", error);
    return false;
  }
}
