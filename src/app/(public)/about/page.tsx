"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-white border-b border-slate-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            About <span className="text-blue-600">Kaputra Academy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl mx-auto text-lg"
          >
            Empowering the next generation of professionals through accessible, high-quality education and expert-led training.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                At Kaputra Academy, our mission...
              </p>
              <p className="text-slate-600 leading-relaxed">
                By leveraging modern ...
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-200 rounded-2xl h-80 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-600/10" />
              {/* Image Placeholder */}
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                Team/Company Image
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
