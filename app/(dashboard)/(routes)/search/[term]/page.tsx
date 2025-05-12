import { Search } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { searchCourses } from "@/actions/searchCourses";

interface SearchPageProps {
  params: Promise<{
    term: string;
  }>;
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { term } = await params;
  const decodedTerm = decodeURIComponent(term);
  const courses = await searchCourses(decodedTerm);

  return (
    <div className="h-full pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Search className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Іздеу нәтижелері</h1>
            <p className="text-muted-foreground">
            "{decodedTerm}" бойынша {courses.length} нәтиже{courses.length === 1 ? "" : "лер"} табылды

            </p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Курстар табылмады</h2>
            <p className="text-muted-foreground mb-8">
            Әртүрлі сөздермен іздеп көріңіз
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        )}
      </div>
    </div>
  );
}
