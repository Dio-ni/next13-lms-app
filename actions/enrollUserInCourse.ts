'use server';

import { db } from "@/lib/db";

export async function enrollUserInCourse(userId: string, courseId: string) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const existingEnrollment = await db.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      throw new Error("Already enrolled");
    }

    await db.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error enrolling user:", error);
    throw new Error("Enrollment failed");
  }
}
