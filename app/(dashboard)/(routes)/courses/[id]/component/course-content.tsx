'use client';

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
}

interface Chapter {
  id: string;
  title: string;
  lessons?: Lesson[];
}

interface Module {
  id: string;
  title: string;
  chapters?: Chapter[];
}

interface Course {
  id: string;
  description?: string | null;
  modules?: Module[];
}
    

export function CourseContent({ course }: { course: Course }) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <div className="lg:col-span-2">
      <div className="p-6 mb-12 rounded-xl border bg-background">
        <h2 className="text-3xl font-bold mb-3">Курстың мазмұны</h2>
        {course.description && (
          <p className="text-muted-foreground text-base mb-6 max-w-2xl">{course.description}</p>
        )}

        <div className="space-y-4">
          {course.modules?.map((module) => {
            const isOpen = openModules[module.id];
            return (
              <div key={module.id} className="rounded-lg border bg-muted/10 p-4">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between text-left hover:opacity-90 transition"
                >
                  <span className="text-base font-semibold flex items-center gap-2">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    {module.title}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-3 pl-2">
                    {module.chapters?.map((chapter) => (
                      <div key={chapter.id}>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {chapter.title}
                        </h4>

                        <ul className="space-y-1 border-l border-border pl-3">
                          {chapter.lessons?.map((lesson) => (
                            <li key={lesson.id}>
                              <Link
                                href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                                className="text-sm text-primary hover:underline transition"
                              >
                                {lesson.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
