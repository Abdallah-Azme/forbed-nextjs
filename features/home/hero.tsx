"use client";

import { motion } from "framer-motion";
import ImageFallback from "@/components/image-fallback";

export default function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative h-[calc(100vh_-_140px)] w-full overflow-hidden"
    >
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <ImageFallback
          src="/pages/home/hero-image.webp"
          alt="Forbed Mattresses"
          className="w-full h-full object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Optional Overlay Text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4"
      >
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          فوربد خفّضت الأسعار 🔥
        </h1>
        <p className="max-w-xl text-sm sm:text-lg text-gray-200 mb-6">
          اكتشف أفضل المراتب الطبية والمريحة بأسعار تناسب الجميع.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/collections"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          تسوّق الآن
        </motion.a>
      </motion.div>
    </motion.section>
  );
}
