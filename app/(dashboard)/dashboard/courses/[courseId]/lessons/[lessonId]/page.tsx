
import { redirect } from "next/navigation";
import { auth } from '@clerk/nextjs';
import { getLessonById } from "@/actions/getLessonById";
import { Preview } from "@/components/preview";
import VideoPlayer from "@/components/VideoPlayer";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
import Image from 'next/image';
// import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
 // Assuming you have a spinner component

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { userId } = auth(); // Fetch current user asynchronously
  const { courseId, lessonId } = await params;

  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    return redirect(`/dashboard/courses/${courseId}`);
  }

  // const [isImageLoading, setIsImageLoading] = useState(true); // State for image loading
  // const [isVideoLoading, setIsVideoLoading] = useState(true); // State for video loading

  // const handleImageLoad = () => {
  //   setIsImageLoading(false); // Image has finished loading
  // };

  

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

          <div className="space-y-8">
            {/* Video Section */}
            {lesson.videoUrl && (
              <div className="relative">
                {/* {isVideoLoading && <LoadingSpinner />} Show spinner while video is loading */}
                <VideoPlayer url={lesson.videoUrl}  />
              </div>
            )}

            {/* Image Section */}
            {lesson.imageUrl && (
              <div className="mt-2 w-full">
                <Image
                  alt="Lesson image"
                  src={lesson.imageUrl}
                  width={1200}        // можно указать примерную ширину
                  height={800}        // высота подберётся пропорционально
                  className="w-full h-auto rounded-md"
                />
              </div>


            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Сабақ жазбалары</h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <Preview value={lesson.content} />
                </div>
              </div>
            )}

            {/* Only show the LessonCompleteButton if the user is authenticated */}
            {userId && (
              <div className="relative w-full">
                <LessonCompleteButton lessonId={lesson.id} courseId={courseId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
