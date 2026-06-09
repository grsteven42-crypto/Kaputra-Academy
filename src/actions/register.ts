"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function submitRegistration(formData: FormData) {
  const studentName = formData.get("studentName") as string;
  const studentAge = parseInt(formData.get("studentAge") as string, 10);
  const parentName = formData.get("parentName") as string;
  const parentPhone = formData.get("parentPhone") as string;
  const parentEmail = formData.get("parentEmail") as string;
  const courseId = formData.get("courseId") as string;

  if (!studentName || !studentAge || !parentName || !parentPhone || !parentEmail || !courseId) {
    throw new Error("Missing required fields");
  }

  // Create registration
  const registration = await prisma.registration.create({
    data: {
      studentName,
      studentAge,
      parentName,
      parentPhone,
      parentEmail,
      courseId,
    },
  });

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  const amount = (course?.price || 0) + (course?.registrationFee || 0);

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      registrationId: registration.id,
      amount: amount > 0 ? amount : 500000, 
    },
  });

  redirect(`/payment/${payment.id}`);
}
