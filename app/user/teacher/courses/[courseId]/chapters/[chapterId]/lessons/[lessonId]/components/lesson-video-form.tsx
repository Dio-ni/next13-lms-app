'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Video } from 'lucide-react';
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

interface LessonVideoFormProps {
  initialData: {
    videoUrl: string;
  };
  courseId: string;
  lessonId: string;
}

const formSchema = z.object({
  videoUrl: z.string().url('Please enter a valid URL').min(1, 'Video URL is required'),
});

const LessonVideoForm: FC<LessonVideoFormProps> = ({
  courseId,
  lessonId,
  initialData,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, values);
      toast.success('Video URL updated');
      toggleEdit();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Add Video URL
        <Button variant="ghost" type="button" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : 'Edit Video URL'}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'https://video-link.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting && <Loading />}
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p className="mt-2 text-sm">{initialData.videoUrl}</p>
      )}
    </div>
  );
};

export { LessonVideoForm };
