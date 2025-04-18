'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, Pencil, PlusCircle } from 'lucide-react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { Loading } from '@/components/loading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';
interface Lesson {
  id: string;
  title: string;
}

interface LessonFormProps {
  chapterId: string;
  courseId: string;
  onLessonCreated: () => void;
  existingLessons?: Lesson[];
  onEditLesson?: (lessonId: string) => void;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

const LessonForm: FC<LessonFormProps> = ({
  chapterId,
  onLessonCreated,
  courseId,
  existingLessons = [],
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/lessons`, values);
      toast.success('Lesson created');
      form.reset();
      onLessonCreated();
    } catch {
      toast.error('Something went wrong');
    }
  };
  const onEditLesson = ( lessonId: string) => {
    // Navigate to the lesson edit page using next/router
    router.push(`/user/teacher/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1 font-medium text-slate-600">
        Lessons
        <Button
          variant="ghost"
          type="button"
          onClick={() => setIsCreating((prev) => !prev)}
        >
          {isCreating ? 'Cancel' : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Lesson
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Lesson title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting && <Loading />}
              Create Lesson
            </Button>
          </form>
        </Form>
      )}

      <ul className="pl-4 mt-1 space-y-1 pr-3">
        {existingLessons.length ? (
          existingLessons.map((lesson) => (
            <li
              key={lesson.id}
              className="text-sm  flex justify-between items-center"
            >
              <span>{lesson.title}</span>
              {/* {onEditLesson && ( */}
                <button
                  onClick={() => onEditLesson(lesson.id)}
                  className="hover:opacity-70"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
              {/* )} */}
            </li>
          ))
        ) : (
          <li className="text-sm italic text-muted-foreground">No lessons yet.</li>
        )}
      </ul>
    </div>
  );
};

export { LessonForm };