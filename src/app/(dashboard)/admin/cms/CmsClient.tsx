"use client";

import { useState } from "react";
import { Layers, Save, Plus, Trash2, Globe, Eye, Sparkles, Phone, Mail, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateContentBlock } from "@/actions/cms";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CmsClient({
  initialBlocks,
}: {
  initialBlocks: any[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "contact">("hero");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to parse block content
  const getBlockContent = (sectionName: string) => {
    const block = initialBlocks.find((b) => b.section === sectionName);
    if (!block) return null;
    try {
      return JSON.parse(block.content);
    } catch (e) {
      console.error("Failed to parse JSON content for", sectionName, e);
      return null;
    }
  };

  // State for Hero Slider
  const [slides, setSlides] = useState<any[]>(
    getBlockContent("hero_slider") || [
      {
        title: "Empowering Future Leaders through Excellence",
        subtitle: "Kaputra Academy offers world-class education using the Singapore Curriculum.",
        imageUrl: "/achievement1.png",
        buttonText: "Explore Programs",
        buttonLink: "/catalog",
      },
    ]
  );

  // State for About Us
  const [aboutUs, setAboutUs] = useState<{
    title: string;
    description: string;
    vision: string;
    mission: string;
  }>(
    getBlockContent("about_us") || {
      title: "Welcome to Kaputra Academy",
      description: "Kaputra Academy is dedicated to providing high-quality learning programs tailored to individual student needs.",
      vision: "To be the leading learning center for nurturing curiosity.",
      mission: "Empowering students through structured learning.",
    }
  );

  // State for Contact Info
  const [contactInfo, setContactInfo] = useState<{
    address: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
  }>(
    getBlockContent("contact_info") || {
      address: "123 Kaputra Boulevard, Jakarta",
      phone: "+62 812-3456-7890",
      email: "info@kaputra.com",
      instagram: "@kaputra_academy",
      facebook: "Kaputra Academy",
    }
  );

  // Status message reset helper
  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Slide CRUD Actions
  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        title: "New Highlight Title",
        subtitle: "Describe this key highlight or announcement here.",
        imageUrl: "/achievement1.png",
        buttonText: "Action Button",
        buttonLink: "/",
      },
    ]);
  };

  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("You must keep at least one slide in the hero section.");
      return;
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleUpdateSlide = (index: number, key: string, value: any) => {
    setSlides(
      slides.map((slide, i) => (i === index ? { ...slide, [key]: value } : slide))
    );
  };

  const saveHeroSlider = async () => {
    setIsSaving(true);
    const res = await updateContentBlock("hero_slider", slides);
    setIsSaving(false);
    if (res.success) {
      showStatus("success", "Hero homepage slider updated successfully!");
      router.refresh();
    } else {
      showStatus("error", res.error || "Failed to update hero slider.");
    }
  };

  const saveAboutUs = async () => {
    setIsSaving(true);
    const res = await updateContentBlock("about_us", aboutUs);
    setIsSaving(false);
    if (res.success) {
      showStatus("success", "About Us section content saved!");
      router.refresh();
    } else {
      showStatus("error", res.error || "Failed to save About Us section.");
    }
  };

  const saveContactInfo = async () => {
    setIsSaving(true);
    const res = await updateContentBlock("contact_info", contactInfo);
    setIsSaving(false);
    if (res.success) {
      showStatus("success", "Contact details and social links updated!");
      router.refresh();
    } else {
      showStatus("error", res.error || "Failed to save contact info.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Layers className="h-8 w-8 text-[#CA8E25]" />
            CMS & Content Settings
          </h1>
          <p className="text-slate-400 mt-1">Configure layout copy and landing page resources dynamically.</p>
        </div>
      </div>

      {/* Status Banner */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              statusMessage.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-semibold">{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === "hero"
              ? "border-[#CA8E25] text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Homepage Hero Slider
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === "about"
              ? "border-[#CA8E25] text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          About Us Section
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === "contact"
              ? "border-[#CA8E25] text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Contact & Social Links
        </button>
      </div>

      {/* Tabs Content */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <AnimatePresence mode="wait">
          {activeTab === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#CA8E25]" />
                    Hero Carousel Slides
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage slides that cycle on the homepage banner.</p>
                </div>
                <Button
                  onClick={handleAddSlide}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Slide
                </Button>
              </div>

              {/* Slider list */}
              <div className="space-y-6">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="border border-slate-800 bg-slate-900/30 p-5 rounded-2xl relative space-y-4 hover:border-slate-700 transition-all"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                        Slide #{index + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveSlide(index)}
                        className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {/* Slide Title */}
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Slide Title</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(index, "title", e.target.value)}
                          className="bg-slate-900 border-slate-800 text-white text-sm rounded-xl focus:border-blue-600"
                        />
                      </div>

                      {/* Slide Subtitle */}
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Slide Description / Subtitle</Label>
                        <Input
                          value={slide.subtitle}
                          onChange={(e) => handleUpdateSlide(index, "subtitle", e.target.value)}
                          className="bg-slate-900 border-slate-800 text-white text-sm rounded-xl focus:border-blue-600"
                        />
                      </div>

                      {/* Button Text */}
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Button Text</Label>
                        <Input
                          value={slide.buttonText}
                          onChange={(e) => handleUpdateSlide(index, "buttonText", e.target.value)}
                          className="bg-slate-900 border-slate-800 text-white text-sm rounded-xl focus:border-blue-600"
                        />
                      </div>

                      {/* Button Link */}
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Button Redirect Link</Label>
                        <Input
                          value={slide.buttonLink}
                          onChange={(e) => handleUpdateSlide(index, "buttonLink", e.target.value)}
                          className="bg-slate-900 border-slate-800 text-white text-sm rounded-xl focus:border-blue-600 font-mono"
                        />
                      </div>

                      {/* Slide Image */}
                      <div className="space-y-2 col-span-full">
                        <Label className="text-slate-400 text-xs">Image Path / URL</Label>
                        <Input
                          value={slide.imageUrl}
                          onChange={(e) => handleUpdateSlide(index, "imageUrl", e.target.value)}
                          className="bg-slate-900 border-slate-800 text-white text-sm rounded-xl focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save */}
              <div className="pt-4 border-t border-slate-900 flex justify-end">
                <Button
                  onClick={saveHeroSlider}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Save className="h-5 w-5" />
                  {isSaving ? "Saving..." : "Save Homepage Slides"}
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="pb-4 border-b border-slate-900">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#CA8E25]" />
                  About Us Copy
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Edit credentials, mission statement, and core academy descriptions.</p>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="aboutTitle" className="text-slate-400 text-xs">Section Headline</Label>
                  <Input
                    id="aboutTitle"
                    value={aboutUs.title}
                    onChange={(e) => setAboutUs({ ...aboutUs, title: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-blue-600"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="aboutDesc" className="text-slate-400 text-xs">Full About Description</Label>
                  <textarea
                    id="aboutDesc"
                    value={aboutUs.description}
                    onChange={(e) => setAboutUs({ ...aboutUs, description: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-600 focus:outline-none text-sm"
                  />
                </div>

                {/* Vision */}
                <div className="space-y-2">
                  <Label htmlFor="aboutVision" className="text-slate-400 text-xs">Academy Vision</Label>
                  <textarea
                    id="aboutVision"
                    value={aboutUs.vision}
                    onChange={(e) => setAboutUs({ ...aboutUs, vision: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-600 focus:outline-none text-sm"
                  />
                </div>

                {/* Mission */}
                <div className="space-y-2">
                  <Label htmlFor="aboutMission" className="text-slate-400 text-xs">Academy Mission</Label>
                  <textarea
                    id="aboutMission"
                    value={aboutUs.mission}
                    onChange={(e) => setAboutUs({ ...aboutUs, mission: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-600 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Save */}
              <div className="pt-4 border-t border-slate-900 flex justify-end">
                <Button
                  onClick={saveAboutUs}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Save className="h-5 w-5" />
                  {isSaving ? "Saving..." : "Save About Us Section"}
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="pb-4 border-b border-slate-900">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#CA8E25]" />
                  Contact Info & Public Directory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Set the phone numbers, socials, and office details displayed on pages.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="contAddr" className="text-slate-400 text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Physical Address
                  </Label>
                  <Input
                    id="contAddr"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-blue-600"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="contPhone" className="text-slate-400 text-xs flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone / WhatsApp
                  </Label>
                  <Input
                    id="contPhone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-blue-600"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="contEmail" className="text-slate-400 text-xs flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Support Email
                  </Label>
                  <Input
                    id="contEmail"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-blue-600"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <Label htmlFor="contInsta" className="text-slate-400 text-xs flex items-center gap-1">
                    <FaInstagram className="w-3.5 h-3.5" /> Instagram Handle
                  </Label>
                  <Input
                    id="contInsta"
                    value={contactInfo.instagram}
                    onChange={(e) => setContactInfo({ ...contactInfo, instagram: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-blue-600 font-mono"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-2">
                  <Label htmlFor="contFb" className="text-slate-400 text-xs flex items-center gap-1">
                    <FaFacebook className="w-3.5 h-3.5" /> Facebook Page Name
                  </Label>
                  <Input
                    id="contFb"
                    value={contactInfo.facebook}
                    onChange={(e) => setContactInfo({ ...contactInfo, facebook: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Save */}
              <div className="pt-4 border-t border-slate-900 flex justify-end">
                <Button
                  onClick={saveContactInfo}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Save className="h-5 w-5" />
                  {isSaving ? "Saving..." : "Save Contact Info"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
