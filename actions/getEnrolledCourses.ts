import { db } from "@/lib/db";

// Fetch enrolled courses for a given userId
export async function getEnrolledCourses(userId?: string) {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
            modules: {
              include: {
                chapters: {
                  include: {
                    lessons: {
                      select: {
                        id: true,
                        title: true,
                        content: true,
                        videoUrl: true,
                        imageUrl: true,
                        chapterId: true,
                        createdAt: true,
                        updatedAt: true,
                      },
                    },
                  },
                },
              },
            },
            attachments: true,
          },
        },
      },
    });

    if (!enrollments.length) return [];

    return enrollments
      .filter((enrollment) => enrollment.course) // убираем null курсы
      .map(({ course }) => ({
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          imageUrl: course.imageUrl,
          isPublished: course.isPublished,
          category: course.category?.name,
          modules: course.modules?.map((module) => ({
            id: module.id,
            title: module.title,
            chapters: module.chapters?.map((chapter) => ({
              id: chapter.id,
              title: chapter.title,
              lessons: chapter.lessons || [],
            })) || [],
          })) || [],
          attachments: course.attachments || [],
        },
      }));
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw new Error("Failed to fetch enrolled courses.");
  }
}
