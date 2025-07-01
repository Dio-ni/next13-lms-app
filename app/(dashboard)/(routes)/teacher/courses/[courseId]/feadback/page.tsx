import { TeacherFeedback } from "../components/feadback-page";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/dist/client/link";
import { redirect } from "next/navigation";

interface FeedbackPageProps {
  params: {
    courseId: string;
  };
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/"); // или покажите 401
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId, // чтобы только владелец курса мог смотреть отзывы
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (!course) {
    redirect("/"); // или 404
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
        <Link
              href={`/teacher/courses/${params.courseId}/`}
              className="flex items-center mb-6 text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Курсты өңдеуге қайту
            </Link>
      <h1 className="text-3xl font-bold mb-6">
        {course.title} — Сауалнамалар
      </h1>
      <TeacherFeedback courseId={course.id} />
    </div>
  );
}
