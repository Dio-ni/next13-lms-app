'use client';

import { Chapter } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LessonsListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const LessonsList: FC<LessonsListProps> = ({ items, onEdit, onReorder }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [Lessons, setLessons] = useState<Chapter[]>(items);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(Lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);
    const updatedLessons = items.slice(startIndex, endIndex + 1);
    setLessons(items);

    const bulkUpdateData = updatedLessons.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    setLessons(items);
  }, [items]);

  if (!isMounted) return null;

  return (
    <div>
      <h2 className="text-base font-semibold mb-4">Сабақтар тізімі</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="Sabaktar">
          {(provider) => (
            <div {...provider.droppableProps} ref={provider.innerRef}>
              {Lessons.map((chapter, index) => (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className={cn(
                        'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                        'bg-sky-100 border-sky-200 text-sky-700'
                      )}
                    >
                      <div
                        className={cn(
                          'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                          'border-r-sky-200 hover:bg-sky-200'
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="w-5 h-5" />
                      </div>
                      <span>{chapter.title || 'Атаусыз сабақ'}</span>
                      <div className="flex items-center pr-2 ml-auto gap-x-2">
                        <Pencil
                          onClick={() => onEdit(chapter.id)}
                          className="w-4 h-4 transition cursor-pointer hover:opacity-75"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provider.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export { LessonsList };
