import { redirect } from "next/navigation";
import { getCourseById } from "@/actions/getCourseById";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) {
    // If the course is not found, redirect to the homepage
    return redirect("/user");
  }

  // Check if there are modules and lessons in the course
  
  if (course.chapters?.[0]?.lessons?.[0]?.id) {
    return redirect(
      `/dashboard/courses/${courseId}/lessons/${course.chapters[0].lessons[0].id}`
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome to {course.title}</h2>
        <p className="text-muted-foreground">
          This course has no content yet. Please check back later.
        </p>
      </div>
    </div>
  );
}
