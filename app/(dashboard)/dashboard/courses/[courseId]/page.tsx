import { redirect } from "next/navigation";
import { getCourseById } from "@/actions/getCourseById";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = params;
  const course = await getCourseById(courseId);

  if (!course) {
    return redirect("/");
  }

  // Find the first available lesson in the course
  const firstLessonId = course.modules?.[0]?.chapters?.[0]?.lessons?.[0]?.id;

  if (firstLessonId) {
    return redirect(`/dashboard/courses/${courseId}/lessons/${firstLessonId}`);
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
