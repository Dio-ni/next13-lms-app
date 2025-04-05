"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const getCompletedLessons = async (courseId: string) => {
  const { userId } = auth();

  if (!userId) return [];

  const lessons = await db.userProgress.findMany({
    where: {
      userId,
      lesson: {
        chapter: {
          courseId,
        },
      },
      isCompleted: true,
    },
    select: {
      lessonId: true,
    },
  });

  return lessons.map((l) => ({ id: l.lessonId }));
};
