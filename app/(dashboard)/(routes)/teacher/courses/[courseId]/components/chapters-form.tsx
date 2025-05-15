'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter } from '@prisma/client';
import axios from 'axios';
import { Loader2, PlusCircle } from 'lucide-react';
import {  useCallback,useEffect, useState } from 'react';
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
  title: z.string().min(1, 'Атауы қажет'),
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


  const fetchChapters = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/courses/${courseId}/modules/${moduleId}/chapters`
      );
      setChapters(res.data);
    } catch {
      toast.error('Тараулар жүктелмеді');
    }
}, [courseId, moduleId]); // ✅ dependencies used inside the function


  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const onCreate = async (values: z.infer<typeof schema>) => {
    try {
      const res = await axios.post(
        `/api/courses/${courseId}/modules/${moduleId}/chapters`,
        values
      );
      toast.success('Бөлім құрылды');
      form.reset();
      setCreating(false);
      setChapters((prev) => [...prev, res.data]);
    } catch {
      toast.error('Бөлім жасалмады.');
    }
  };

  const onReorder = async (data: { id: string; position: number }[]) => {
    try {
      setIsReordering(true);
      await axios.put(
        `/api/courses/${courseId}/modules/${moduleId}/chapters/reorder`,
        { list: data }
      );
      toast.success('Бөлімдер қайта реттелді');
      await fetchChapters();
    } catch {
      toast.error('Бөлімдердің ретін өзгерту мүмкін болмады');
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white mt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Бөлімдер</h3>
        <Button variant="ghost" onClick={() => setCreating(!creating)}>
          {creating ? 'Бас тарту' : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Бөлім қосу
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
                    <Input placeholder="Бөлім атауы" {...field} />
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
              Бөлум қосу
            </Button>
          </form>
        </Form>
      )}

      {isReordering && (
        <div className="mt-4 text-sm text-sky-600 flex items-center">
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
          Ретін өзгерту...
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