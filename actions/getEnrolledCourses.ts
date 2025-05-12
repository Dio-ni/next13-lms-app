import { db } from "@/lib/db";

// Fetch enrolled courses for a given userId
export async function getEnrolledCourses(userId?: string) {
  try {
    const enrollments = await db.enrollment.findMany({
      where: {
        userId: userId,
      },
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

    if (enrollments.length === 0) {
      return [];
    }

    return enrollments.map((enrollment) => ({
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        imageUrl: enrollment.course.imageUrl,
        isPublished: enrollment.course.isPublished,
        category: enrollment.course.category?.name,
        modules: enrollment.course.modules.map((module) => ({
          id: module.id,
          title: module.title,
          chapters: module.chapters.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            lessons: chapter.lessons,
          })),
        })),
        attachments: enrollment.course.attachments,
      },
    }));
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw new Error("Failed to fetch enrolled courses.");
  }
}
