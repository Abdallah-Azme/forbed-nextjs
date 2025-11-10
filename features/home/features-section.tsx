"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import ImageFallback from "@/components/image-fallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, easeOut } from "framer-motion";

export default function FeaturesSection() {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const features = [
    {
      id: 1,
      title: "Shipping All over Egypt",
      description: "Free shipping on all orders or orders above 25k",
      icon: "/service.webp",
    },
    {
      id: 2,
      title: "After Sales Service",
      description: "Simply return it within 30 days for an exchange.",
      icon: "/service.webp",
    },
    {
      id: 3,
      title: "Secure Payment",
      description: "We ensure secure payment with PEV",
      icon: "/service.webp",
    },
    {
      id: 4,
      title: "24/7 Support",
      description: "Contact us 24 hours a day, 7 days a week",
      icon: "/service.webp",
    },
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  } as const;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          Our Features
        </motion.h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          className="w-full mx-auto p-4 "
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex w-full"
            >
              {features.map((feature) => (
                <CarouselItem
                  key={feature.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center"
                >
                  <motion.div
                    variants={itemVariants}
                    whileHover={{
                      y: -6,
                      boxShadow:
                        "0 8px 18px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
                      transition: { duration: 0.3 },
                    }}
                    className="bg-gray-50 rounded-lg p-6 text-center shadow-sm transition-all duration-300 w-[214px]"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <ImageFallback
                        src={feature.icon}
                        alt={feature.title}
                        className="size-12 object-contain"
                        width={48}
                        height={48}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
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
