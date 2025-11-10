"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import ImageFallback from "@/components/image-fallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function ProductOfCategory() {
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
  ];

  // Duplicate products for seamless marquee feel
  const duplicated = [...products, ...products];

  // Plugins
  const autoplayForward = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );
  const autoplayBackward = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="py-16 bg-gray-50 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          New Arrival Products
        </h2>

        {/* Row 1 - Forward */}
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
            {duplicated.map((product, i) => (
              <CarouselItem
                key={i}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-2"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Row 2 - Backward */}
        <Carousel
          dir="ltr"
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            direction: "ltr",
          }}
          plugins={[autoplayBackward.current]}
        >
          <CarouselContent>
            {duplicated.map((product, i) => (
              <CarouselItem
                key={i + 100}
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

function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-4/5 overflow-hidden">
        <ImageFallback
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          fill
        />
        {product.soldOut && (
          <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded">
            Sold out
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm">{product.price}</p>
      </div>
    </div>
  );
}
