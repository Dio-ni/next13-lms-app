'use client';

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export interface CourseFeedback {
  id: string;
  userId: string;
  email: string;
  courseId: string;
  position: string | null;
  timeSpent: string | null;
  impression: string | null;
  difficulty: string | null;
  suggestions: string | null;
  createdAt: string;
  updatedAt: string;
}

export function TeacherFeedback({ courseId }: { courseId: string }) {
  const [feedbacks, setFeedbacks] = useState<CourseFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/feedback`);
        if (!res.ok) throw new Error("Failed to fetch feedbacks");
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [courseId]);

  if (loading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground">Сауалнамалар жоқ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((fb) => (
        <Card key={fb.id} className="p-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            📧 {fb.email} · {new Date(fb.createdAt).toLocaleDateString()}
          </div>

          {fb.position && (
            <div>
              <span className="font-medium">Лауазымы:</span> {fb.position}
            </div>
          )}

          {fb.timeSpent && (
            <div>
              <span className="font-medium">Қанша уақыт кетті:</span> {fb.timeSpent}
            </div>
          )}

          {fb.impression && (
            <div>
              <span className="font-medium">Жалпы әсері:</span> {fb.impression}
            </div>
          )}

          {fb.difficulty && (
            <div>
              <span className="font-medium">Қиындықтар:</span> {fb.difficulty}
            </div>
          )}

          {fb.suggestions && (
            <div>
              <span className="font-medium">Ұсыныстар:</span> {fb.suggestions}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
