
import { db } from "@/lib/db";

export const searchCourses = async (searchTerm: string) => {
  // Fetch all courses that match the search term
  const courses = await db.course.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { category: { name: { contains: searchTerm } } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl:true,
      chapters:true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return courses;
};
