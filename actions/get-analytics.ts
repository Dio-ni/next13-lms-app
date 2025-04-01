import { db } from '@/lib/db';
import { Course } from '@prisma/client';

export const getAnalytics = async (userId: string) => {
  try {
    const courses = await db.course.findMany({
      where: {
        userId: userId,
      },
      select: {
        title: true,
        price: true,
      },
    });

    const totalRevenue = courses.reduce((acc, course) => acc + (course.price || 0), 0);

    return {
      data: courses.map((course) => ({
        name: course.title,
        total: course.price || 0,
      })),
      totalRevenue,
    };
  } catch (error) {
    console.log('[GET_ANALYTICS]', error);
    return {
      data: [],
      totalRevenue: 0,
    };
  }
};
