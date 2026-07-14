"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getContentBlocks } from "@/actions/cms";

export default function ContactPage() {
  const [contactBlock, setContactBlock] = useState<any>(null);

  useEffect(() => {
    async function loadCmsData() {
      try {
        const res = await getContentBlocks();
        if (res.success && res.blocks) {
          const contact = res.blocks.find((b: any) => b.section === "contact_info");
          if (contact) setContactBlock(JSON.parse(contact.content));
        }
      } catch (e) {
        console.error("Failed to load CMS contact data:", e);
      }
    }
    loadCmsData();
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      <section className="bg-white border-b border-slate-100 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-slate-650">We'd love to hear from you. Get in touch with our team.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
            <div className="space-y-6 text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-900">Address</h3>
                <p>{contactBlock?.address || ""}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p>{contactBlock?.email || ""}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Phone / WhatsApp</h3>
                <p>{contactBlock?.phone || ""}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Business Hours</h3>
                <p>{contactBlock?.hours || ""}</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input type="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-slate-950 font-semibold shadow-sm">Send Message</Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
