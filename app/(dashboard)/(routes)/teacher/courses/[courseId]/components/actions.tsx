'use client';

import axios from 'axios';
import { ArrowRight, Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import ConfirmModal from '@/components/modals/confirm-modal';
import Link from 'next/dist/client/link';

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

      toast.success(isPublished ? 'Курс жобасына ауысты' : 'Курс жарияланды');
      
      // Курс жарияланған кезде конфетти көрсетеміз
      if (!isPublished) {
        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      console.error(error);  // Қателерді тексеру үшін
      toast.error('Қате орын алды');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success('Курс жойылды');
      router.push('/teacher/courses');  // Курс тізіміне қайта бағыттау
    } catch (error) {
      console.error(error);  // Қателерді тексеру үшін
      toast.error('Қате орын алды');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2 mt-4">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Жобалау' : 'Жариялау'}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="w-4 h-4" />
        </Button>
      </ConfirmModal>
      <Link
        href={`/teacher/courses/${courseId}/feadback`}
        className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition"
      >
        Сауалнамаларды көру
      </Link>

    </div>
  );
};
