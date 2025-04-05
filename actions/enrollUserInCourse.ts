import { db } from "@/lib/db";  // Assuming your Prisma DB instance is imported here

// enrollUserInCourse function
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
      throw new Error("You are already enrolled in this course");
    }

    await db.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });
    console.log(userId,courseId)
  } catch (error) {
    
    console.error("Error enrolling user:", error);
    throw new Error("Enrollment failed");
  }
}
