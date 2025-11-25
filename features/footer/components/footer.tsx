"use client";

import { Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-10 pb-6 font-sans overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 ">
          {/* Column 3 — LINKS */}
          <div className="flex flex-col gap-2  text-end">
            <Link href="/" className="hover:text-gray-300 transition">
              Home page
            </Link>
            <Link href="/shipping" className="hover:text-gray-300 transition">
              shipping policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition">
              Terms & Conditions
            </Link>
            <Link href="/refund" className="hover:text-gray-300 transition">
              Refund Policy
            </Link>
            <Link href="/search" className="hover:text-gray-300 transition">
              Search
            </Link>
            <Link href="/contact" className="hover:text-gray-300 transition">
              contact
            </Link>
          </div>

          {/* Column 2 — CONTACT */}
          <div className="flex flex-col gap-3 text-end">
            <h3 className="font-semibold text-lg">ارقامنا للتواصل</h3>

            <Link
              href="tel:01060008582"
              className="text-gray-300 hover:text-white transition"
            >
              01060008582
            </Link>
          </div>

          {/* Column 1 — ADDRESS */}
          <div className="flex flex-col gap-3 text-end">
            <h3 className="font-semibold text-lg flex items-center gap-2 justify-end">
              مقر فورد الرئيسي
              <span className="text-pink-500">📍</span>
            </h3>

            <p className="text-gray-300 leading-relaxed">
              مصر – القاهرة للمنطقة الصناعية، تقاطع شارع 300
            </p>
          </div>
        </div>

        {/* EMAIL SUBSCRIBE & SOCIAL ICONS ROW */}
        <div className="mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* SOCIAL ICONS */}
          <div className="flex gap-4 text-white">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              <Facebook className="w-6 h-6" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              <Instagram className="w-6 h-6" />
            </Link>
          </div>

          {/* Email Subscribe */}
          <div className="max-w-md w-full">
            <h3 className="text-white text-lg mb-3 text-end">
              Subscribe to our emails
            </h3>

            <div className="flex items-center border border-gray-600 flex-row-reverse overflow-hidden">
              <input
                type="email"
                placeholder="Email"
                dir="ltr"
                className="bg-transparent px-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none"
              />{" "}
              <button
                type="submit"
                className="px-4 py-3 hover:bg-white/20 transition"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-gray-500 text-sm mt-10 border-t border-white/10 pt-4">
          © {new Date().getFullYear()}, forbed
        </div>
      </div>
    </footer>
  );
}
