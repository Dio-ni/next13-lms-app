import { db } from "@/lib/db"; // Assuming db instance for querying Prisma
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import { isEnrolledInCourse } from "@/actions/isEnrolledInCourse";
import { currentUser } from "@clerk/nextjs/server";

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;

  // Query course data with modules and chapters
  const course = await db.course.findUnique({
    where: { id },
    include: {
      category: true,
      modules: { // First level is modules
        select: {
          id: true,
          title: true,
          chapters: { // Each module contains chapters
            
            select: {
              id: true,
              title: true,
              lessons: { // Each chapter contains lessons
                where: {
                  // Optional conditions like published lessons
                },
                select: {
                  id: true,
                  title: true,
                  content: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Check if course exists
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold">Course not found</h1>
      </div>
    );
  }

  // Authentication and enrollment check
  const user = await currentUser();
  const isEnrolled =
    user?.id && course.id
      ? await isEnrolledInCourse(user?.id, course.id)
      : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        {course.imageUrl && (
          <Image
            src={course.imageUrl}
            alt={course.title || "Course Title"}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-black/60" />
        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-12">
          <Link
            href="/"
            prefetch={false}
            className="text-white mb-8 flex items-center hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Courses
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                  {course.category?.name || "Uncategorized"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl">
                {course.description}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:min-w-[300px]">
              <div className="text-3xl font-bold text-white mb-4">Free</div>
              <EnrollButton courseId={course.id} isEnrolled={isEnrolled} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 mb-8 border border-border">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.modules?.map((module, index) => (
                  <div key={module.id} className="">
                    
                      <h3 className="font-medium">
                        Module {index + 1}: {module.title}
                      </h3>
                    

                    {/* Chapters within the module */}
                    {module.chapters?.map((chapter, chapterIndex) => (
                      <div key={chapter.id} className="border-t border-border p-4">
                        <h4 className="font-medium">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </h4>
                        <div className="space-y-2">
                          {/* Lessons within the chapter */}
                          {chapter.lessons?.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="p-4 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                                  {lessonIndex + 1}
                                </div>
                                <div className="flex items-center gap-3 text-foreground">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{lesson.title}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-card rounded-lg p-6 sticky top-4 border border-border">
              <h2 className="text-xl font-bold mb-4">Instructor</h2>
              {/* You can add instructor details if you wish */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
