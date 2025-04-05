import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BookOpen } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';
import { CourseProgress } from '@/components/course-progress';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  progress: number | null;
  category: string;
}

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/user/courses/${id}`} prefetch={false} className="group hover:no-underline flex">
      <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] border border-border flex flex-col flex-1">
        <div className="relative h-52 w-full overflow-hidden">
          {imageUrl ? (
            // <Image
            //   src={imageUrl}
            //   alt={title}
            //   fill
            //   className="object-cover transition-transform duration-300 group-hover:scale-110"
            // />
            <img
              src={imageUrl}
              alt={title || "Course Title"}
              className="object-cover w-full h-full"
              loading="lazy" // Optional: This will defer loading of the image until it's needed
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <span className="text-white font-bold">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-sm font-medium px-3 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
              {category || 'Uncategorized'}
            </span>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center my-3 text-sm gap-x-2">
            <IconBadge size="sm" icon={BookOpen} />
            <span>
              {chaptersLength} {chaptersLength === 1 ? 'chapter' : 'chapters'}
            </span>
          </div>
          <div className="space-y-4 mt-auto">
            {progress !== null ? (
              <CourseProgress
                variant={progress === 100 ? 'success' : 'default'}
                size="sm"
                value={progress}
              />
            ) : (
              <p className="font-medium text-md md:text-sm text-slate-700">Not enrolled</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export { CourseCard };
