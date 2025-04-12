import { db } from '@/lib/db';
import { Category, Course, Lesson } from '@prisma/client';

type CourseWithDetails = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: Category | null;
  modules: {
    id: string;
    title: string;
    chapters: {
      id: string;
      title: string;
      lessons: Lesson[];
    }[];
  }[];
};

export const getCourseById = async (courseId: string): Promise<CourseWithDetails | null> => {
  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
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
      },
    });

    if (!course) {
      return null;
    }

    const courseDetails: CourseWithDetails = {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      category: course.category,
      modules: course.modules.map((module) => ({
        id: module.id,
        title: module.title,
        chapters: module.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          lessons: chapter.lessons,
        })),
      })),
    };

    return courseDetails;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
};
