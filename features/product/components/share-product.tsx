"use client";

import { motion } from "framer-motion";
import { Facebook, Link, MessageCircle, Share2, Twitter } from "lucide-react";

export default function ShareProduct() {
  const productUrl = typeof window !== "undefined" ? window.location.href : "";
  const productTitle = "كوفرتة 3 قطع فريب مجوز قطن مخلوط";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productTitle,
          text: "شاهد هذا المنتج الرائع:",
          url: productUrl,
        });
      } catch (err) {
        console.log("Share canceled or failed", err);
      }
    } else {
      alert("المشاركة غير مدعومة على هذا المتصفح.");
    }
  };

  const socials = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        productUrl
      )}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        productUrl
      )}&text=${encodeURIComponent(productTitle)}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      href: `https://wa.me/?text=${encodeURIComponent(
        `${productTitle} - ${productUrl}`
      )}`,
      color: "hover:bg-green-500 hover:text-white",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className="pt-8 flex justify-between items-start gap-4"
      dir="rtl"
    >
      {/* Header */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 250 }}
        onClick={handleNativeShare}
        className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer select-none"
      >
        <Share2 className="w-5 h-5" />
        <span>شارك المنتج</span>
      </motion.div>

      {/* Always visible social icons */}
      <div className="flex items-center gap-3 flex-wrap">
        {socials.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-300 shadow-sm hover:shadow-md ${social.color}`}
          >
            {social.icon}
          </motion.a>
        ))}

        {/* Copy Link Button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigator.clipboard.writeText(productUrl)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white shadow-sm hover:shadow-md transition-all duration-300"
          title="نسخ الرابط"
        >
          <Link className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
