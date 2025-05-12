'use client';

import { Chapter, Module } from '@prisma/client';
import { FC, useState } from 'react';
import { cn } from '@/lib/utils';
import { Grip, Pencil, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ChaptersList } from './chapters-list';
import { ChapterForm } from './chapters-form'; // Жаңа тарау қосу формасы

interface ModulesListProps {
  courseId: string;
  modules: Module[];
  chaptersByModule: { [moduleId: string]: Chapter[] };
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onTitleUpdate: (moduleId: string, newTitle: string) => void;
  onModuleDelete: (moduleId: string) => void;
}

const ModulesList: FC<ModulesListProps> = ({
  courseId,
  modules,
  chaptersByModule,
  onReorder,
  onTitleUpdate,
  onModuleDelete,
}) => {
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const handleEdit = (module: Module) => {
    setEditingModuleId(module.id);
    setEditedTitle(module.title);
  };

  const handleCancelEdit = () => {
    setEditingModuleId(null);
    setEditedTitle('');
  };

  const handleSave = async (moduleId: string) => {
    try {
      if (!editedTitle.trim()) return toast.error('Атауы бос болмауы керек');

      await axios.put(`/api/courses/${courseId}/modules/${moduleId}`, {
        title: editedTitle,
      });
      toast.success('Модуль атауы жаңартылды');
      onTitleUpdate(moduleId, editedTitle);
      setEditingModuleId(null);
    } catch {
      toast.error('Атауын жаңарту сәтсіз аяқталды');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);
      toast.success('Модуль жойылды');
      onModuleDelete(moduleId);
    } catch {
      toast.error('Модульді жою сәтсіз аяқталды');
    }
  };

  return (
    <div>
      {modules.map((module) => (
        <div key={module.id} className="mb-6">
          <div
            className={cn(
              'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md text-sm px-2',
              'bg-sky-100 border-sky-200 text-sky-700'
            )}
          >
            <div className="py-3 pr-2 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition">
              <Grip className="w-5 h-5" />
            </div>

            <div className="flex-1 py-2">
              {editingModuleId === module.id ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(module.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  onBlur={() => handleSave(module.id)}
                  autoFocus
                  className="text-sm"
                />
              ) : (
                <span>{module.title || 'Атаусыз модуль'}</span>
              )}
            </div>

            <div className="flex items-center gap-x-2 pr-2">
              {editingModuleId === module.id ? (
                <Badge
                  className="bg-slate-500 hover:bg-sky-700 text-white cursor-pointer transition-colors"
                  onClick={() => handleSave(module.id)}
                >
                  Сақтау
                </Badge>
              ) : (
                <Pencil
                  onClick={() => handleEdit(module)}
                  className="w-4 h-4 cursor-pointer hover:opacity-75"
                />
              )}
              <Trash
                onClick={() => handleDeleteModule(module.id)}
                className="w-4 h-4 cursor-pointer hover:opacity-75 text-red-500"
              />
            </div>
          </div>

          <div className="pl-6 mt-4">
            <ChaptersList
              courseId={courseId}
              items={chaptersByModule[module.id] || []}
              onReorder={onReorder}
            />

            <div className="mt-4">
              <ChapterForm courseId={courseId} moduleId={module.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ModulesList };
