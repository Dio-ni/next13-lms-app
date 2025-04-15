'use client';

import { Chapter, Lesson } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Grip, Pencil, Trash } from 'lucide-react'; // Import Trash icon
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { LessonForm } from './lessons-form';

interface ChaptersListProps {
  courseId: string;
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit?: (id: string) => void;
}

const ChaptersList: FC<ChaptersListProps> = ({
  courseId,
  items,
  onEdit,
  onReorder,
}) => {
  const [chapterLessons, setChapterLessons] = useState<Record<string, Lesson[]>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedChapters = items.map((chapter, index) => ({
      ...chapter,
      position: index,
    }));
    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditedTitle(chapter.title);
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setEditedTitle('');
  };

  const loadLessons = async (chapterId: string) => {
    try {
      const res = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/lessons`);
      setChapterLessons((prev) => ({ ...prev, [chapterId]: res.data }));
    } catch {
      toast.error('Failed to load lessons');
    }
  };

  const handleSave = async (chapterId: string) => {
    try {
      if (!editedTitle.trim()) return toast.error('Title cannot be empty');

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}`, {
        title: editedTitle,
      });
      toast.success('Chapter title updated');

      const updated = chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, title: editedTitle } : ch
      );
      setChapters(updated);
      setEditingChapterId(null);
    } catch {
      toast.error('Failed to update title');
    }
  };

  // Handle delete chapter
  const handleDelete = async (chapterId: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted');
      
      // Remove the deleted chapter from state
      setChapters((prev) => prev.filter((chapter) => chapter.id !== chapterId));
    } catch {
      toast.error('Failed to delete chapter');
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    setChapters(items);
    items.forEach((chapter) => loadLessons(chapter.id));
  }, [items]);

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provider) => (
          <div {...provider.droppableProps} ref={provider.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} className='flex flex-col bg-slate-100 rounded-md mb-4'>
                    
                    <div
                      className={cn(
                        'flex items-center gap-x-2  border-slate-200 border text-slate-700  text-sm px-2',
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
                        {editingChapterId === chapter.id ? (
                          <Input
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(chapter.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            onBlur={() => handleSave(chapter.id)}
                            autoFocus
                            className="text-sm"
                          />
                        ) : (
                          <span>{chapter.title}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-x-2 pr-2">
                        {editingChapterId === chapter.id ? (
                          <Badge
                            className={cn(
                              'bg-slate-500 hover:bg-sky-700 text-white cursor-pointer transition-colors'
                            )}
                            onClick={() => handleSave(chapter.id)}
                          >
                            Save
                          </Badge>
                        ) : (
                          <Pencil
                            onClick={() => handleEdit(chapter)}
                            className="w-4 h-4 cursor-pointer hover:opacity-75 "
                          />
                        )}

                        {/* Delete button */}
                        <Trash
                          onClick={() => handleDelete(chapter.id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 text-red-500"
                        />
                      </div>
                    </div>
                    <div className="ml-4 mb-6">
                      <LessonForm
                        courseId={courseId}
                        chapterId={chapter.id}
                        onLessonCreated={() => loadLessons(chapter.id)}
                        existingLessons={chapterLessons[chapter.id] || []}
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
  );
};

export { ChaptersList };
