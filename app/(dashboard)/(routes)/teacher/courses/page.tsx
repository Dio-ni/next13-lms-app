import { redirect } from 'next/navigation';
import { auth } from "@clerk/nextjs/server";
import { db } from '@/lib/db';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import Link from 'next/link';

const CoursesPage = async () => {
  const authResponse = await auth();  // Await the response from auth()

  const userId = authResponse.userId;
  
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
        <div className="text-center text-muted-foreground py-12 flex flex-col">
          <h1>Сіз әлі курс жасаған жоқсыз</h1>
          <Link href="/teacher/create">
          <Button className='mt-4'>
            <PlusCircle className="w-4 h-4 mr-2" />
            Жаңа курс
          </Button>
        </Link>
        </div>
      ) : (
        <DataTable columns={columns} data={courses} />
      )}

      </div>
    </div>
  );
};

export default CoursesPage;