"use client";

import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/content.service";
import { settingsService } from "@/services/settings.service";
import ImageFallback from "@/components/image-fallback";
import { useTranslations } from "next-intl";

export default function AdBar() {
  const t = useTranslations("Header");
  const { data: socials = [], isLoading: isLoadingSocials } = useQuery({
    queryKey: ["socials"],
    queryFn: homeService.getSocials,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getSettings(),
    staleTime: 0, // Always fetch fresh data
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#f7931d] text-white py-2 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          {/* --- Placeholder for spacing (keeps layout balanced) --- */}
          <div className="hidden sm:block w-6"></div>

          {/* --- Promo Text (Marquee) --- */}
          <div className="flex-1 w-full max-w-2xl mx-auto overflow-hidden relative h-6">
            {/* Styles for continuous marquee */}
            <style jsx global>{`
              @keyframes marquee-scroll {
                0% {
                  left: 100%;
                }
                100% {
                  left: -20%;
                }
              }
              .animate-marquee-scroll {
                animation: marquee-scroll 10s linear infinite;
              }
              .animate-marquee-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>

            {/* Continuous Marquee - content-width based with small gap */}
            <div className="absolute top-0 flex items-center h-full whitespace-nowrap animate-marquee-scroll">
              {/* First copy */}
              <Link
                href="/categories"
                className="hover:underline text-xs sm:text-sm font-medium tracking-wide inline-flex items-center gap-2 px-12"
              >
                <span>
                  {settings?.adtext?.title
                    ? settings.adtext.title
                    : t("promoText")}
                </span>
                <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* --- Social Icons --- */}
          <motion.div
            className="flex gap-5 shrink-0"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { delayChildren: 0.3, staggerChildren: 0.15 },
              },
            }}
          >
            {!isLoadingSocials &&
              socials.map((social) => (
                <motion.div
                  key={social.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className=""
                >
                  <Link
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white cursor-pointer block"
                    aria-label={social.title}
                  >
                    <ImageFallback
                      src={social.icon}
                      alt={social.title}
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  </Link>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
