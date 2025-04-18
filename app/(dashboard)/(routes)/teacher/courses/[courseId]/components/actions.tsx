'use client';

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import ConfirmModal from '@/components/modals/confirm-modal';

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const endpoint = isPublished
        ? `/api/courses/${courseId}/unpublish`
        : `/api/courses/${courseId}/publish`;

      await axios.patch(endpoint);

      toast.success(isPublished ? 'Course unpublished' : 'Course published');
      
      // Trigger confetti if the course was published
      if (!isPublished) {
        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      console.error(error);  // Log the error for debugging
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success('Course deleted');
      router.push('/teacher/courses');  // Redirect to courses list after deletion
    } catch (error) {
      console.error(error);  // Log the error for debugging
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
