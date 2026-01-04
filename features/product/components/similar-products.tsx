"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";
import { ProductCard } from "./product-card";
import { useTranslations } from "next-intl";

export default function SimilarProducts() {
  const t = useTranslations("Product");
  const products = [
    {
      id: 1,
      name: "كوفرتة 3 قطع فوربد مجوز 240*240",
      price: "LE 1,550.00 EGP",
      image: "/mrtba.webp",
      soldOut: true,
    },
    {
      id: 2,
      name: "مرتبة فوربد سوبر",
      price: "LE 4,250.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 3,
      name: "كوفرتة فوربد فاخرة",
      price: "LE 2,100.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 4,
      name: "مخدة طبية فوربد",
      price: "LE 450.00 EGP",
      image: "/mrtba.webp",
      soldOut: true,
    },
    {
      id: 5,
      name: "مرتبة فوربد جولد",
      price: "LE 6,000.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 1,
      name: "كوفرتة 3 قطع فوربد مجوز 240*240",
      price: "LE 1,550.00 EGP",
      image: "/mrtba.webp",
      soldOut: true,
    },
    {
      id: 2,
      name: "مرتبة فوربد سوبر",
      price: "LE 4,250.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 3,
      name: "كوفرتة فوربد فاخرة",
      price: "LE 2,100.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 4,
      name: "مخدة طبية فوربد",
      price: "LE 450.00 EGP",
      image: "/mrtba.webp",
      soldOut: true,
    },
    {
      id: 5,
      name: "مرتبة فوربد جولد",
      price: "LE 6,000.00 EGP",
      image: "/mrtba.webp",
    },
  ];

  // Plugins
  const autoplayForward = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="py-16 bg-gray-50 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("similarProducts")}
        </h2>

        <Carousel
          dir="rtl"
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          plugins={[autoplayForward.current]}
          className="mb-10"
        >
          <CarouselContent>
            {products.map((product, i) => (
              <CarouselItem
                key={i}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-2"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
