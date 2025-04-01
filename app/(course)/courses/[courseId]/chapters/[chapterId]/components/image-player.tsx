'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import { useConfettiStore } from '@/hooks/use-confetti-store';
import { cn } from '@/lib/utils';

interface ImagePlayerProps {
  imageUrl: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

const ImagePlayer = ({
  chapterId,
  completeOnEnd,
  courseId,
  isLocked,
  imageUrl,
  title,
  nextChapterId,
}: ImagePlayerProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const [isReady, setIsReady] = useState<boolean>(false);

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
        if (!nextChapterId) {
          confetti.onOpen();
        }
        toast.success('Progress updated');
        router.refresh();
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
          <Lock className="w-8 h-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              'object-cover rounded-md w-full h-full',
              !isReady && 'hidden'
            )}
            onLoad={() => setIsReady(true)}
          />
        </div>
      )}
    </div>
  );
};

export { ImagePlayer };