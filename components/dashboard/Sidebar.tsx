"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Library,
  ChevronRight,
  PlayCircle,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { getCompletedLessons } from "@/actions/getCompletedLessons";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CourseProgress } from "@/components/CourseProgress";
import { calculateCourseProgress } from "@/actions/calculateCourseProgress";
import { Category, Chapter, Course, Lesson } from "@prisma/client";

type CourseWithDetails = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: Category | null;
  modules: {
    id: string;
    title: string;
    chapters: {
      id: string;
      title: string;
      lessons: Lesson[]; // Direct lessons array inside chapters
    }[];
  }[];
};


type ChapterWithLessons = {
  // Each chapter has an array of lessons
};

interface SidebarProps {
  course: CourseWithDetails;
  completedLessons?: { id: string }[]; // Completed lessons should be passed here
}
export function Sidebar({ course, completedLessons = [] }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle, close } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Sync the opened modules with the pathname
  useEffect(() => {
    if (pathname && course?.modules) {
      const currentChapterId = course.modules
        .flatMap((module) => module.chapters)
        .find((chapter) =>
          pathname.includes(`/dashboard/courses/${course.id}/lessons/${chapter.id}`)
        )?.id;

      if (currentChapterId && !openModules.includes(currentChapterId)) {
        setOpenModules((prev) => [...prev, currentChapterId]);
      }
    }
    setProgress(calculateCourseProgress(course.modules , completedLessons)); // Recalculate progress
  }, [pathname, course, openModules, completedLessons]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!course || !isMounted) {
    return null;
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 lg:p-6 border-b flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/user/my-courses"
            className="flex items-center gap-x-2 text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <div className="flex items-center gap-x-2">
              <Library className="h-4 w-4" />
              <span>Course Library</span>
            </div>
          </Link>
          <div className="space-x-2">
            <Button
              onClick={close}
              variant="ghost"
              className="lg:hidden -mr-2"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="font-semibold text-2xl">{course.title}</h1>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 lg:p-4">
          <Accordion
            type="multiple"
            className="w-full space-y-4"
            value={openModules}
            onValueChange={setOpenModules}
          >
            {course.modules.map((module, moduleIndex) => (
            <AccordionItem
              key={module.id}
              value={module.id}
              className={cn(
                "border-none",
                "bg-background"
              )}
            >
              <AccordionTrigger className="px-2 py-2 hover:no-underline transition-colors">
                <div className="flex items-center gap-x-2 lg:gap-x-4 w-full">
                  <span className="text-sm font-medium text-muted-foreground min-w-[28px]">
                    {String(moduleIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-y-1 text-left flex-1 min-w-0">
                    <p className="">{module.title}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="flex flex-col space-y-4">
                  {module.chapters.map((chapter, chapterIndex) => (
                    <div key={chapter.id}>
                      {/* Redesigned Chapter Header */}
                      <div className="px-4 py-2 bg-muted rounded-md flex items-center gap-x-2 mb-2">
                        <div className="text-xs font-semibold text-muted-foreground tracking-wide">
                          Chapter {chapterIndex + 1}:
                        </div>
                        <div className="text-sm font-medium text-foreground truncate">
                          {chapter.title}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        {chapter.lessons.map((lesson, lessonIndex) => {
                          const isActive =
                            pathname === `/dashboard/courses/${course.id}/lessons/${lesson.id}`;
                          const isCompleted = completedLessons.some(
                            (completion) => completion?.id === lesson.id
                          );

                          return (
                            <Link
                              key={lesson.id}
                              prefetch={false}
                              href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                              onClick={close}
                              className={cn(
                                "flex items-center pl-8 lg:pl-10 pr-2 lg:pr-4 py-2 gap-x-2 lg:gap-x-4 group hover:bg-muted/50 transition-colors relative",
                                isActive && "bg-muted",
                                isCompleted && "text-muted-foreground"
                              )}
                            >
                              <span className="text-xs font-medium text-muted-foreground min-w-[28px]">
                                {String(lessonIndex + 1).padStart(2, "0")}
                              </span>
                              {isCompleted ? (
                                <Check className="h-4 w-4 shrink-0 text-green-500" />
                              ) : (
                                <PlayCircle
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    isActive
                                      ? "text-primary"
                                      : "text-muted-foreground group-hover:text-primary/80"
                                  )}
                                />
                              )}
                              <span
                                className={cn(
                                  "text-sm line-clamp-2 min-w-0",
                                  isCompleted &&
                                    "text-muted-foreground line-through decoration-green-500/50"
                                )}
                              >
                                {lesson.title}
                              </span>
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-primary" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background transition-all duration-300 ease-in-out",
          "lg:z-50 lg:block lg:w-96 lg:border-r",
          isOpen
            ? "w-[calc(100%-60px)] translate-x-[60px] lg:translate-x-0 lg:w-96"
            : "translate-x-[-100%] lg:translate-x-0"
        )}
      >
        <div className="h-full">
          <SidebarContent />
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}
    </>
  );
}

