"use client";

import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/content.service";
import Image from "next/image";
import { API_CONFIG } from "@/config/api.config";

export default function Footer() {
  const { data: footerData, isLoading } = useQuery({
    queryKey: ["footer-data"],
    queryFn: () => homeService.getFooterData(),
  });

  if (isLoading) {
    return (
      <footer className="bg-black text-white pt-10 pb-6 font-sans overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-black text-white pt-10 pb-6 font-sans overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Column 3 — LINKS */}
          <div className="flex flex-col gap-2 text-end order-3 md:order-1">
            <Link href="/" className="hover:text-gray-300 transition">
              الصفحة الرئيسية
            </Link>
            <Link href="/shipping" className="hover:text-gray-300 transition">
              سياسة الشحن
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition">
              الشروط والأحكام
            </Link>
            <Link href="/refund" className="hover:text-gray-300 transition">
              سياسة الاسترجاع
            </Link>
            <Link href="/search" className="hover:text-gray-300 transition">
              بحث
            </Link>
            <Link href="/contact" className="hover:text-gray-300 transition">
              تواصل معنا
            </Link>
          </div>

          {/* Column 2 — CONTACT */}
          <div className="flex flex-col gap-3 text-end order-2 md:order-2">
            <h3 className="font-semibold text-lg">ارقامنا للتواصل</h3>

            {footerData?.contact_info.phone && (
              <Link
                href={`tel:${footerData.contact_info.phone}`}
                className="text-gray-300 hover:text-white transition"
              >
                {footerData.contact_info.phone}
              </Link>
            )}

            {footerData?.contact_info.whatsapp && (
              <Link
                href={`https://wa.me/${footerData.contact_info.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                واتساب: {footerData.contact_info.whatsapp}
              </Link>
            )}

            {footerData?.contact_info.email && (
              <Link
                href={`mailto:${footerData.contact_info.email}`}
                className="text-gray-300 hover:text-white transition"
              >
                {footerData.contact_info.email}
              </Link>
            )}
          </div>

          {/* Column 1 — ADDRESS */}
          <div className="flex flex-col gap-3 text-end order-1 md:order-3">
            <h3 className="font-semibold text-lg flex items-center gap-2 justify-end">
              مقر فورد الرئيسي
              <span className="text-pink-500">📍</span>
            </h3>

            {footerData?.contact_info?.location?.address && (
              <p className="text-gray-300 leading-relaxed">
                {footerData.contact_info.location.address}
              </p>
            )}
          </div>
        </div>

        {/* EMAIL SUBSCRIBE & SOCIAL ICONS ROW */}
        <div className="mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* SOCIAL ICONS */}
          <div className="flex gap-4 text-white">
            {footerData?.socials.map((social) => (
              <Link
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition"
                title={social.title}
              >
                {social.icon ? (
                  <div className="relative w-6 h-6">
                    <Image
                      src={
                        social.icon.startsWith("http")
                          ? social.icon
                          : `${API_CONFIG.baseURL.replace(
                              "/api",
                              ""
                            )}/${social.icon.replace(/\\/g, "/")}`
                      }
                      alt={social.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Facebook className="w-6 h-6" />
                )}
              </Link>
            ))}
          </div>

          {/* Email Subscribe */}
          <div className="max-w-md w-full">
            <h3 className="text-white text-lg mb-3 text-end">
              اشترك في نشرتنا البريدية
            </h3>

            <div className="flex items-center border border-gray-600 flex-row-reverse overflow-hidden">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                dir="ltr"
                className="bg-transparent px-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none"
              />
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
        <div className="text-end text-gray-500 text-sm mt-10 border-t border-white/10 pt-4">
          © {new Date().getFullYear()}, Rich House
        </div>
      </div>
    </footer>
  );
}
