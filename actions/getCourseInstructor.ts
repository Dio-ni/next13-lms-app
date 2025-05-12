// app/actions/getCourseInstructor.ts
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";

export const getCourseInstructor = async (courseId: string) => {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        userId: true,
      },
    });

    if (!course) return null;

    const user = await clerkClient.users.getUser(course.userId);

    return {
      name: user.firstName + " " + (user.lastName ?? ""),
      email: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
    };
  } catch (error) {
    console.error("[GET_COURSE_INSTRUCTOR_ERROR]", error);
    return null;
  }
};
