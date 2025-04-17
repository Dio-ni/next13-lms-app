import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context : { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
     const fontkit = require('fontkit');

     const { params } = context; // 👈 получаем params здесь
     const courseId = params.courseId; 
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        certificateEnabled: true,
        title: true,
      },
    });

    if (!course || !course.certificateEnabled) {
      return new NextResponse("Certificate not available", { status: 400 });
    }

    // Шаблон сертификата (PDF)
    const templatePath = path.join(process.cwd(), "public", "certificate.pdf");
    const existingPdfBytes = await readFile(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.registerFontkit(fontkit);
    // Шрифт
    const fontPath = path.join(process.cwd(), "public", "fonts", "kzbalmoral_regular.ttf");
    const fontBytes = await readFile(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.getPages()[0];

    const userFullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    // Дата окончания курса (текущая дата)
    const completionDate = new Date().toLocaleDateString('kk-KZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    // Отрисовка даты
    page.drawText(completionDate, {
        x: 200,
        y: 140,
        size: 18,
        font: customFont,
        color: rgb(0.1, 0.1, 0.1),
    });

    const { width, height } = page.getSize();

    // Имя пользователя
    const fontSizeName = 50;
    const nameTextWidth = customFont.widthOfTextAtSize(userFullName, fontSizeName);
    const nameX = (width - nameTextWidth) / 2;

    // Имя
    page.drawText(userFullName, {
      x: nameX, // Измени координаты под свой шаблон
      y: 290,
      size: fontSizeName,
      font: customFont,
      color: rgb(0, 0, 0),
    });

    const fontSizeCourse = 36;
    const courseTextWidth = customFont.widthOfTextAtSize(course.title, fontSizeCourse);
    const courseX = (width - courseTextWidth) / 2;

    // Название курса
    page.drawText(course.title, {
      x: courseX,
      y: 190,
      size: fontSizeCourse,
      font: customFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate.pdf"`,
        "Content-Length": pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error("CERTIFICATE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}