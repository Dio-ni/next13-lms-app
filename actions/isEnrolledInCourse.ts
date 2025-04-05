import { db } from "@/lib/db"; // Assuming you have a db instance for querying Prisma

export async function isEnrolledInCourse(userId: string, courseId: string) {
  const enrollment = await db.enrollment.findFirst({
    where: {
      userId: userId,
      courseId: courseId,
    },
  });

  return enrollment ? true : false;
}
