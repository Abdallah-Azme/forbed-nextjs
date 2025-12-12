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
          <div className="flex-1 w-full max-w-2xl mx-auto overflow-hidden relative group h-6 pointer-events-none">
            {/* Styles for marquee */}
            <style jsx global>{`
              @keyframes marquee-travel {
                0% {
                  left: 100%;
                }
                100% {
                  left: -100%;
                }
              }
              .animate-marquee-travel {
                animation: marquee-travel 15s linear infinite;
              }
              .group:hover .animate-marquee-travel {
                animation-play-state: paused;
              }
            `}</style>

            {(settings?.adtext?.title || t("promoText")) && (
              <>
                {/* Spacer to maintain height / width context if needed, though we set fixed h-6 */}
                {/* Actual Marquee Element */}
                <div className="absolute top-0 flex items-center h-full whitespace-nowrap animate-marquee-travel pointer-events-auto">
                  <Link
                    href="/categories"
                    className="hover:underline text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 px-4"
                  >
                    <span>{settings?.adtext?.title || t("promoText")}</span>
                    <MoveRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            )}
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
