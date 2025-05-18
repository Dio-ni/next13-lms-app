"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LessonCompleteButtonProps {
  courseId: string;
  lessonId: string;
}

export function LessonCompleteButton({
  courseId,
  lessonId,
}: LessonCompleteButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isPendingTransition, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
          method: "GET",
        });
        const data = await res.json();
        setIsCompleted(data?.isCompleted ?? false);
      } catch (error) {
        console.error("Error fetching lesson completion status:", error);
        setIsCompleted(false);
      }
    };

    startTransition(fetchStatus);
  }, [lessonId, courseId]);

  const handleToggle = async () => {
    try {
      setIsPending(true);

      await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      });

      startTransition(async () => {
        const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`);
        const data = await res.json();
        setIsCompleted(data?.isCompleted ?? false);
      });

      router.refresh();
    } catch (error) {
      console.error("Error toggling lesson completion:", error);
    } finally {
      setIsPending(false);
    }
  };

  const isLoading = isCompleted === null || isPendingTransition;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">
            {isCompleted
              ? "Сабақ аяқталды!"
              : "Осы сабақты аяқтауға дайынсың ба?"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isCompleted
              ? "Қажет болса, оны қайтадан аяқталмаған деп белгілей аласың"
              : "Аяқтаған соң — «Аяқталды» деп белгіле."}
          </p>
        </div>
        <Button
          onClick={handleToggle}
          disabled={isPending || isLoading}
          size="lg"
          variant="default"
          className={cn(
            "min-w-[200px] transition-all duration-200 ease-in-out",
            isCompleted
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Жаңартылуда...
            </>
          ) : isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isCompleted ? "Аяқтаудан бас тарту..." : "Аяқталуда..."}
            </>
          ) : isCompleted ? (
            <>
              <XCircle className="h-4 w-4 mr-2" />
              Аяқталмаған деп белгіле
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Аяқталды деп белгіле
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
