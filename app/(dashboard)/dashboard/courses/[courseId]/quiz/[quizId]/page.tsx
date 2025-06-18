'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

interface QuizData {
  id: string;
  title: string;
  moduleId: string;
  questions: {
    text: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

interface QuizResultData {
  score: number;
  answers: number[];
}

export default function QuizTakingPage({
  params,
}: {
  params: { courseId: string; quizId: string };
}) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const fetchQuizAndResult = async () => {
      setLoading(true);
      try {
        // Fetch quiz by quiz ID
        const quizRes = await fetch(`/api/quizzes/${params.quizId}`);
        if (!quizRes.ok) {
          toast.error('Quiz жүктелмеді');
          setLoading(false);
          return;
        }
        const quizData: QuizData = await quizRes.json();
        if (!quizData || !quizData.questions) {
          toast.error('Quiz табылмады немесе бос');
          setLoading(false);
          return;
        }

        setQuiz(quizData);

        // Fetch result by moduleId
        // const resultRes = await fetch(`/api/quizzes/results?moduleId=${quizData.moduleId}`);
        const resultRes = await fetch(`/api/quizzes/${params.quizId}/results`);

        if (resultRes.ok) {
          const resultData: QuizResultData = await resultRes.json();
          if (resultData && resultData.answers.length === quizData.questions.length) {
            setAnswers(resultData.answers);
            setScore(resultData.score);
            setSubmitted(true);
            setAlreadySubmitted(true);
          } else {
            setAnswers(new Array(quizData.questions.length).fill(-1));
          }
        } else {
          setAnswers(new Array(quizData.questions.length).fill(-1));
        }
      } catch (error) {
        console.error(error);
        toast.error('Қате пайда болды');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndResult();
  }, [params.courseId]);

  const handleSelect = (qIndex: number, oIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIndex] = oIndex;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      toast.error('Барлық сұрақтарға жауап беріңіз');
      return;
    }

    let newScore = 0;
    quiz?.questions.forEach((q, i) => {
      if (q.options[answers[i]].isCorrect) {
        newScore++;
      }
    });

    setScore(newScore);
    setSubmitted(true);

    try {
      const res = await fetch(`/api/quizzes/${quiz?.id}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          score: newScore,
        }),
      });


      if (!res.ok) {
        toast.error('Нәтижені сақтау кезінде қате болды');
      } else {
        setAlreadySubmitted(true);
        toast.success('Нәтиже сақталды');
      }
    } catch (error) {
      console.error(error);
      toast.error('Нәтижені сақтау кезінде қате пайда болды');
    }
  };

  if (!quiz) return <p>Quiz табылмады</p>;

  return (
    <div className="max-w-2xl mx-auto pb-12 ">
      {/* <a
        href={`/courses/${params.courseId}`}
        className="my-4 flex items-center gap-x-2 text-sm hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Курска қайта оралу</span>
      </a> */}

      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border rounded-md">
          <p className="font-medium mb-2">
            {qIndex + 1}. {q.text}
          </p>
          <div className="space-y-2">
            {q.options.map((o, oIndex) => {
              const isSelected = answers[qIndex] === oIndex;
              const isCorrect = o.isCorrect;

              let optionStyle = '';
              if (submitted) {
                if (isSelected && isCorrect) {
                  optionStyle = 'text-green-600 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'text-red-600 line-through';
                } else if (isCorrect) {
                  optionStyle = 'text-green-600';
                }
              }

              return (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={isSelected}
                    onChange={() => handleSelect(qIndex, oIndex)}
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
            Сіздің нәтижеңіз: {score} / {quiz.questions.length}
          </p>
          {alreadySubmitted && (
            <p className="text-sm text-gray-500 mt-2">Сіз бұл тестті бұрын тапсырдыңыз.</p>
          )}
        </div>
      ) : (
        <Button onClick={handleSubmit}>Завершить тест</Button>
      )}
    </div>
  );
}
