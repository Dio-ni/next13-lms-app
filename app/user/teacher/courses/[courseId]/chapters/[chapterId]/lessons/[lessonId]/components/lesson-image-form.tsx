'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Image } from 'lucide-react';
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

interface LessonImageFormProps {
  initialData: {
    imageUrl: string;
  };
  courseId: string;
  lessonId: string;
}

const formSchema = z.object({
  imageUrl: z.string().url('Please enter a valid image URL').min(1, 'Image URL is required'),
});

const LessonImageForm: FC<LessonImageFormProps> = ({
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
      toast.success('Image URL updated');
      toggleEdit();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Add Image URL
        <Button variant="ghost" type="button" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : 'Edit Image URL'}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'https://image-link.com'"
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
        <p className="mt-2 text-sm">{initialData.imageUrl}</p>
      )}
    </div>
  );
};

export { LessonImageForm };
