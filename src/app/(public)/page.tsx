"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Quote, Award, Users, Sparkles, ArrowRight, BookOpen, Clock3, FlaskConical, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute top-24 left-12 grid grid-cols-3 gap-3 opacity-20">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#F4B218]" />
          ))}
        </div>
        {/* Background Blur */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/5 blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">

          {/* Floating Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="hidden xl:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-[#F4B218]/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#F4B218]" />
            </div>

            <div className="text-left">
              <p className="font-semibold text-slate-900">
                Competition Focus
              </p>
              <p className="text-sm text-slate-500">
                International Preparation
              </p>
            </div>
          </motion.div>

          {/* Floating Right Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#0A2458]" />
            </div>

            <div className="text-left">
              <p className="font-semibold text-slate-900">
                Singapore Curriculum
              </p>
              <p className="text-sm text-slate-500">
                K2 – Grade 9
              </p>
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#F4B218]/10 text-[#0A2458] px-5 py-2 rounded-full text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Singapore Curriculum Learning Center
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
              Empowering Students To Achieve
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A2458] to-[#F4B218]">
                International Excellence
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Through the Singapore Curriculum, interactive learning experiences,
            and competition preparation programs, we help students develop
            confidence, critical thinking, and academic excellence.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/catalog">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-[#F4B218] hover:bg-[#d99c0d] text-slate-900 font-semibold shadow-lg"
              >
                Explore Programs
              </Button>
            </Link>

            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-10 mt-14"
          >
            <div>
              <h3 className="text-3xl font-bold text-[#0A2458]">
                2020
              </h3>
              <p className="text-slate-500 text-sm">
                Established
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#0A2458]">
                K2–G9
              </h3>
              <p className="text-slate-500 text-sm">
                Student Levels
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#0A2458]">
                75–90
              </h3>
              <p className="text-slate-500 text-sm">
                Minutes / Session
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* About Us Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[30%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[25%] h-[40%] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Visual Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              {/* Decorative Accent box behind the image */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#F4B218]/20 to-blue-600/10 -rotate-2 scale-102" />

              {/* Image Container with Hover zoom */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-xl aspect-[4/5] bg-slate-50">
                <img
                  src="/about-photo.jpg"
                  alt="Students learning at Kaputra Academy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Stat Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-6 -right-6 md:right-4 lg:-right-8 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-[220px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0A2458] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">500+</h4>
                    <p className="text-xs text-slate-500">Successful Alumni</p>
                  </div>
                </div>
              </motion.div>

              {/* Grid Dots */}
              <div className="absolute -top-8 -left-8 grid grid-cols-4 gap-2 opacity-30 pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#F4B218]" />
                ))}
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 flex flex-col justify-center space-y-6"
            >
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#0A2458] bg-[#0A2458]/5 px-4 py-2 rounded-full inline-flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4B218]" />
                  About Kaputra Academy
                </span>
                <h2 className="mt-4 text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                  Nurturing Thinkers, Leaders, and Achievers
                </h2>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed">
                Kaputra Academy is a learning center that focuses on helping students achieve academic excellence throught the Singapore Curriculum and international competition preparation.
              </p>

              {/* Highlights List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F4B218]/20 flex items-center justify-center text-[#d99c0d] shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5 text-[#F4B218]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Proven Pedagogy</h4>
                    <p className="text-sm text-slate-500">Proven track record of building problem-solving skills.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F4B218]/20 flex items-center justify-center text-[#d99c0d] shrink-0 mt-0.5">
                    <Trophy className="w-3.5 h-3.5 text-[#F4B218]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Competition Training</h4>
                    <p className="text-sm text-slate-500">Focused coaching for international competitions.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/about">
                  <Button
                    size="lg"
                    className="group h-12 px-6 rounded-full bg-[#0A2458] hover:bg-[#081c44] text-white font-medium shadow-md transition-all inline-flex items-center gap-2"
                  >
                    Learn More About Us
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-slate-50 border-t border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#F4B218] bg-[#F4B218]/10 px-4 py-2 rounded-full">
              Why Choose Kaputra Academy
            </span>

            <h2 className="mt-6 text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              A Learning Experience Designed For Excellence
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              We provide high-quality learning experiences through expert teachers,
              internationally recognized curriculum, and engaging classroom activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4B218]/10 flex items-center justify-center mb-5">
                <Award className="w-8 h-8 text-[#F4B218]" />
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-3">
                Expert & Experienced Teachers
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Taught by skilled and experienced teachers who understand how to
                guide students effectively.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4B218]/10 flex items-center justify-center mb-5">
                <BookOpen className="w-8 h-8 text-[#F4B218]" />
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-3">
                Singapore International Curriculum
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Using the Singapore Curriculum to strengthen students’ academic
                foundation and problem-solving skills.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4B218]/10 flex items-center justify-center mb-5">
                <Clock3 className="w-8 h-8 text-[#F4B218]" />
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-3">
                Effective Class Duration
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Learning sessions are designed for 75–90 minutes to maximize focus,
                engagement, and understanding.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4B218]/10 flex items-center justify-center mb-5">
                <FlaskConical className="w-8 h-8 text-[#F4B218]" />
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-3">
                Interactive Activities
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Students enjoy experiments and engaging activities that make
                learning more exciting and memorable.
              </p>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4B218]/10 flex items-center justify-center mb-5">
                <Trophy className="w-8 h-8 text-[#F4B218]" />
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-3">
                Trusted By High-Achieving Students
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Kaputra Academy has guided many students to achieve excellent
                academic results and competition achievements.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Parent Reviews Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
              Parents' Reviews
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Loved By Parents, Trusted By Families
            </h2>
            <p className="text-lg text-slate-600">
              See how our curriculum and mentoring approach are making a tangible impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-500/10 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-blue-500 text-blue-500" />
                  ))}
                </div>
                <p className="text-slate-650 text-sm leading-relaxed italic">
                  "Kaputra Academy ...."
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                  AJ
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Amanda Jenkins</h4>
                  <p className="text-xs text-slate-500">Parent of Leo (Grade 5)</p>
                </div>
              </div>
            </motion.div>

            {/* Review 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-500/10 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-blue-500 text-blue-500" />
                  ))}
                </div>
                <p className="text-slate-650 text-sm leading-relaxed italic">
                  "The learning structure..."
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                  MC
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Marcus Cheng</h4>
                  <p className="text-xs text-slate-500">Parent of Chloe (Grade 8)</p>
                </div>
              </div>
            </motion.div>

            {/* Review 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-500/10 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-blue-500 text-blue-500" />
                  ))}
                </div>
                <p className="text-slate-650 text-sm leading-relaxed italic">
                  "Outstanding mentors..."
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                  SW
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sarah Wijaya</h4>
                  <p className="text-xs text-slate-500">Parent of Nathan (Grade 9)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Programs
            </h2>

            <p className="text-lg text-slate-600">
              Discover our Singapore Curriculum programs designed to strengthen
              academic foundations and prepare students for international
              competitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

            {/* Competition Class */}
            <motion.div
              whileHover={{ y: -8 }}
              className="relative bg-white rounded-3xl shadow-xl border-2 border-[#F4B218]/50 hover:border-[#F4B218] transition-all"
            >
              {/* Creative Floating Badge */}
              <div className="absolute -top-4 right-6 bg-gradient-to-r from-[#F4B218] to-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white/20 z-10 animate-pulse">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                Most Popular
              </div>

              <div className="bg-[#0A2458] text-white p-8 rounded-t-[22px] relative overflow-hidden">
                {/* Decorative background glow inside header */}
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute left-10 -bottom-10 w-32 h-32 rounded-full bg-[#F4B218]/10 blur-xl pointer-events-none" />

                <span className="text-sm font-semibold uppercase tracking-wider text-[#F4B218]">
                  Semi Private
                </span>

                <h3 className="text-3xl font-bold mt-2">
                  Competition Class
                </h3>

                <p className="mt-3 text-slate-200">
                  Designed for students preparing for international competitions and advanced academic challenges.
                </p>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-slate-600">Level</span>
                  <span className="font-semibold">K2 - Grade 9</span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-slate-600">Duration</span>
                  <span className="font-semibold">75 - 90 Minutes</span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-slate-600">Fee</span>
                  <span className="font-semibold text-[#0A2458]">
                    Starting from Rp200.000
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-slate-600 pt-2">
                  <li>✓ International Competition Preparation</li>
                  <li>✓ Singapore Curriculum</li>
                  <li>✓ Problem Solving Focus</li>
                  <li>✓ Small Group Learning</li>
                </ul>

                <Link href="/catalog">
                  <Button className="w-full mt-4 bg-[#0A2458] hover:bg-[#081c45] text-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Regular Class */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 transition-all"
            >
              <div className="bg-[#F4B218] text-slate-900 p-8">
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Semi Private
                </span>

                <h3 className="text-3xl font-bold mt-2">
                  Regular Class
                </h3>

                <p className="mt-3">
                  Focused on strengthening academic foundations through the Singapore Curriculum.
                </p>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-slate-600">Level</span>
                  <span className="font-semibold">K2 - Grade 9</span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-slate-600">Duration</span>
                  <span className="font-semibold">90 Minutes</span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-slate-600">Fee</span>
                  <span className="font-semibold text-[#00000]">
                    Starting from Rp175.000
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-slate-600 pt-2">
                  <li>✓ Singapore Curriculum</li>
                  <li>✓ Academic Foundation Building</li>
                  <li>✓ Interactive Learning Activities</li>
                  <li>✓ Small Group Learning</li>
                </ul>

                <Link href="/catalog">
                  <Button className="w-full mt-4 bg-[#F4B218] hover:bg-[#d99c0d] text-slate-900">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/catalog">
              <Button
                size="lg"
                className="group h-13 px-8 rounded-full bg-white hover:bg-slate-50 text-[#0A2458] border border-slate-250 font-semibold shadow-md transition-all inline-flex items-center gap-2"
              >
                View All Programs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
