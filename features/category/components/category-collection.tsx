"use client";

import * as React from "react";
import { motion } from "framer-motion";
import ImageFallback from "@/components/image-fallback";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CategoriesCollection() {
  const collections = [
    {
      id: 1,
      title: "مراتب",
      image: "/images/mattresses.jpg",
      href: "/mattresses",
    },
    {
      id: 2,
      title: "مفروشات",
      image: "/images/bedding.jpg",
      href: "/bedding",
    },
    {
      id: 3,
      title: "اكسسوارات السرير",
      image: "/images/bed-accessories.jpg",
      href: "/bed-accessories",
    },
    {
      id: 4,
      title: "شتاء 2025",
      image: "/images/winter-2025.jpg",
      href: "/winter-2025",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10"
        >
          المجموعات
        </motion.h2>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {collections.map((collection, i) => (
              <CarouselItem
                key={collection.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <Link href={collection.href}>
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                      <div className="relative aspect-[4/3]">
                        <ImageFallback
                          src={collection.image}
                          alt={collection.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="bg-gray-100 text-center py-3">
                        <h3 className="text-base font-semibold text-gray-800 flex justify-center items-center gap-1">
                          {collection.title}{" "}
                          <span className="text-gray-400">→</span>
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls */}
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
