import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getCourseById } from "@/actions/getCourseById";  // Assuming Prisma-based function
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getCourseProgress } from "@/actions/getCourseProgress";  // Assuming Prisma-based function
import { checkCourseAccess } from "@/lib/auth";  // Check course access (Prisma)

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const user = await currentUser();  // Fetch the current authenticated user
  const { courseId } = await params;  // Extract courseId from params

  // Redirect if the user is not logged in
  if (!user?.id) {
    return redirect("/");  
  }

  // Check if the user has access to the course
  const authResult = await checkCourseAccess(user.id, courseId);
  if (!authResult.isAuthorized) {
    return redirect(authResult.redirect!);  // Redirect if the user is not authorized to access the course
  }

  // Fetch course data and user progress in parallel
  const [course, progress] = await Promise.all([
    getCourseById(courseId),  // Get course details using Prisma
    getCourseProgress(user.id, courseId),  // Get user's progress for the course
  ]);

  // Redirect to "my courses" if the course is not found
  if (!course) {
    return redirect("/");
  }
  console.log(progress.completedLessons)

  return (
    <div className="h-full">
      <Sidebar course={course} completedLessons={progress.completedLessons} />
      <main className="h-full lg:pt-[64px] pl-20 lg:pl-96">
        {children}  {/* Render child components here */}
      </main>
    </div>
  );
}
