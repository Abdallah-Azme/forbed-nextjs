"use client";

import * as React from "react";
import { motion, easeOut } from "framer-motion";
import ImageFallback from "@/components/image-fallback";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay"; // ✅ import autoplay plugin
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CategoriesCollection() {
  const autoplay = React.useRef(
    Autoplay({ delay: 1000, stopOnInteraction: true }) // ✅ auto play every 2.5s and stop when user interacts
  );

  const collections = [
    { id: 1, title: "مراتب", image: "/mrtba.webp", href: "/mattresses" },
    { id: 2, title: "مفروشات", image: "/mrtba.webp", href: "/bedding" },
    {
      id: 3,
      title: "اكسسوارات السرير",
      image: "/mrtba.webp",
      href: "/bed-accessories",
    },
    { id: 4, title: "شتاء 2025", image: "/mrtba.webp", href: "/winter-2025" },
    { id: 5, title: "مراتب", image: "/mrtba.webp", href: "/mattresses" },
    { id: 6, title: "مفروشات", image: "/mrtba.webp", href: "/bedding" },
    {
      id: 7,
      title: "اكسسوارات السرير",
      image: "/mrtba.webp",
      href: "/bed-accessories",
    },
    { id: 8, title: "شتاء 2025", image: "/mrtba.webp", href: "/winter-2025" },
  ];

  // ✅ Type-safe Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  } as const;

  return (
    <section className="py-16 bg-gray-50 w-full">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          المجموعات
        </motion.h2>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[autoplay.current]} // ✅ add plugin
          onMouseEnter={autoplay.current.stop} // ✅ stop when hover
          onMouseLeave={autoplay.current.reset} // ✅ resume when leave
          className="w-full mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex w-full"
            >
              {collections.map((collection) => (
                <CarouselItem
                  key={collection.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <motion.div
                    variants={itemVariants}
                    whileHover={{
                      y: -8,
                      boxShadow:
                        "0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.08)",
                      transition: { duration: 0.3 },
                    }}
                    className="bg-white rounded-lg shadow-sm transition-all duration-300 overflow-hidden"
                  >
                    <Link href={collection.href}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <ImageFallback
                          src={collection.image}
                          alt={collection.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="bg-gray-100 text-center py-6">
                        <h3 className="text-base font-semibold text-gray-800 flex justify-center items-center gap-1">
                          <span className="text-gray-400">→</span>
                          {collection.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </motion.div>
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
