'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter } from '@prisma/client';
import axios from 'axios';
import { Loader2, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChaptersList } from './chapters-list';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
});

interface ChapterFormProps {
  courseId: string;
  moduleId: string;
}

export const ChapterForm = ({ courseId, moduleId }: ChapterFormProps) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [creating, setCreating] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { title: '' },
  });

  const fetchChapters = async () => {
    try {
      const res = await axios.get(
        `/api/courses/${courseId}/modules/${moduleId}/chapters`
      );
      setChapters(res.data);
    } catch {
      toast.error('Failed to load chapters');
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [moduleId]);

  const onCreate = async (values: z.infer<typeof schema>) => {
    try {
      const res = await axios.post(
        `/api/courses/${courseId}/modules/${moduleId}/chapters`,
        values
      );
      toast.success('Chapter created');
      form.reset();
      setCreating(false);
      setChapters((prev) => [...prev, res.data]);
    } catch {
      toast.error('Failed to create chapter');
    }
  };

  const onReorder = async (data: { id: string; position: number }[]) => {
    try {
      setIsReordering(true);
      await axios.put(
        `/api/courses/${courseId}/modules/${moduleId}/chapters/reorder`,
        { list: data }
      );
      toast.success('Chapters reordered');
      await fetchChapters();
    } catch {
      toast.error('Failed to reorder chapters');
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white mt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Chapters</h3>
        <Button variant="ghost" onClick={() => setCreating(!creating)}>
          {creating ? 'Cancel' : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Chapter
            </>
          )}
        </Button>
      </div>

      {creating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreate)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Chapter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              )}
              Create Chapter
            </Button>
          </form>
        </Form>
      )}

      {isReordering && (
        <div className="mt-4 text-sm text-sky-600 flex items-center">
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
          Reordering...
        </div>
      )}

      <div className="mt-4">
        <ChaptersList
          courseId={courseId} // ✅ fixed
          items={chapters}
          onReorder={onReorder}
        />
      </div>
    </div>
  );
};