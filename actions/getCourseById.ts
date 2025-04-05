import { db } from '@/lib/db';  // Prisma database instance
import { Category, Course, Lesson } from '@prisma/client';

type CourseWithDetails = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: Category | null;
  chapters: {
    id: string;
    title:string;
    lessons: Lesson[]; // Full Lesson data structure
  }[];
};

export const getCourseById = async (courseId: string): Promise<CourseWithDetails | null> => {
  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        category: true,  // Include the associated category
        chapters: {
          where: {
            isPublished: true,  // Only include published chapters
          },
          select: {
            id: true,
            title:true,  // Select only the chapter id
            lessons: { // Include lessons with full details
               // Only include published lessons
              select: {
                id: true, // Select the lesson id
                title: true, // Select the lesson title
                content: true, // Select the lesson content
                videoUrl: true, // Select the lesson videoUrl
                chapterId: true, // Select the lesson's chapterId
                createdAt: true, // Select the lesson's createdAt
                updatedAt: true, // Select the lesson's updatedAt
              },
            },
          },
        },
      },
    });

    if (!course) {
      return null;  // Return null if the course is not found
    }

    const courseDetails: CourseWithDetails = {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      category: course.category,  // Attach the category details
      chapters: course.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        lessons: chapter.lessons,  // Attach the lessons details for each chapter
      })),
    };

    return courseDetails;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
};
