"use client";

import Logo from "@/features/header/logo";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -20 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, ease: "easeInOut" as const },
    },
  };

  return (
    <footer className="bg-[#121212] text-white pt-10 pb-4 font-sans">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        className="container mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-10  "
      >
        {/* Logo and description */}
        <div className="flex flex-col   space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-gray-300 max-w-xs">
            جمعية خيرية تهدف إلى مساعدة المحتاجين وتحسين جودة الحياة في المجتمع.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex flex-col  space-y-3">
          <h3 className="text-lg font-semibold mb-2">روابط مهمة</h3>
          {[
            { label: "الرئيسية", href: "/" },
            { label: "عن الجمعية", href: "/about" },
            { label: "مشاريعنا", href: "/projects" },
            { label: "تواصل معنا", href: "/contact" },
          ].map((link) => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.05, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Link
                href={link.href}
                className="hover:text-[#B1E3C2] transition-colors duration-300"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Contact info and subscribe */}
        <div className="flex flex-col  space-y-3">
          <h3 className="text-lg font-semibold mb-2">تواصل معنا</h3>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Phone className="w-4 h-4 text-[#B1E3C2]" />
            <span>+20 123 456 7890</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Mail className="w-4 h-4 text-[#B1E3C2]" />
            <span>info@gm3ya.org</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-[#B1E3C2]" />
            <span>القاهرة، مصر</span>
          </div>

          {/* Subscribe form */}
          <form className="w-full max-w-xs mt-3">
            <div className="flex items-center border-b border-gray-400 py-1">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="bg-transparent w-full text-sm px-2 py-1 text-right focus:outline-none placeholder-gray-400"
              />
              <button
                type="submit"
                className="text-[#B1E3C2] font-semibold hover:text-white transition-colors"
              >
                إرسال
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-white/10 pt-4">
        © {new Date().getFullYear()} جميع الحقوق محفوظة لجمعية خيرية.
      </div>
    </footer>
  );
}
