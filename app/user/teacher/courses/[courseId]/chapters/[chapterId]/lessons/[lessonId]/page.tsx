
import { auth } from '@clerk/nextjs';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { LessonTitleForm } from './components/lesson-title-form';
import { LessonContentForm } from './components/lesson-content-form';
import { LessonVideoForm } from './components/lesson-video-form';
// // import { LessonVideoForm } from './components/lesson-video-form';
import { LessonImageForm } from './components/lesson-image-form';
import { Actions } from './components/actions';
// import { ImageForm } from './components/image-form';

const LessonIdPage = async ({
  params,
}: {
  params: { courseId: string; lessonId: string; chapterId: string};
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  const lesson = await db.lesson.findUnique({
    where: {
      id: params.lessonId,
    },
    
  });

  if (!lesson) {
    return redirect('/');
  }

  const requiredFields = [lesson.title, lesson.content];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/user/teacher/courses/${params.courseId}`}
              className="flex items-center mb-6 text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Lesson Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <div>
              <Actions
                lessonId={params.lessonId}
                courseId={params.courseId}
              />
                <Button
                  // disabled={!isComplete}
                  // courseId={params.courseId}
                  // lessonId={params.lessonId}
                >
                  Save Lesson
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div className="space-y-4">
            {/* Lesson Title Form */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your lesson</h2>
              </div>
              <LessonTitleForm
                lessonId={params.lessonId}
                chapterId= {params.chapterId}
                courseId={params.courseId}
                initialData={lesson}
              />
            </div>
            {/* Lesson Content Form */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Lesson Content</h2>
              </div>
              <LessonContentForm
                chapterId= {params.chapterId}
                courseId={params.courseId}
                lessonId={params.lessonId}
                initialData={lesson}
              />
            </div>
          </div>
          <div>
            {/* Lesson Video URL Form */}
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <LessonVideoForm
              initialData={lesson}
              chapterId= {params.chapterId}
              lessonId={params.lessonId}
              courseId={params.courseId}
            />
            {/* Lesson Image URL Form */}
            {/* <LessonImageForm
              initialData={lesson}
              lessonId={params.lessonId}
              courseId={params.courseId}
              chapterId={params.chapterId}
            /> */}
             {/* <ImageForm 
              initialData={lesson}
              lessonId={params.lessonId}
              courseId={params.courseId}
              chapterId={params.chapterId} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonIdPage;
