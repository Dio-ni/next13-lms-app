'use client';

import { Chapter } from '@prisma/client';
import axios from 'axios';
import { Pencil, PlusCircle, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';

interface ChapterImageFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1),
});

const ChapterImageForm: FC<ChapterImageFormProps> = ({
  courseId,
  initialData,
  chapterId,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success('Chapter updated');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Chapter image
        <Button variant="ghost" type="button" onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : !initialData.imageUrl ? (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add an image
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div>
          <FileUpload
            endpoint="chapterImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s image.
          </div>
        </div>
      ) : !initialData.imageUrl ? (
        <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-500" />
        </div>
      ) : (
        <>
          <div className="relative mt-2 aspect-video">
            <img
              src={initialData.imageUrl}
              alt="Chapter image"
              className="object-cover rounded-md"
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Images can take a few minutes to process. Refresh the page if the image
            does not appear.
          </div>
        </>
      )}
    </div>
  );
};

export { ChapterImageForm };