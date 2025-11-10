"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsapp() {
  // 🟢 Replace this with your WhatsApp number (without "+" or spaces)
  const phoneNumber = "201234567890"; // Example: 201234567890 = +20 123 456 7890

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.2 }}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  );
}
