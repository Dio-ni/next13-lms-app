import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getLessonById } from "@/actions/getLessonById";
import { PortableText } from "@portabletext/react";
import { LoomEmbed } from "@/components/LoomEmbed";
import VideoPlayer from "@/components/VideoPlayer";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
import { auth } from '@clerk/nextjs';

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  // const user = await currentUser();
  const { userId } = auth(); // Fetch current user asynchronously
  const { courseId, lessonId } = await params;

  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    return redirect(`/dashboard/courses/${courseId}`);
  }

  // If user is null, redirect to login or show an error message
  if (!userId) {
    return redirect("/user"); // or show a custom message like "Please log in"
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

          {lesson.content && (
            <p className="text-muted-foreground mb-8">{lesson.content}</p>
          )}

          <div className="space-y-8">
            {/* Video Section */}
            {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}

            {/* Loom Embed Video if loomUrl is provided */}
            {/* {lesson.loomUrl && <LoomEmbed shareUrl={lesson.loomUrl} />} */}

            {/* Lesson Content */}
            {lesson.content && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Lesson Notes</h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  {/* <PortableText value={lesson.content} /> */}
                  {lesson.content}
                </div>
              </div>
            )}

            {/* Only show the LessonCompleteButton if the user is authenticated */}
            {userId && (
              <div className="flex justify-end">
                <LessonCompleteButton lessonId={lesson.id} clerkId={userId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
