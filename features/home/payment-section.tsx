"use client";

import * as React from "react";
import ImageFallback from "@/components/image-fallback";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import HeaderSection from "@/components/header-section";

export default function PaymentSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  const paymentMethods = Array.from({ length: 10 }).map(
    () => "/vodafone-cash.webp"
  );

  return (
    <section className="py-8 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className=" my-5 ">
          <HeaderSection title={"Payment Method" || "New Arrival Products"} />
        </div>
        {/* MOBILE CAROUSEL - Shows 2.15 items */}
        <div className="lg:hidden">
          <Carousel
            opts={{
              align: "end",
              loop: true,
            }}
            setApi={setApi}
            className="w-full mx-auto relative"
          >
            <CarouselContent className="-ml-2">
              {paymentMethods.map((payment, i) => (
                <CarouselItem key={i} className="pl-2 basis-[46.5%]">
                  <div className="flex items-center justify-center">
                    <ImageFallback
                      src={payment}
                      width={236}
                      height={236}
                      alt={`Payment method ${i + 1}`}
                      className="size-[236px]"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controls */}
            <div
              className="flex items-center justify-center gap-2 mt-4"
              dir="ltr"
            >
              <CarouselPrevious className="static translate-y-0 size-10 rounded-full transition-colors border-0 bg-transparent shadow-none hover:bg-transparent" />

              <span className="text-sm font-medium text-gray-600 min-w-[2ch] text-center">
                {current}
              </span>

              <CarouselNext className="static translate-y-0 size-10 rounded-full transition-colors border-0 bg-transparent shadow-none hover:bg-transparent" />
            </div>
          </Carousel>
        </div>

        {/* DESKTOP GRID - Shows 2 rows */}
        <div className="hidden lg:block space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-5 gap-6">
            {paymentMethods.slice(0, 5).map((payment, i) => (
              <div key={i} className="flex items-center justify-center">
                <ImageFallback
                  src={payment}
                  width={130}
                  height={130}
                  alt={`Payment method ${i + 1}`}
                  className="size-[130px]"
                />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-5 gap-6">
            {paymentMethods.slice(5, 10).map((payment, i) => (
              <div key={i + 5} className="flex items-center justify-center">
                <ImageFallback
                  src={payment}
                  width={130}
                  height={130}
                  alt={`Payment method ${i + 6}`}
                  className="size-[130px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
