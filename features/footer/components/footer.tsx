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
import NewsletterForm from "./newsletter-form";

import { settingsService } from "@/services/settings.service";
import ImageFallback from "@/components/image-fallback";

export default function Footer() {
  const { data: footerData, isLoading: isFooterLoading } = useQuery({
    queryKey: ["footer-data"],
    queryFn: () => homeService.getFooterData(),
  });

  const { data: pages = [], isLoading: isPagesLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: () => homeService.getPages(),
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getSettings(),
  });

  // Helper to map API keys to routes
  const getPageRoute = (key: string) => {
    // All dynamic pages now use the /pages/[slug] route
    return `/pages/${key}`;
  };

  if (isFooterLoading || isPagesLoading) {
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
            {pages.map((page) => (
              <Link
                key={page.key}
                href={getPageRoute(page.key)}
                className="hover:text-gray-300 transition"
              >
                {page.text}
              </Link>
            ))}
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
              مقر {settings?.site_info?.title || "الشركة"} الرئيسي
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
                    <ImageFallback
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
          <NewsletterForm />
        </div>

        {/* COPYRIGHT */}
        <div className="text-end text-gray-500 text-sm mt-10 border-t border-white/10 pt-4">
          © {new Date().getFullYear()}, Rich House
        </div>
      </div>
    </footer>
  );
}
