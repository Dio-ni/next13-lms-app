'use client';

import { Course } from '@prisma/client';
import axios from 'axios';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Сурет міндетті',
  }),
});

const ImageForm: FC<ImageFormProps> = ({ courseId, initialData }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Курс сәтті жаңартылды');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Қате орын алды');
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Курстың суреті
        <Button variant="ghost" type="button" onClick={toggleEdit}>
          {isEditing ? (
            'Бас тарту'
          ) : !initialData.imageUrl ? (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Сурет қосу
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Суретті өзгерту
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 арақатынастағы сурет ұсынылады
          </div>
        </div>
      ) : !initialData.imageUrl ? (
        <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-500" />
        </div>
      ) : (
        <div className="relative mt-2 aspect-video">
          <Image
            alt="Жүктелген сурет"
            fill
            className="object-cover rounded-md"
            src={initialData.imageUrl}
          />
        </div>
      )}
    </div>
  );
};

export { ImageForm };
