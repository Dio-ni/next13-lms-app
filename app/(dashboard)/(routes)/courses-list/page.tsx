import Hero from "@/components/Hero";
import { CourseCard } from "@/components/CourseCard";
import { getAllCourses } from "@/actions/get-all-courses";

export const dynamic = "force-static";
export const revalidate = 3600; // revalidate at most every hour

export default async function Home() {
  const courses = await getAllCourses();

  return (
    <div className="mt-16 min-h-screen bg-background">
      <Hero />

      {/* Courses Grid */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-sm font-medium text-muted-foreground">
            Барлық курстар
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              imageUrl={course.imageUrl || ""}
              modulesLength={course.modules.length}
              progress={null} // Assume you will add progress logic later
              category={course.category?.name || "Uncategorized"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
