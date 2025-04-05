import { db } from "@/lib/db"; // Assuming you have a Prisma client instance

// Fetch enrolled courses for a given userId
export async function getEnrolledCourses(userId: string) {
  try {
    // Fetch the enrollments for the given userId
    const enrollments = await db.enrollment.findMany({
      where: {
        userId: userId, // Filter by userId
      },
      include: {
        course: {
          include: {
            category: true,   // Including related category data
            chapters: true,   // Optionally including chapters for the course
            attachments: true, // Optionally including attachments
          },
        },
      },
    });

    // If no enrollments are found for the given userId
    if (enrollments.length === 0) {
      return [];
    }

    // Return the courses data in a usable format
    return enrollments.map((enrollment) => ({
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        imageUrl: enrollment.course.imageUrl,
        isPublished: enrollment.course.isPublished,
        category: enrollment.course.category?.name, // Assuming category has a name
        chapters: enrollment.course.chapters,
        attachments: enrollment.course.attachments,

      },
    }));
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw new Error("Failed to fetch enrolled courses.");
  }
}
