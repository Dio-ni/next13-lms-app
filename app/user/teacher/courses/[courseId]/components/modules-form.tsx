'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter, Course, Module } from '@prisma/client';
import axios from 'axios';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState, useEffect } from 'react';
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
import { ModulesList } from './modules-list';

interface ModulesFormProps {
  initialData: Course & {
    modules: Module[];
  };
  courseId: string;
}

const moduleSchema = z.object({
  title: z.string().min(1),
});

const chapterSchema = z.object({
  title: z.string().min(1),
});

const ModulesForm: FC<ModulesFormProps> = ({ courseId, initialData }) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [modules, setModules] = useState<Module[]>(initialData.modules);
  const [chaptersByModule, setChaptersByModule] = useState<{ [key: string]: Chapter[] }>({});
  const [creatingModule, setCreatingModule] = useState(false);
  const [creatingChapterForModule, setCreatingChapterForModule] = useState<string | null>(null);

  const moduleForm = useForm<z.infer<typeof moduleSchema>>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { title: '' },
  });

  const chapterForm = useForm<z.infer<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
    defaultValues: { title: '' },
  });

  const onModuleSubmit = async (values: z.infer<typeof moduleSchema>) => {
    try {
      const res = await axios.post(`/api/courses/${courseId}/modules`, values);
      toast.success('Module created');
      setModules((prev) => [...prev, res.data]);
      setCreatingModule(false);
      moduleForm.reset();
    } catch {
      toast.error('Failed to create module');
    }
  };

  const onChapterSubmit = async (values: z.infer<typeof chapterSchema>) => {
    if (!creatingChapterForModule) return;
    try {
      await axios.post(`/api/courses/${courseId}/modules/${creatingChapterForModule}/chapters`, values);
      toast.success('Chapter created');
      chapterForm.reset();
      loadChapters(creatingChapterForModule);
      setCreatingChapterForModule(null);
    } catch {
      toast.error('Failed to create chapter');
    }
  };

  const loadChapters = async (moduleId: string) => {
    try {
      const res = await axios.get(`/api/courses/${courseId}/modules/${moduleId}/chapters`);
      setChaptersByModule((prev) => ({ ...prev, [moduleId]: res.data }));
    } catch {
      toast.error('Failed to load chapters');
    }
  };

  const onReorderChapters = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/modules/${creatingChapterForModule}/chapters/reorder`, { list: updateData });
      toast.success('Chapters reordered');
      router.refresh();
    } catch {
      toast.error('Reorder failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  useEffect(() => {
    modules.forEach((module) => loadChapters(module.id));
  }, [modules]);

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      {isUpdating && (
        <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full bg-slate-500/20 rounded-m">
          <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course modules
        <Button variant="ghost" onClick={() => setCreatingModule(!creatingModule)}>
          {creatingModule ? 'Cancel' : (<><PlusCircle className="w-4 h-4 mr-2" /> Add Module</>)}
        </Button>
      </div>

      {creatingModule && (
        <Form {...moduleForm}>
          <form onSubmit={moduleForm.handleSubmit(onModuleSubmit)} className="mt-4 space-y-4">
            <FormField
              control={moduleForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Module title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!moduleForm.formState.isValid || moduleForm.formState.isSubmitting} type="submit">
              {moduleForm.formState.isSubmitting && <Loading />} Create Module
            </Button>
          </form>
        </Form>
      )}

      <ModulesList
        courseId={courseId}
        modules={modules}
        chaptersByModule={chaptersByModule}
        onReorder={onReorderChapters}
        onTitleUpdate={onEdit} // Assuming `onEdit` handles updating the title
      />
    </div>
  );
};

export { ModulesForm };
