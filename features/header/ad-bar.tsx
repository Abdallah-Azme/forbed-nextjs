"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, MoveRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/content.service";
import Image from "next/image";
import ImageFallback from "@/components/image-fallback";

export default function AdBar() {
  const { data: socials = [], isLoading } = useQuery({
    queryKey: ["socials"],
    queryFn: homeService.getSocials,
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#f7931d] text-white py-2"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          {/* --- Placeholder for spacing (keeps layout balanced) --- */}
          <div className="hidden sm:block w-6"></div>

          {/* --- Promo Text --- */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center sm:text-right"
          >
            <Link
              href="/categories"
              className="hover:underline text-xs flex items-center gap-2 font-medium tracking-wide"
            >
              <MoveRight className="text-[14px]" />
              خصومات تصل إلى %20
            </Link>
          </motion.div>

          {/* --- Social Icons --- */}
          <motion.div
            className="flex gap-5"
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
            {!isLoading &&
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
