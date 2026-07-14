"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
    {
        question: "What curriculum do you use?",
        answer:
            "We use the Singapore Curriculum combined with proven problem-solving strategies to strengthen students' conceptual understanding and critical thinking skills.",
    },
    {
        question: "Do you offer trial classes?",
        answer:
            "Yes. Students may attend 1–2 trial sessions before committing to a program. Trial sessions are charged at the standard class fee per meeting.",
    },
    {
        question: "Is there an assessment for Competition Class?",
        answer:
            "Yes. Students interested in joining the Competition Class are required to take a Placement Test first. Based on the results, students may be placed in Competition Class, Academic Enrichment (Semi Private), or Private Class.",
    },
    {
        question: "Where are the classes held?",
        answer:
            "Semi Private classes are held at our learning center in Spazio, while Private classes are conducted at the student's home.",
    },
    {
        question: "What subjects are available in the Competition Class?",
        answer:
            "Competition Class is available for Mathematics and Science.",
    },
    {
        question: "What happens if my child does not pass the Competition Class assessment?",
        answer:
            "Students who require further preparation may be recommended to join Academic Enrichment (Semi Private) or Private Class to strengthen their foundations.",
    },
    {
        question: "How do I register for a program?",
        answer:
            "Students can create an account, complete registration, and follow the enrollment process through their student dashboard.",
    },
    {
        question: "Can students switch programs later?",
        answer:
            "Yes. Program recommendations and class placements can be adjusted based on student performance and academic needs.",
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setAnswer("");

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question,
                }),
            });

            const data = await res.json();

            setAnswer(data.answer);
        } catch (error) {
            console.error(error);
            setAnswer("Sorry, Kaputra AI is currently unavailable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* HERO */}
            <section className="bg-[#072147] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h1>

                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Find answers to common questions about our programs,
                        classes, assessments, and enrollment process.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq.question}
                            className={`rounded-2xl overflow-hidden border transition-all duration-300 ${openIndex === index
                                ? "border-[#CA8E25] shadow-lg bg-white"
                                : "border-slate-200 bg-white shadow-sm"
                                }`}
                        >
                            <button
                                onClick={() =>
                                    setOpenIndex(openIndex === index ? null : index)
                                }
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <h3 className="font-semibold text-slate-900 text-lg pr-4">
                                    {faq.question}
                                </h3>

                                <div
                                    className={`flex items-center justify-center w-9 h-9 rounded-full bg-[#CA8E25]/10 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                >
                                    <ChevronDown className="h-5 w-5 text-[#CA8E25]" />
                                </div>
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index
                                    ? "grid-rows-[1fr]"
                                    : "grid-rows-[0fr]"
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-6 pb-6 border-t border-slate-100 pt-4 text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI */}
            <section className="container mx-auto px-4 pb-20 max-w-4xl">
                <div className="bg-[#072147] rounded-3xl p-8 md:p-10 shadow-xl">
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#CA8E25]/20 p-3 rounded-full">
                            <Sparkles className="h-8 w-8 text-[#CA8E25]" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white text-center mb-3">
                        Ask Kaputra AI
                    </h2>

                    <p className="text-white/80 max-w-2xl mx-auto text-center mb-8">
                        Can't find your answer? Ask Kaputra AI and get instant
                        help about our programs, classes, assessments and
                        registration process.
                    </p>

                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    askAI();
                                }
                            }}
                            placeholder="Ask anything about Kaputra Academy..."
                            className="flex-1 rounded-xl px-5 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CA8E25]"
                        />

                        <Button
                            onClick={askAI}
                            disabled={loading}
                            className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-semibold px-8"
                        >
                            {loading ? "Thinking..." : "Ask AI"}
                        </Button>
                    </div>

                    {answer && (
                        <div className="mt-8 bg-white rounded-2xl p-6 text-left shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-[#CA8E25]" />
                                <h3 className="font-semibold text-slate-900">
                                    Kaputra AI
                                </h3>
                            </div>

                            <div className="text-slate-700 whitespace-pre-wrap leading-7">
                                {answer}
                            </div>
                        </div>
                    )}

                    <p className="text-white/50 text-sm mt-6 text-center">
                        Kaputra AI is currently in beta and may occasionally
                        provide incomplete information.
                    </p>
                </div>
            </section>
        </div>
    );
}