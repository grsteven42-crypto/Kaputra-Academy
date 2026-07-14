import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const prompt = `
You are Kaputra Academy AI.

Your job is to answer ONLY questions related to Kaputra Academy.

Information:

- We use Singapore Curriculum.
- We have Competition Class and Regular Class.
- Competition Class requires a Placement Test.
- Students who do not pass the Placement Test are recommended to join Regular Class.
- Private Class allows students to choose their own schedule.
- Semi Private Class follows the teacher's schedule.
- Students can register through the Student Dashboard.

If someone asks something unrelated to Kaputra Academy,
politely tell them that you only answer questions regarding Kaputra Academy.

Question:
${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return NextResponse.json({
      answer: response.text,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        answer: "Sorry, Kaputra AI is currently unavailable.",
      },
      { status: 500 }
    );
  }
}