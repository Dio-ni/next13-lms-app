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
import { useRouter } from "next/navigation";


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
      lessons: Lesson[];
    }[];
    quiz?: {
      id: string;
      title: string;
    } | null;
  }[];

};



interface SidebarProps {
  course: CourseWithDetails;
  completedLessons?: { id: string }[]; // Completed lessons should be passed here
}
export function Sidebar({ course, completedLessons = [] }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle, close } = useSidebar();
  const [isMounted, setIsMounted] = useState(true);
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

const router = useRouter();
let currentModuleId: string | undefined;

  // Sync the opened modules with the pathname
  useEffect(() => {
  if (pathname && course?.modules) {
    let foundModuleId: string | undefined;

    // Check for current lesson
    const currentLesson = course.modules
      .flatMap((module) =>
        module.chapters.flatMap((chapter) =>
          chapter.lessons.map((lesson) => ({
            moduleId: module.id,
            lessonId: lesson.id,
          }))
        )
      )
      .find((item) =>
        pathname.includes(`/dashboard/courses/${course.id}/lessons/${item.lessonId}`)
      );

    if (currentLesson) {
      foundModuleId = currentLesson.moduleId;
    }

    // Check for current quiz
    const currentQuiz = course.modules
      .map((module) => ({
        moduleId: module.id,
        quizId: module.quiz?.id,
      }))
      .find(
        (item) =>
          item.quizId &&
          pathname.includes(`/dashboard/courses/${course.id}/quiz/${item.quizId}`)
      );

    if (currentQuiz) {
      foundModuleId = currentQuiz.moduleId;
    }

    // Open the current module if it's not already open
    if (foundModuleId && !openModules.includes(foundModuleId)) {
      setOpenModules((prev) => [...prev, foundModuleId!]);
    }
  }

  // Recalculate course progress
  setProgress(calculateCourseProgress(course.modules, completedLessons));
}, [pathname, course, completedLessons]);

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
          
          <a   href={`/courses/${course.id}`}
                className="flex items-center gap-x-2 text-sm hover:text-primary transition-colors">
            {/* <a className="flex items-center gap-x-2"> */}
              <ArrowLeft className="h-4 w-4" />
              <div className="flex items-center gap-x-2">
                <Library className="h-4 w-4" />
                <span>Курска қайта оралу</span>
              </div>
            {/* </a> */}
          </a>

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
          <CourseProgress
              progress={progress}
              variant="success"
              label="Курстың прогрессі"
            />
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
             <AccordionTrigger className="px-3 py-3 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium transition-colors">
              <div className="flex items-center gap-x-2 lg:gap-x-4 w-full">
                <span className="text-sm font-semibold min-w-[28px]">
                  {String(moduleIndex + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-y-1 text-left flex-1 min-w-0">
                  <p className="truncate">{module.title}</p>
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
                          Бөлім {chapterIndex + 1}:
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
                  {module.quiz && (
                    
                    <Link
                      prefetch={false}
                      href={`/dashboard/courses/${course.id}/quiz/${module.quiz.id}`}
                      onClick={close}
                      className="flex items-center pl-8 lg:pl-10 pr-2 lg:pr-4 py-2 gap-x-2 lg:gap-x-4 group hover:bg-muted/50 transition-colors relative"
                    >
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-semibold text-blue-500">
                        Модуль квизі: {module.quiz.title}
                      </span>
                    </Link>
                  )}
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

