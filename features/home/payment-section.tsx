"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import ImageFallback from "@/components/image-fallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function PaymentSection() {
  const paymentMethods = Array.from({ length: 10 }).map(
    () => "/vodafone-cash.webp"
  );

  const duplicated = [...paymentMethods, ...paymentMethods];

  const autoplayForward = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );
  const autoplayBackward = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="py-16 bg-gray-50 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Payment Method</h2>

        {/* Row 1 - Forward */}
        <Carousel
          dir="rtl"
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          plugins={[autoplayForward.current]}
          className=" "
        >
          <CarouselContent>
            {duplicated.map((payment, i) => (
              <CarouselItem key={i} className="basis-[135px] shrink-0  ">
                <ImageFallback
                  src={payment}
                  width={130}
                  height={130}
                  alt={payment}
                  className="size-[130px]"
                />
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
            {duplicated.map((payment, i) => (
              <CarouselItem key={i + 100} className="basis-[135px] shrink-0  ">
                <ImageFallback
                  src={payment}
                  width={130}
                  height={130}
                  alt={payment}
                  className="size-[130px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
