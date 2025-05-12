import { db } from '@/lib/db';
import { Category, Course } from '@prisma/client';

type CourseWithDetails = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: Category | null;
  modules: {
    id: string;
    title: string;
    chapters: { id: string }[];
  }[];
};

export const getAllCourses = async (): Promise<CourseWithDetails[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        modules: {
          include: {
            chapters: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};
