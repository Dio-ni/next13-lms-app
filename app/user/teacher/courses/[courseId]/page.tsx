import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';
import { redirect } from 'next/navigation';

import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import Link from 'next/link';
import { CategoryForm } from './components/category-form';
import { DescriptionForm } from './components/description-form';
import { ImageForm } from './components/image-form';
import { TitleForm } from './components/title-form';
import { CertificateToggleForm } from './components/certificate-form';
import { AttachmentForm } from './components/attachment-form';
// import { ChaptersForm } from './components/chapters-form';
import { Banner } from '@/components/banner';
import { Actions } from './components/actions';
import { ModulesForm } from './components/modules-form';
import { QuizForm } from './components/quiz-form';

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  const authResponse = await auth(); 

  const userId = authResponse.userId;
  
  if (!userId) {
    return redirect('/');
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      modules: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      quiz: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });
  
  
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!course) {
    return redirect('/');
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.modules,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((field) => !!field).length;
  const completionText = `${completedFields}/${totalFields}`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className=" h-full pt-16 container">
        <div className="mx-auto px-4 py-8">
          <div className="flex flex-col gap-y-2">
          <Link
              href={`/user/teacher/courses`}
              className="flex items-center mb-6 text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to courses
            </Link>
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={params.courseId} />
            <DescriptionForm initialData={course} courseId={params.courseId} />
            <ImageForm initialData={course} courseId={params.courseId} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <div>
              <div className="flex items-center gap-x-2 mt-6">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Quiz</h2>
              </div>
              <div className="m-6">
                <CertificateToggleForm 
                  courseId={params.courseId}
                  initialValue={course.certificateEnabled}
                />
              </div>
              {/* <QuizForm 
                courseId={params.courseId} 
                initialData={{
                  quiz: course.quiz, // Assuming course.quiz is a single quiz object
                  questions: course.quiz.questions, // Questions related to the quiz
                }} 
              /> */}

            </div>




          </div>

          {/* Chapter and Lesson form */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ModulesForm initialData={course} courseId={params.courseId} />
            </div>

            {/* Resources & Attachments form */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={params.courseId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
