import { db } from "@/lib/db"; // Assuming db instance for querying Prisma
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
// import { auth } from "@clerk/nextjs/server";
import { isEnrolledInCourse } from "@/actions/isEnrolledInCourse";
import { auth } from '@clerk/nextjs';

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;

  // Query course data
  const course = await db.course.findUnique({
    where: { id },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          lessons: {
            where: {
              // isPublished: true, // Only show published lessons
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
  const { userId } = await auth();
  const isEnrolled =
    userId && course.id
      ? await isEnrolledInCourse(userId, course.id) // Adjust function to check based on your schema
      : false;
    console.log(userId)
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
              <div className="text-3xl font-bold text-white mb-4">
                Free
              </div>
              <EnrollButton courseId={course.id} isEnrolled={isEnrolled} userId={userId} />
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
                {course.chapters?.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="border border-border rounded-lg"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium">
                        Chapter {index + 1}: {chapter.title}
                      </h3>
                    </div>

                    {/* Lessons */}
                    <div className="divide-y divide-border">
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
