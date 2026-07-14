import { transporter } from "@/lib/transporter";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await transporter.sendMail({
            from: `"Kaputra Academy" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // sends to yourself
            subject: "🎉 Nodemailer Test",
            text: "Congratulations! Your Gmail SMTP is working.",
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error },
            { status: 500 }
        );
    }
}