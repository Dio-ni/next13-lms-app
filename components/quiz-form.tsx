'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export interface QuizFormData {
  title: string;
  questions: {
    text: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

interface QuizFormProps {
  moduleId?: string;
  courseId?: string;
  initialData?: QuizFormData;
  onSubmit?: (data: QuizFormData) => void;
}

export const QuizForm: React.FC<QuizFormProps> = ({
  moduleId,
  courseId,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [questions, setQuestions] = useState<QuizFormData['questions']>(
    initialData?.questions || []
  );

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchQuiz = async () => {
    try {
      setIsLoading(true);

      let url = '';
      if (moduleId) {
        url = `/api/quizzes?moduleId=${moduleId}`;
      } else if (courseId) {
        url = `/api/quizzes?courseId=${courseId}`;
      } else {
        setIsLoading(false);
        return;
      }

      const res = await fetch(url);
      if (!res.ok) {
        console.error('Error fetching quiz');
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      if (data) {
        setTitle(data.title || '');
        setQuestions(
          (data.questions || []).map((q: any) => ({
            text: q.text,
            options: (q.options || []).map((o: any) => ({
              text: o.text,
              isCorrect: o.isCorrect,
            })),
          }))
        );
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchQuiz();
}, [moduleId, courseId]);


  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: [...q.options, { text: '', isCorrect: false }] }
          : q
      )
    );
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.filter((_, oi) => oi !== oIndex) }
          : q
      )
    );
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    field: 'text' | 'isCorrect',
    value: string | boolean
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        if (field === 'isCorrect' && value === true) {
          return {
            ...q,
            options: q.options.map((o, oi) => ({
              ...o,
              isCorrect: oi === oIndex,
            })),
          };
        } else {
          return {
            ...q,
            options: q.options.map((o, oi) =>
              oi === oIndex ? { ...o, [field]: value } : o
            ),
          };
        }
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: QuizFormData = { title, questions };

    if (!title.trim()) {
      // alert('');
      toast.error("Quiz атауы қажет")
      return;
    }

    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      const q = questions[qIndex];
      if (!q.text.trim()) {
        // alert();
        toast.error(`Сұрақ ${qIndex + 1} мәтіні қажет`)
        return;
      }
      if (q.options.length === 0) {
        alert(`Сұрақ ${qIndex + 1} кемінде бір опция болуы тиіс`);

        return;
      }
      if (!q.options.some((o) => o.isCorrect)) {
        
        toast.error(`Сұрақ ${qIndex + 1} бір дұрыс жауап болуы керек`)
        return;
      }
      for (let oIndex = 0; oIndex < q.options.length; oIndex++) {
        if (!q.options[oIndex].text.trim()) {
          
        toast.error(`Опция ${oIndex + 1} мәтіні (Сұрақ ${qIndex + 1}) қажет`)
          return;
        }
      }
    }

    try {
      // Decide endpoint and payload based on type
      let endpoint = '/api/quizzes';
      let payload: any = { title, questions };

      if (courseId && !moduleId) {
        endpoint = '/api/courses/quizzes';
        payload.courseId = courseId;
      } else if (moduleId) {
        payload.moduleId = moduleId;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });


      if (!res.ok) {
        
        toast.error('Quiz сақтау кезінде қате болды')
      } else {
        toast.success('Quiz сәтті сақталды')
      }
    } catch (error) {
      console.error('Қате:', error);
    }
  };
const handleDelete = async () => {
  if (!moduleId && !courseId) {
    toast.error("Қай тестті жою керегін анықтай алмадық");
    return;
  }

  if (!confirm("Тестті расымен жойғыңыз келе ме?")) {
    return;
  }

  try {
    let url = '/api/quizzes';
    let query = '';

    if (moduleId) {
      query = `?moduleId=${moduleId}`;
    } else if (courseId) {
      query = `?courseId=${courseId}`;
    }

    const res = await fetch(`${url}${query}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      toast.error("Тестті жою сәтсіз аяқталды");
      return;
    }

    toast.success("Тест жойылды");

    // optionally clear local state
    setTitle('');
    setQuestions([]);

  } catch (error) {
    console.error("Error deleting quiz:", error);
    toast.error("Қате орын алды");
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-10">
      {isLoading ? (
        <p>Жүктелуде...</p>
      ) : (
        <>
          <div>
            <label className="block mb-1 font-medium">Тест атауы</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quiz атауын енгізіңіз"
            />
          </div>

          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-4 border rounded-md bg-slate-100 space-y-4"
            >
              <div className="flex justify-between items-center">
                <label className="font-medium">Сұрақ {qIndex + 1}</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveQuestion(qIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={q.text}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((qItem, i) =>
                      i === qIndex ? { ...qItem, text: e.target.value } : qItem
                    )
                  )
                }
                placeholder="Сұрақ мәтіні"
              />

              <div className="space-y-2">
                {q.options.map((o, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={o.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          'isCorrect',
                          e.target.checked
                        )
                      }
                      className="accent-green-500"
                    />
                    <Input
                      value={o.text}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          'text',
                          e.target.value
                        )
                      }
                      placeholder={`Опция ${oIndex + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(qIndex, oIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => handleAddOption(qIndex)}
                className="flex items-center gap-1 text-sm"
              >
                <PlusCircle className="w-4 h-4" /> Опция қосу
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddQuestion}
              className="flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> Сұрақ қосу
            </Button>
            <Button type="submit" className="ml-auto">
              Сақтау
            </Button>
            {(moduleId || courseId) && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Тестті жою
              </Button>
            )}

          </div>
        </>
      )}
    </form>
  );
};
