import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
  ) {
    try {
      const { userId } = auth();
      const { courseId } = params;
      const body = await req.json();
  
      // Log to check the body content
      console.log("Received body:", body);
  
      if (!userId) return new NextResponse('Unauthorized', { status: 401 });
  
      const course = await db.course.findUnique({
        where: { id: courseId, userId },
      });
  
      if (!course) return new NextResponse('Unauthorized', { status: 401 });
  
      const existingQuiz = await db.quiz.findFirst({
        where: { courseId },
      });
  
      if (existingQuiz) {
        return new NextResponse('Quiz already exists for this course', { status: 400 });
      }
  
      const quiz = await db.quiz.create({
        data: {
          title: body.title,
          courseId,
          questions: {
            create: body.questions.map((q: any) => ({
              text: q.text,
              options: {
                create: q.options.map((o: any) => ({
                  text: o.text,
                  isCorrect: o.isCorrect,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            include: { options: true },
          },
        },
      });
  
      return NextResponse.json(quiz);
    } catch (error) {
      console.error('[QUIZ_CREATE]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }
  
  
