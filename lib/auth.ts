import { db } from "@/lib/db";  // Prisma client
import { currentUser } from "@clerk/nextjs/server";  // Clerk authentication
import { redirect } from "next/navigation";  // Next.js navigation for redirection

interface AuthResult {
  isAuthorized: boolean;
  redirect?: string;
}

export async function checkCourseAccess(
  clerkId: string,
  courseId: string
): Promise<AuthResult> {
  // Check if the user is authenticated
  if (!clerkId) {
    return {
      isAuthorized: false,
      redirect: "/",  // Redirect to the home page if user is not authenticated
    };
  }

  // Fetch the user details from the Clerk system
  const user = await currentUser();
  if (!user || user.id !== clerkId) {
    return {
      isAuthorized: false,
      redirect: "/",  // Redirect to the home page if user ID does not match
    };
  }

  // Check if the user is enrolled in the course
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {  // Ensure a unique combination of user and course
        userId: clerkId,
        courseId,
      },
    },
  });

  if (!enrollment) {
    // If the user is not enrolled in the course, redirect them to the course page
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    return {
      isAuthorized: false,
      redirect: `/courses/${course?.id || ""}`,  // Redirect to the course page if not enrolled
    };
  }

  // If the user is enrolled in the course, return authorized
  return {
    isAuthorized: true,
  };
}
