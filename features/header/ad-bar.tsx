"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function AdBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-orange-500 text-white py-2"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          {/* --- Social Icons --- */}
          <motion.div
            className="flex space-x-3"
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
            {[Instagram, Facebook].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Icon className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* --- Promo Text --- */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center sm:text-right"
          >
            <Link
              href="/collections"
              className="hover:underline text-sm sm:text-base font-medium tracking-wide"
            >
              خصومات تصل إلى %20
            </Link>
          </motion.div>

          {/* --- Placeholder for spacing (keeps layout balanced) --- */}
          <div className="hidden sm:block w-6"></div>
        </div>
      </div>
    </motion.div>
  );
}
