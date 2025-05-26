'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface QuizData {
  title: string;
  questions: {
    text: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

const QuizTakingPage: React.FC<{ moduleId: string }> = ({ moduleId }) => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<number[]>([]); // индекс выбранного ответа для каждого вопроса
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quizzes?moduleId=${moduleId}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
          setAnswers(new Array(data.questions.length).fill(-1)); // -1: не выбран
        } else {
          toast.error('Quiz жүктелмеді');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuiz();
  }, [moduleId]);

  const handleSelect = (qIndex: number, oIndex: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIndex] = oIndex;
      return updated;
    });
  };

  const handleSubmit = () => {
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
  };

  if (!quiz) return <p>Тест жүктелуде...</p>;

  return (
    // <div className="max-w-2xl mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

    //   {quiz.questions.map((q, qIndex) => (
    //     <div key={qIndex} className="mb-6 p-4 border rounded-md">
    //       <p className="font-medium mb-2">
    //         {qIndex + 1}. {q.text}
    //       </p>
    //       <div className="space-y-2">
    //         {q.options.map((o, oIndex) => (
    //           <div key={oIndex} className="flex items-center gap-2">
    //             <input
    //               type="radio"
    //               name={`question-${qIndex}`}
    //               checked={answers[qIndex] === oIndex}
    //               onChange={() => handleSelect(qIndex, oIndex)}
    //               className="accent-green-500"
    //             />
    //             <label>{o.text}</label>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   ))}

    //   {submitted ? (
    //     <div className="mt-4">
    //       <p className="text-lg font-semibold">
    //         Сіздің нәтижеңіз: {score} / {quiz.questions.length}
    //       </p>
    //     </div>
    //   ) : (
    //     <Button onClick={handleSubmit}>Завершить тест</Button>
    //   )}
    // </div>
    <div>eydue</div>
  );
};

export default QuizTakingPage;
