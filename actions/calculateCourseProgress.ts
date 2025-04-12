interface Lesson {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  content: string | null;
  videoUrl: string | null;
  chapterId: string;
}

interface Chapter {
  id: string;
  lessons: Lesson[];
}

interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}

export const calculateCourseProgress = (
  modules: Module[],
  completedLessons: { id: string }[]
): number => {
  let totalLessons = 0;
  let completedCount = 0;

  modules.forEach((module) => {
    module.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons += 1;
        if (completedLessons.some((cl) => cl.id === lesson.id)) {
          completedCount += 1;
        }
      });
    });
  });

  if (totalLessons === 0) {
    return 0;
  }

  const progress = (completedCount / totalLessons) * 100;
  return parseFloat(progress.toFixed(2));
};
