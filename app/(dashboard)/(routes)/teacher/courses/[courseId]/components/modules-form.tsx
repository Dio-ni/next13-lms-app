'use client';

import { Module, Course } from '@prisma/client';
import axios from 'axios';
import { Loader2, PlusCircle, Pencil, Trash2, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loading } from '@/components/loading';
import { ChapterForm } from './chapters-form'; // келесіде құрамыз

interface ModulesFormProps {
  initialData: Course & {
    modules: Module[];
  };
  courseId: string;
}

const moduleSchema = z.object({
  title: z.string().min(1),
});

const ModulesForm: FC<ModulesFormProps> = ({ initialData, courseId }) => {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>(initialData.modules);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleInputs, setTitleInputs] = useState<{ [key: string]: string }>({});
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [creatingModule, setCreatingModule] = useState(false);

  const form = useForm<z.infer<typeof moduleSchema>>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { title: '' },
  });

  const handleTitleChange = (moduleId: string, value: string) => {
    setTitleInputs((prev) => ({ ...prev, [moduleId]: value }));
  };

  const saveModuleTitle = async (moduleId: string) => {
    setIsSavingTitle(true);
    try {
      await axios.put(`/api/courses/${courseId}/modules/${moduleId}`, {
        title: titleInputs[moduleId],
      });
      toast.success('Модуль атауы жаңартылды');
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId ? { ...mod, title: titleInputs[moduleId] } : mod
        )
      );
      setEditingTitleId(null);
    } catch {
      toast.error('Атауды жаңарту кезінде қате болды');
    } finally {
      setIsSavingTitle(false);
    }
  };

  const createModule = async (values: z.infer<typeof moduleSchema>) => {
    try {
      const res = await axios.post(`/api/courses/${courseId}/modules`, values);
      toast.success('Модуль жасалды');
      setModules((prev) => [...prev, res.data]);
      form.reset();
      setCreatingModule(false);
    } catch {
      toast.error('Модуль жасау кезінде қате болды');
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);
      toast.success('Модуль жойылды');
      setModules((prev) => prev.filter((module) => module.id !== moduleId));
    } catch {
      toast.error('Модульді жою кезінде қате болды');
    }
  };

  useEffect(() => {
    const initTitles: { [key: string]: string } = {};
    initialData.modules.forEach((mod) => {
      initTitles[mod.id] = mod.title;
    });
    setTitleInputs(initTitles);
  }, [initialData.modules]);


  const onEditQuiz = (moduleId: string) => {
    router.push(`/teacher/courses/${courseId}/modules/${moduleId}/quiz`);
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Курс модульдері</h2>
        <Button variant="ghost" onClick={() => setCreatingModule(!creatingModule)}>
          {creatingModule ? 'Бас тарту' : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Модуль қосу
            </>
          )}
        </Button>
      </div>

      {creatingModule && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(createModule)} className="mb-6 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="мысалы, 'Кіріспе модулі'"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loading />} Модуль құру
            </Button>
          </form>
        </Form>
      )}

      {modules.map((mod) => (
        <div key={mod.id} className="mb-6 border p-4 rounded-md bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {editingTitleId === mod.id ? (
              <>
                <Input
                  value={titleInputs[mod.id]}
                  onChange={(e) => handleTitleChange(mod.id, e.target.value)}
                  disabled={isSavingTitle}
                />
                <Button
                  size="sm"
                  onClick={() => saveModuleTitle(mod.id)}
                  disabled={isSavingTitle}
                >
                  {isSavingTitle ? <Loading /> : 'Сақтау'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingTitleId(null)}
                >
                  Бас тарту
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-md font-medium">{mod.title}</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingTitleId(mod.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteModule(mod.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
            <Button size="sm" className='rounded-lg border'
                  variant="ghost"  onClick={() => onEditQuiz(mod.id)}>Модульге тест қосу</Button>
         
          {/* Әр модульге арналған ChapterForm осында орналастырылады */}
          <ChapterForm courseId={courseId} moduleId={mod.id} />
          
        </div>
      ))}
    </div>
  );
};

export { ModulesForm };
