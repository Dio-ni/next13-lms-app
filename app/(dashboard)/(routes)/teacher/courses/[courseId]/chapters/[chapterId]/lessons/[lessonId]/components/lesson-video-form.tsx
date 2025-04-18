'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Lesson } from '@prisma/client';
import { Video } from 'lucide-react';
import { FC, useState } from 'react';
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

interface LessonVideoFormProps {
  initialData: Lesson;
  courseId: string;
  lessonId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().url('Please enter a valid URL').min(1, 'Video URL is required'),
});

const LessonVideoForm: FC<LessonVideoFormProps> = ({
  courseId,
  lessonId,
  initialData,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || '', // Fallback to an empty string if videoUrl is null or undefined
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, values);
      toast.success('Video URL updated');
      toggleEdit();
      window.location.reload();
    } catch {
      toast.error('Something went wrong');
    }
  };

  // Function to check if it's a valid YouTube URL and format it
  const getYouTubeEmbedUrl = (url: string) => {
    console.log("Checking video URL:", url);  // Log the URL to check
    const youtubeRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/([a-zA-Z0-9_-]+)|(?:.*[?&]v=)([a-zA-Z0-9_-]+))|youtu\.be\/([a-zA-Z0-9_-]+))/;
    const match = url.match(youtubeRegex);

    if (match) {
      const videoId = match[1] || match[2] || match[5];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return null;
  };

  const videoUrl = initialData.videoUrl ? getYouTubeEmbedUrl(initialData.videoUrl) : null;

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Add Video URL
        <Button variant="ghost" type="button" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : 'Edit Video URL'}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'https://video-link.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting && <Loading />}
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="mt-2 text-sm">
          {videoUrl ? (
            <div
              className="relative w-full"
              style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
            >
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          ) : (
            'No video URL available'
          )}
        </div>
      )}
    </div>
  );
};

export { LessonVideoForm };
