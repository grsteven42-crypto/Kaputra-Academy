"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createInvoice } from "@/actions/invoice";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  BookOpen,
  Trophy,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function CatalogPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRegister = async (variant: any, programTitle: string) => {
    if (session?.user) {
      const priceStr = variant.price.match(/\d+(\.\d+)?/);
      const amount = priceStr ? parseInt(priceStr[0].replace(/\./g, '')) : 250000;
      
      try {
        const res = await createInvoice({
          itemId: `${programTitle} - ${variant.name}`,
          itemType: "CLASS",
          amount,
        });
        if (res.success) {
          router.push(`/student/invoices/${res.invoiceId}`);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      router.push("/register");
    }
  };

  const programs = [
    {
      title: "Regular Class",
      icon: BookOpen,
      description:
        "Focused on strengthening academic foundations through the Singapore Curriculum.",
      variants: [
        {
          name: "Private Class",
          price: "Starting from Rp250.000 / session",
          features: [
            "Free Trial Videos and Worksheet",
            "Flexible Schedule",
            "One-on-One Learning",
            "Personalized Learning Plan",
            "Progress Monitoring",
            "Choose Your Own Schedule"
          ],
        },
        {
          name: "Semi Private Class",
          price: "Starting from Rp175.000 / session",
          features: [
            "Free Trial Videos and Worksheet",
            "Maximum 4 Students",
            "Interactive Learning",
            "Collaborative Environment",
            "Singapore Curriculum",
            "Follow Instructor's Schedule"
          ],
        },
      ],
    },
    {
      title: "Competition Class",
      icon: Trophy,
      description:
        "Designed for students preparing for academic competitions and advanced challenges.",
      variants: [
        {
          name: "Private Class",
          price: "Starting from Rp300.000 / session",
          features: [
            "Free Trial Videos and Worksheet",
            "Competition Coaching",
            "Advanced Problem Solving",
            "Flexible Schedule",
            "Personalized Mentoring",
            "Placement Test Required",
            "Choose Your Own Schedule",
          ],
        },
        {
          name: "Semi Private Class",
          price: "Starting from Rp200.000 / session",
          features: [
            "Free Trial Videos and Worksheet",
            "Maximum 4 Students",
            "Competition Focused Curriculum",
            "Olympiad Preparation",
            "Singapore Curriculum",
            "Placement Test Required",
            "Follow Instructor's Schedule",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-[#072147] py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Our Learning Programs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 max-w-3xl mx-auto text-lg"
          >
            Discover personalized learning experiences designed to help
            students achieve academic excellence and unlock their full
            potential.
          </motion.p>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <Accordion
            className="space-y-6"
          >
            {programs.map((program) => {
              const Icon = program.icon;

              return (
                <AccordionItem
                  key={program.title}
                  value={program.title}
                  className="relative bg-white border border-slate-200 rounded-3xl px-6 shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-8">
                    <div className="flex items-start gap-4 text-left">
                      <div className="h-14 w-14 rounded-2xl bg-[#CA8E25]/10 flex items-center justify-center shrink-0">
                        <Icon className="h-7 w-7 text-[#CA8E25]" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-bold text-[#072147]">
                            {program.title}
                          </h2>
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#F4B218] to-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm border border-white/20 animate-pulse">
                            <Sparkles className="w-3 h-3 fill-slate-950" />
                            Free Trial Available
                          </span>
                        </div>

                        <p className="text-slate-650 mt-2 max-w-2xl">
                          {program.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-6 pb-8">
                      {program.variants.map((variant) => (
                        <motion.div
                          key={variant.name}
                          whileHover={{ y: -4 }}
                          className="relative border border-slate-200 rounded-2xl p-6 bg-white overflow-hidden"
                        >
                          {/* Free Trial Badge */}
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#F4B218] to-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white/20 z-10 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                            Free Trial
                          </div>

                          <h3 className="text-xl font-bold text-[#072147] mb-2">
                            {variant.name}
                          </h3>

                          <p className="font-semibold text-[#CA8E25] mb-5">
                            {variant.price}
                          </p>

                          <ul className="space-y-3 mb-6">
                            {variant.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-center gap-2 text-slate-700"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          <Button 
                            className="w-full bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-semibold"
                            onClick={() => handleRegister(variant, program.title)}
                          >
                            Register Now
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* ENROLLMENT PROCESS */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#072147] mb-10">
            Enrollment Process
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* REGULAR */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-[#072147] mb-6">
                📚 Regular Class
              </h3>

              <div className="space-y-4">
                {[
                  "Register Account",
                  "Activate Account",
                  "Choose Regular Class",
                  "Complete Payment",
                  "Start Learning",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#CA8E25] flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPETITION */}
            <div className="bg-white rounded-3xl border border-[#CA8E25] p-8">
              <h3 className="text-2xl font-bold text-[#072147] mb-6">
                🏆 Competition Class
              </h3>

              <div className="space-y-4">
                {[
                  "Register Account",
                  "Activate Account",
                  "Choose Competition Class",
                  "Pay Placement Test Fee (Rp300.000)",
                  "Take Placement Test",
                  "Pass Assessment",
                  "Complete Payment",
                  "Start Learning",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#CA8E25] flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-sm text-slate-700">
                  Students who do not meet the required standard will be
                  recommended to join the Regular Class program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-[#072147] rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Begin Your Learning Journey?
          </h2>

          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Create an account today and choose the learning program
            that best matches your academic goals. Competition Class
            applicants are required to complete an entry assessment.
          </p>

          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}