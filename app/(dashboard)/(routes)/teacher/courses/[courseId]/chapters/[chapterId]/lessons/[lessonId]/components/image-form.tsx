'use client';

import { Lesson } from '@prisma/client';
import axios from 'axios';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';

interface LessonImageFormProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
  initialData: Lesson;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image is required',
  }),
});

const LessonImageForm: FC<LessonImageFormProps> = ({
  courseId,
  chapterId,
  lessonId,
  initialData,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
        values
      );
      toast.success('Сабақтың суреті жаңартылды');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Бірдеңе дұрыс болмады');
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
      Сабақтың суреті
        <Button variant="ghost" type="button" onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : !initialData.imageUrl ? (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Сурет қосу
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Суретті өңдеу
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div>
          <FileUpload
            endpoint="lessonImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
          16: 9 форматы ұсынылады
          </div>
        </div>
      ) : !initialData.imageUrl ? (
        <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-500" />
        </div>
      ) : (
        <div className="relative mt-2 aspect-video">
          <Image
            alt="Lesson image"
            fill
            className="object-cover rounded-md"
            src={initialData.imageUrl}
          />
        </div>
      )}
    </div>
  );
};

export { LessonImageForm };
