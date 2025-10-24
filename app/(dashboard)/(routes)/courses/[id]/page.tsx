import { CourseContent } from './component/course-content'
import { db } from "@/lib/db"; // Assuming db instance for querying Prisma
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import { isEnrolledInCourse } from "@/actions/isEnrolledInCourse";
import { currentUser } from "@clerk/nextjs/server";
import { File } from "lucide-react"; // Make sure this is imported
import { getCompletedLessons } from "@/actions/getCompletedLessons";
import { calculateCourseProgress } from "@/actions/calculateCourseProgress";
import { getCourseInstructor } from "@/actions/getCourseInstructor";
import { CourseProgress } from "@/components/CourseProgress";
import { useState } from "react";
import { CourseFeedbackForm } from './component/CourseFeedbackForm';




interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  



  // Query course data with modules and chapters
  const course = await db.course.findUnique({
    where: { id },
    include: {
      category: true,
      attachments:true,
      finalQuiz: true,
      modules: { // First level is modules
        select: {
          id: true,
          title: true,
          Quiz: true,
          chapters: { // Each module contains chapters
            
            select: {
              id: true,
              title: true,
              lessons: { // Each chapter contains lessons
                orderBy: {
                  createdAt: 'asc',  // Сортировка по дате создания по возрастанию
                },
                select: {
                  id: true,
                  title: true,
                  content: true,
                  createdAt: true,
                  updatedAt: true,
                  videoUrl: true,
                  chapterId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const firstLessonId = course?.modules?.[0]?.chapters?.[0].lessons?.[0].id || ""
  // Check if course exists
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold">Курс табылмады</h1>
      </div>
    );
  }

  // Authentication and enrollment check
  const user = await currentUser();
  const isEnrolled =
    user?.id && course.id
      ? await isEnrolledInCourse(user?.id, course.id)
      : false;
  let progress: number | null = null;

  if (isEnrolled && user?.id) {
    const completedLessons = await getCompletedLessons(course.id);
    progress = calculateCourseProgress(course.modules, completedLessons);
  }
   
let finalExamScore = null;

if (isEnrolled && user?.id && course.finalQuizId) {
  // 1. Найти результат пользователя
  const result = await db.quizResult.findFirst({
    where: { userId: user.id, courseId: course.id }
  });

  // 2. Найти сам финальный тест, чтобы узнать количество вопросов
  const finalQuiz = await db.quiz.findUnique({
    where: { id: course.finalQuizId },
    include: { questions: true },
  });

  if (result && finalQuiz && finalQuiz.questions.length > 0) {
    finalExamScore = Math.round((result.score / finalQuiz.questions.length) * 100);
  } else {
    finalExamScore = null;
  }
}
   

  const instructor = await getCourseInstructor(course.id);

  

  return (
    <div className="min-h-screen bg-background mt-16 ">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full container">
        {course.imageUrl && (
          <Image
            src={course.imageUrl}
            alt={course.title || "Course Title"}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-black/60" />
        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-12">
          <Link
            href="/courses-list"
            prefetch={false}
            className="text-white mb-8 flex items-center hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Курстарға оралу
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                  {course.category?.name || "Uncategorized"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>
              
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:min-w-[300px]">
              <EnrollButton courseId={course.id}  firstLessonId={firstLessonId} isEnrolled={isEnrolled} />
            </div>
          </div>

          {progress != null &&(
            <div className="mt-4">
              <CourseProgress
              progress={progress}
              variant="success"
              label="Курстың прогрессі"
            />
            </div>
          )}
          
        </div>
        
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
          
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <CourseContent course={course} isEnrolled={isEnrolled} />



          {/* Sidebar */}
          <div>
            <div className="bg-card rounded-lg p-6 sticky top-4 border border-border">
            <h2 className="text-xl font-bold mb-4">Автор</h2>
            {instructor ? (
              <div className="flex items-center gap-3">
                <Image src={instructor.imageUrl} 
                width={100}
                height={100}
                alt={instructor.name} 
                className="w-10 h-10 rounded-full"
                 />
                <div>
                  <p className="text-sm font-medium">{instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{instructor.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Автор табылмады</p>
            )}
            {course.finalQuiz && (
                <div className="rounded-lg border border-border p-4 bg-muted/5 mt-16">
                  <h3 className="text-xl font-semibold mb-4 text-primary">
                    🏁 Финалдық тест
                  </h3>
                  <Link
                    href={`/courses/${course.id}/final-quiz/${course.finalQuizId}`}
                    className="inline-block bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-primary/90 transition"
                  >
                    📝 тестті өту
                  </Link>
                </div>
              )}

            {/* Certificate download (only if user is enrolled & has ≥ 80% progress) */}
            {/* Certificate Section */}
            <div className="mt-8">
              {/* Certificate Section */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Сертификат</h2>

                {!isEnrolled ? (
                  <p className="text-sm text-muted-foreground">
                    Сертификат алу үшін алдымен курсқа тіркеліңіз және оны кемінде 80% аяқтаңыз.
                  </p>
                ) : !course.certificateEnabled ? (
                  <p className="text-sm text-muted-foreground">
                    Бұл курс үшін сертификат қолжетімді емес.
                  </p>
                ) : progress === null ? (
                  <p className="text-sm text-muted-foreground">
                    Прогресс анықталмады. Сертификат алу үшін кемінде 80% курсты аяқтауыңыз қажет.
                  </p>
                ) : progress < 80 ? (
                  <p className="text-sm text-muted-foreground">
                    Сертификат алу үшін курсты кемінде 80% аяқтаңыз. Сіздің прогрессіңіз: {progress}%.
                  </p>
                ) : !course.finalQuizId ? (
                  // ✅ Если финального теста нет, выдаём сразу
                  <form
                    action={`/api/courses/${course.id}/certificate/generateCertificate`}
                    method="POST"
                  >
                    <button
                      type="submit"
                      className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
                    >
                      Сертификатты жүктеу
                    </button>
                  </form>
                ) : finalExamScore === null ? (
                  <p className="text-sm text-muted-foreground">
                    Финалдық тест нәтижесі табылмады. Сертификат алу үшін финалдық тестті тапсырыңыз.
                  </p>
                ) : finalExamScore < 80 ? (
                  <p className="text-sm text-muted-foreground">
                    Сертификат алу үшін финалдық тесттен кемінде 80% жинаңыз. Сіздің нәтижеңіз: {finalExamScore}%.
                  </p>
                ) : (
                  <form
                    action={`/api/courses/${course.id}/certificate/generateCertificate`}
                    method="POST"
                  >
                    <button
                      type="submit"
                      className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
                    >
                      Сертификатты жүктеу
                    </button>
                  </form>
                )}
              </div>


            </div>

             
              <div className="space-y-3 my-6">
                <h3 className="font-semibold text-lg">Курстың тіркемелері
                </h3>
                {course.attachments.length === 0 && (
                  <p className="text-sm text-muted-foreground">Тіркемелер жоқ.</p>
                )}
                {course.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full p-3 border rounded-sm border-sky-200 text-sky-700 hover:bg-sky-50 transition"
                  >
                    <File className="flex-shrink-0 w-4 h-4 mr-2" />
                    <p className="text-sm line-clamp-1">{attachment.name}</p>
                  </a>
                
                  
                ))}
              </div>
              

            </div>
          </div>
          
        </div>
        <CourseFeedbackForm courseId={course.id} />
      </div>
    </div>
    
  );
}
