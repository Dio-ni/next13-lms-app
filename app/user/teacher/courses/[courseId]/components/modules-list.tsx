'use client';

import { Chapter, Module } from '@prisma/client';
import { FC, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ChapterForm } from './chapters-form'; // Import the ChapterForm

interface ModulesListProps {
  courseId: string;
  modules: Module[];
  chaptersByModule: { [moduleId: string]: Chapter[] };
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onTitleUpdate: (moduleId: string, newTitle: string) => void;
}

const ModulesList: FC<ModulesListProps> = ({
  courseId,
  modules,
  chaptersByModule,
  onReorder,
  onTitleUpdate,
}) => {
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Now, only reorder the chapters inside each module, not modules
    const moduleId = result.source.droppableId;
    const updatedChapters = [...chaptersByModule[moduleId]];
    const [reorderedChapter] = updatedChapters.splice(result.source.index, 1);
    updatedChapters.splice(result.destination.index, 0, reorderedChapter);

    const updatedChaptersPositions = updatedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: index,
    }));

    onReorder(updatedChaptersPositions);
  };

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
      if (!editedTitle.trim()) return toast.error('Title cannot be empty');

      await axios.put(`/api/courses/${courseId}/modules/${moduleId}`, {
        title: editedTitle,
      });
      toast.success('Module title updated');
      onTitleUpdate(moduleId, editedTitle);
      setEditingModuleId(null);
    } catch {
      toast.error('Failed to update title');
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="modules" isDropDisabled>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {modules.map((module, index) => (
              <Draggable key={module.id} draggableId={module.id} index={index}>
                {(provided) => (
                  <div>
                    <div className="gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm px-2">
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className={cn(
                          'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm px-2',
                          'bg-sky-100 border-sky-200 text-sky-700'
                        )}
                      >
                        <div
                          className={cn(
                            'py-3 pr-2 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                            'border-r-sky-200 hover:bg-sky-200'
                          )}
                          {...provided.dragHandleProps}
                        >
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
                            module.title
                          )}
                        </div>

                        <div className="flex items-center gap-x-2 pr-2">
                          {editingModuleId === module.id ? (
                            <Badge
                              className={cn(
                                'bg-slate-500 hover:bg-sky-700 text-white cursor-pointer transition-colors'
                              )}
                              onClick={() => handleSave(module.id)}
                            >
                              Save
                            </Badge>
                          ) : (
                            <Pencil
                              onClick={() => handleEdit(module)}
                              className="w-4 h-4 cursor-pointer hover:opacity-75"
                            />
                          )}
                        </div>
                      </div>

                      {/* Here we now use ChapterForm for each chapter inside a module */}
                      <div className="mt-2">
                        {chaptersByModule[module.id] && chaptersByModule[module.id].length > 0 &&
                          chaptersByModule[module.id].map((chapter) => (
                            <div key={chapter.id} className="mb-4">
                              <ChapterForm
                                courseId={courseId}
                                moduleId={module.id}
                                chapterId={chapter.id} // Pass chapter ID
                                existingChapter={chapter} // Pass existing chapter for editing
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export { ModulesList };
