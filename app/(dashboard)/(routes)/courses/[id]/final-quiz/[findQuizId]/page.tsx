'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/dist/client/link';
import { ArrowLeft } from 'lucide-react';

interface QuizData {
  id: string;
  title: string;
  questions: {
    id: string;
    text: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

interface QuizResult {
  score: number;
  answers: string[];
}

export default function FinalQuizPage({
  params,
}: {
  params: { 
    id: string;
    findQuizId: string;
  };
}) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${params.findQuizId}`);
      if (!res.ok) throw new Error('Quiz жүктелмеді');
      const data: QuizData = await res.json();
      if (!data || !data.questions) throw new Error('Quiz табылмады немесе бос');
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(''));
    } catch (error) {
      console.error(error);
      toast.error('Қате пайда болды');
    } finally {
      setLoading(false);
    }
  };

  fetchQuiz();
}, [params.findQuizId]);
const resetCourseProgress = async () => {
  try {
    const res = await fetch(`/api/courses/${params.id}/reset-progress`, {
      method: 'POST',
    });

    if (!res.ok) {
      toast.error('Прогресс өшіру кезінде қате пайда болды');
      return;
    }

    toast.success('Курс прогресі сәтті өшірілді');
    // Обнуляем состояние, чтобы можно было пройти заново
    setAnswers(new Array(quiz?.questions.length || 0).fill(''));
    setSubmitted(false);
    setScore(0);
  } catch (e) {
    console.error(e);
    toast.error('Қате пайда болды');
  }
};

// загрузка результата после загрузки викторины
useEffect(() => {
  const fetchResult = async () => {
    if (!quiz) return;
    try {
      const res = await fetch(`/api/quizzes/${params.findQuizId}/results/courseQuiz`);
      if (!res.ok) return;
      const resultData: QuizResult = await res.json();
      if (resultData && Array.isArray(resultData.answers)) {
        setAnswers(resultData.answers);
        // Convert score to percentage
        const pctScore = Math.round((resultData.score / quiz.questions.length) * 100);
        setScore(pctScore);
        setSubmitted(true);
        toast.success('Сіз бұл тестті бұған дейін аяқтадыңыз!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  fetchResult();
}, [quiz, params.findQuizId]);


  const handleSelect = (qIndex: number, optionId: string) => {
    console.log("id",qIndex,' ',optionId)
    if (submitted) return;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIndex] = optionId;
      return updated;
    });
  };
const handleResetConfirm = () => {
  toast((t) => (
    <div className="space-y-2">
      <p className="font-medium">Барлық прогресс өшіріледі. Жалғастыруды қалайсыз ба?</p>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={async () => {
            toast.dismiss(t.id);
            // const confirm2 = window.confirm('Сенімдісіз бе? Бұл әрекет қайтымсыз!');
             ;

            await resetCourseProgress();
            return
          }}
        >
          Иә, өшіру
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.dismiss(t.id)}
        >
          Бас тарту
        </Button>
      </div>
    </div>
  ), { duration: 10000 });
};

  const handleSubmit = async () => {
    if (answers.includes('')) {
      toast.error('Барлық сұрақтарға жауап беріңіз');
      return;
    }

    let newScore = 0;
    let finalScore = 0
    quiz?.questions.forEach((q, i) => {
      const selectedOption = q.options.find(o => o.id === answers[i]);
      if (selectedOption?.isCorrect) newScore++;
      
      finalScore =  Math.round((newScore/ quiz.questions.length) * 100);
    });
    
    setScore(finalScore);
    setSubmitted(true);

    try {
      console.log(answers)
      const res = await fetch(`/api/quizzes/${params.findQuizId}/results/courseQuiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers,
          score: newScore,
          courseId: params.id }),
      });

      if (!res.ok) {
        toast.error('Нәтижені сақтау кезінде қате болды');
      } else {
        toast.success('Нәтиже сақталды');
      }
    } catch (error) {
      console.error(error);
      toast.error('Қате пайда болды');
    }
  };

  if (loading) return <p>Тест жүктелуде...</p>;

  if (!quiz) return <p>Quiz табылмады</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 py-20">
      <Link
        href={`/teacher/courses/${params.id}`}
        className="flex items-center mb-6  text-sm transition hover:opacity-75"
      >
        <ArrowLeft className="w-4 h-4 mr-2 " /> Курсты өңдеуге оралу
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      {quiz.questions.map((q, qIndex) => (
        <div key={q.id} className="mb-6 p-4 border rounded-md">
          <p className="font-medium mb-2">
            {qIndex + 1}. {q.text}
          </p>
          <div className="space-y-2">
            {q.options.map((o) => {
              const isSelected = answers[qIndex] === o.id;
              let optionStyle = '';

                // if (submitted) {
                //   if (isSelected && o.isCorrect) {
                //     optionStyle = 'text-green-600 font-semibold';
                //   } else if (isSelected && !o.isCorrect) {
                //     optionStyle = 'text-red-600 line-through';
                //   } else if (o.isCorrect) {
                //     optionStyle = 'text-green-600';
                //   }
                // }

              return (
                <div key={o.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={isSelected}
                    onChange={() => handleSelect(qIndex, o.id)}
                    className="accent-green-500"
                    disabled={submitted}
                  />
                  <label htmlFor={`question-${qIndex}`} className={optionStyle}>
                    {o.text}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {submitted ? (
        <div className="mt-4">
          <p className="text-lg font-semibold">
            Сіздің нәтижеңіз: {score} %
          </p>
        </div>
      ) : (
        <Button onClick={handleSubmit}>Аяқтау</Button>
      )}
      {submitted && (
        <div className="mt-6 space-y-4">
          
          <Button variant="secondary" onClick={handleResetConfirm}>
            Курсты қайта өту
          </Button>

        </div>
      )}

    </div>
  );
}
