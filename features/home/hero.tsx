"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import ImageFallback from "@/components/image-fallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Slider } from "@/types/api";
import Link from "next/link";
import { useLocale } from "next-intl";

interface HeroBannerProps {
  sliders?: Slider[];
}

export default function HeroBanner({ sliders = [] }: HeroBannerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  if (!sliders.length) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-100 animate-pulse" />
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="ml-0">
          {sliders.map((slider) => (
            <CarouselItem key={slider.id} className="pl-0 relative w-full">
              <div className="relative w-full aspect-2/1 sm:aspect-[2.5/1] lg:aspect-3/1 max-h-[600px]">
                {slider.link ? (
                  <Link href={slider.link} className="block w-full h-full">
                    <ImageFallback
                      src={slider.image}
                      alt={slider.title}
                      fill
                      className="object-cover w-full h-full"
                      priority
                    />
                  </Link>
                ) : (
                  <ImageFallback
                    src={slider.image}
                    alt={slider.title}
                    fill
                    className="object-cover w-full h-full"
                    priority
                  />
                )}

                {/* Optional Overlay Text - Only if title or description exists */}
                {(slider.title || slider.description) && (
                  <div className="absolute inset-0 bg-linear-to-b from-white/20 via-black/60 to-black/60 pointer-events-none flex flex-col items-center justify-center text-center text-white px-4">
                    {slider.title && (
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 drop-shadow-lg">
                        {slider.title}
                      </h2>
                    )}
                    {slider.description && (
                      <p className="text-sm sm:text-lg md:text-xl max-w-2xl drop-shadow-md">
                        {slider.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {sliders.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </section>
  );
}
