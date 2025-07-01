'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

export default function FinalQuizClient({
  quiz,
  courseId,
}: {
  quiz: any;
  courseId: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    // Check all answered
    for (let q of quiz.questions) {
      if (!answers[q.id]) {
        toast.error("Барлық сұрақтарға жауап беріңіз!");
        return;
      }
    }

    // Send to server (optional)
    // Here you can POST answers to save user result

    console.log("Submitted answers:", answers);
    toast.success("Жауаптар сәтті жіберілді!");

    // Optional: navigate or show results
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{quiz.title}</h2>

      {quiz.questions.map((q: any, qIndex: number) => (
        <div key={q.id} className="p-4 border rounded-lg space-y-2">
          <p className="font-medium">
            {qIndex + 1}. {q.text}
          </p>
          <RadioGroup
            value={answers[q.id] || ""}
            onValueChange={(val) => handleChange(q.id, val)}
          >
            {q.options.map((opt: any) => (
              <div key={opt.id} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.id} id={opt.id} />
                <label htmlFor={opt.id}>{opt.text}</label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}

      <Button onClick={handleSubmit}>Жіберу</Button>
    </div>
  );
}
