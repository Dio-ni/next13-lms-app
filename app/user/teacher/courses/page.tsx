import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

import { DataTable } from './components/data-table';
import { columns } from './components/columns';

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
    },
  });

  return (
    <div className="h-full pt-16">
      <div className="container mx-auto px-4 py-8">
      {courses.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          You haven’t created any courses yet.
        </div>
      ) : (
        <DataTable columns={columns} data={courses} />
      )}

      </div>
    </div>
  );
};

export default CoursesPage;
