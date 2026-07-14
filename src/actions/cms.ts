"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const DEFAULT_BLOCKS: Record<string, any> = {
  hero_slider: [
    {
      title: "Empowering Future Leaders through Excellence",
      subtitle: "Kaputra Academy offers world-class education using the Singapore Curriculum.",
      imageUrl: "/achievement1.png",
      buttonText: "Explore Programs",
      buttonLink: "/catalog",
    },
    {
      title: "Unleash Academic and Competition Potential",
      subtitle: "Specialized coaching for national and international Math & Science Olympiads.",
      imageUrl: "/achievement1.png",
      buttonText: "Learn More",
      buttonLink: "/camp-program",
    },
  ],
  about_us: {
    title: "Welcome to Kaputra Academy",
    description: "Kaputra Academy is dedicated to providing high-quality learning programs tailored to individual student needs. Our Singapore-based curriculum prepares students for future success in academic competitions and beyond.",
    vision: "To be the leading learning center for nurturing mathematical and scientific curiosity in children.",
    mission: "Empowering students through structured learning, premium mentoring, and fostering a growth mindset.",
  },
  contact_info: {
    address: "123 Kaputra Boulevard, Jakarta, Indonesia",
    phone: "+62 812-3456-7890",
    email: "info@kaputra.com",
    instagram: "@kaputra_academy",
    facebook: "Kaputra Academy",
  },
};

export async function getContentBlocks() {
  try {
    const blocks = await prisma.contentBlock.findMany();
    
    // Seed default content blocks if empty
    if (blocks.length === 0) {
      for (const [section, content] of Object.entries(DEFAULT_BLOCKS)) {
        await prisma.contentBlock.create({
          data: {
            section,
            content: JSON.stringify(content),
          },
        });
      }
      return { success: true, blocks: await prisma.contentBlock.findMany() };
    }

    return { success: true, blocks };
  } catch (error: any) {
    console.error("Failed to fetch content blocks:", error);
    return { success: false, error: error.message };
  }
}

export async function updateContentBlock(section: string, content: any) {
  try {
    const contentString = typeof content === "string" ? content : JSON.stringify(content);
    
    const block = await prisma.contentBlock.upsert({
      where: { section },
      update: { content: contentString },
      create: { section, content: contentString },
    });

    revalidatePath("/admin/cms");
    // Also revalidate homepage and public pages that use this
    revalidatePath("/");
    return { success: true, block };
  } catch (error: any) {
    console.error("Failed to update content block:", error);
    return { success: false, error: error.message };
  }
}
