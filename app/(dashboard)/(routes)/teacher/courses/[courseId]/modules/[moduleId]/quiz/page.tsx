'use client';

import { QuizForm, QuizFormData } from "@/components/quiz-form";
import { ArrowLeft } from "lucide-react";
import router from "next/router";
import Link from 'next/link';

const CreateCourseQuizPage = ({ params }: { params: { courseId: string, moduleId: string } }) => {
    // console.log(params.moduleId)
  
const backToCourseEdit = (courseId: string) => {
    router.push(`/teacher/courses/${courseId}`);
  };
  return (
    <div className="my-20 mx-16">
      
       
      <Link
        href={`/teacher/courses/${params.courseId}`}
        className="flex items-center mb-6  text-sm transition hover:opacity-75"
      >
        <ArrowLeft className="w-4 h-4 mr-2 " /> Курсты өңдеуге оралу
      </Link>
      <h1 className="text-2xl font-bold mb-4">Модульға арналған тест құру</h1>
      <QuizForm
        moduleId={params.moduleId}
      />
    </div>
  );
};

export default CreateCourseQuizPage;