'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Quiz, Question, Option } from '@prisma/client';

interface QuizFormProps {
  courseId: string;
  initialData?: {
    quiz: Quiz; // Quiz is now a single object, not an array
    questions: (Question & { options: Option[] })[]; // Question with options
  };
}

export const QuizForm: React.FC<QuizFormProps> = ({ courseId, initialData }) => {
  const [title, setTitle] = useState<string>(initialData?.quiz.title || ''); // Single quiz title
  const [questions, setQuestions] = useState<(Question & { options: Option[] })[]>(
    initialData?.questions || [] // Managing questions with options
  );

  useEffect(() => {
    if (initialData?.quiz) {
      setTitle(initialData.quiz.title); // Set initial title
    }
    if (initialData?.questions) {
      setQuestions(initialData.questions); // Set initial questions and options
    }
  }, [initialData]);

  // Handle adding a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      
    ]);
  };

  // Handle removing a question
  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Handle changing a question text
  const handleQuestionChange = (index: number, text: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  // Handle adding a new option to a question
  const handleAddOption = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push({
      id: -1, // Placeholder ID for new option
      text: '',
      isCorrect: false,
      questionId: updatedQuestions[qIndex].id,
    });
    setQuestions(updatedQuestions);
  };

  // Handle changing an option's text
  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex].text = text;
    setQuestions(updatedQuestions);
  };

  // Handle setting an option as correct
  const handleSetCorrectOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oIndex,
    }));
    setQuestions(updatedQuestions);
  };

  // Handle removing an option
  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(updatedQuestions);
  };

  // Handle saving the quiz
  const handleSaveQuiz = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/quiz`, {
        title,
        questions,
      });
      toast.success('Quiz saved successfully!');
    } catch {
      toast.error('Failed to save quiz.');
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <h2 className="text-lg font-semibold mb-4">Course Quiz</h2>

      <Input
        placeholder="Quiz title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />

      {/* Questions Section */}
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 bg-white border rounded-md shadow-sm">
          <Input
            placeholder="Question text"
            value={question.text}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            className="mb-2"
          />

          {/* Options Section */}
          {question.options.map((option, oIndex) => (
            <div key={oIndex} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={option.isCorrect}
                onChange={() => handleSetCorrectOption(qIndex, oIndex)}
              />
              <Input
                value={option.text}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                className="flex-1"
              />
              <Button size="icon" variant="ghost" onClick={() => handleRemoveOption(qIndex, oIndex)}>
                <Trash2 className="text-red-500 w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddOption(qIndex)}
            className="mt-2"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Option
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveQuestion(qIndex)}
            className="ml-2 text-red-600"
          >
            Delete Question
          </Button>
        </div>
      ))}

      {/* Add Question Button */}
      <Button variant="default" onClick={handleAddQuestion} className="mb-4">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Question
      </Button>

      {/* Save Quiz Button */}
      <Button onClick={handleSaveQuiz}>Save Quiz</Button>
    </div>
  );
};
