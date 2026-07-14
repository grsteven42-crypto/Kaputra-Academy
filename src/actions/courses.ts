"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true,
        teachers: {
          include: {
            teacher: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, courses };
  } catch (error: any) {
    console.error("Failed to fetch courses:", error);
    return { success: false, error: error.message };
  }
}

export async function getCategories() {
  try {
    let categories = await prisma.category.findMany();
    
    // If no categories exist, seed some basic ones
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Mathematics", slug: "mathematics", description: "Singapore Math and Olympiad preparation" },
        { name: "Science", slug: "science", description: "Basic and advanced physics, chemistry, biology" },
        { name: "English", slug: "english", description: "General English and academic writing" },
      ];
      
      for (const cat of defaultCategories) {
        await prisma.category.create({ data: cat });
      }
      categories = await prisma.category.findMany();
    }
    
    return { success: true, categories };
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    return { success: false, error: error.message };
  }
}

export async function createCourse(data: {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string;
  learningOutcomes: string;
  schedule: string;
  price: number;
  registrationFee: number;
  thumbnailUrl?: string;
  categoryId: string;
  isPublished: boolean;
  type: string;
  teacherIds?: string[];
}) {
  try {
    // Check if slug is unique
    const existing = await prisma.course.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return { success: false, error: "A course with this slug/URL already exists." };
    }

    const { teacherIds, ...courseData } = data;

    const course = await prisma.course.create({
      data: {
        ...courseData,
        teachers: teacherIds && teacherIds.length > 0 
          ? {
              create: teacherIds.map((id) => ({
                teacherId: id,
              })),
            }
          : undefined,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, course };
  } catch (error: any) {
    console.error("Failed to create course:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCourse(
  id: string,
  data: {
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    objectives: string;
    learningOutcomes: string;
    schedule: string;
    price: number;
    registrationFee: number;
    thumbnailUrl?: string;
    categoryId: string;
    isPublished: boolean;
    type: string;
    teacherIds?: string[];
  }
) {
  try {
    // Check slug uniqueness excluding this course
    const existing = await prisma.course.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
    });
    if (existing) {
      return { success: false, error: "A course with this slug/URL already exists." };
    }

    const { teacherIds, ...courseData } = data;

    // Delete existing teacher assignments first
    await prisma.teacherAssignment.deleteMany({
      where: { courseId: id },
    });

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...courseData,
        teachers: teacherIds && teacherIds.length > 0
          ? {
              create: teacherIds.map((tid) => ({
                teacherId: tid,
              })),
            }
          : undefined,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, course };
  } catch (error: any) {
    console.error("Failed to update course:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCourse(id: string) {
  try {
    // Delete relations first
    await prisma.teacherAssignment.deleteMany({
      where: { courseId: id },
    });
    await prisma.registration.deleteMany({
      where: { courseId: id },
    });

    const course = await prisma.course.delete({
      where: { id },
    });

    revalidatePath("/admin/courses");
    return { success: true, course };
  } catch (error: any) {
    console.error("Failed to delete course:", error);
    return { success: false, error: error.message };
  }
}
