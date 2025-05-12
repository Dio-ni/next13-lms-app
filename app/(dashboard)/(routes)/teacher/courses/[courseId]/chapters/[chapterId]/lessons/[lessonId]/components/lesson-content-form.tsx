'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lesson } from '@prisma/client';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { Editor } from '@/components/editor';
import { Loading } from '@/components/loading';
import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface LessonContentFormProps {
  initialData: Lesson;
  courseId: string;
  lessonId: string;
  chapterId: string;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const LessonContentForm: FC<LessonContentFormProps> = ({
  courseId,
  initialData,
  lessonId,
  chapterId,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialData.content || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
        values
      );
      toast.success('Сабақ жаңартылды');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Қате орын алды');
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Сабақ мазмұны
        <Button variant="ghost" type="button" onClick={toggleEdit}>
          {isEditing ? (
            'Бас тарту'
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Мазмұнды өңдеу
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting && <Loading />}
                Сақтау
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.content && 'text-slate-500 italic'
          )}
        >
          {initialData.content ? (
            <Preview value={initialData.content} />
          ) : (
            'Мазмұн жоқ'
          )}
        </p>
      )}
    </div>
  );
};

export { LessonContentForm };
