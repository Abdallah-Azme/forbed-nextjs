"use client";

import ImageFallback from "@/components/image-fallback";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { easeOut, motion } from "framer-motion";
import { useLocale } from "next-intl";
import * as React from "react";

export default function FeaturesSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section className="py-4 bg-white overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* MOBILE CAROUSEL */}
        <div className="lg:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full mx-auto relative"
          >
            <CarouselContent className="-ml-1 md:-ml-2">
              {features.map((feature) => (
                <CarouselItem
                  key={feature.id}
                  className="pl-1 md:pl-2 basis-full"
                >
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="rounded-lg p-6 text-center   transition-all duration-300">
                      <div className=" mx-auto mb-4 rounded-full  flex items-center justify-center">
                        <ImageFallback
                          src={feature.icon}
                          alt={feature.title}
                          className="size-[230px] object-contain"
                          width={230}
                          height={230}
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controls */}
            <div
              className="flex items-center justify-center gap-2 "
              dir={"lrt"}
            >
              <CarouselPrevious className="static translate-y-0 size-10 rounded-full transition-colors border-0 bg-transparent shadow-none hover:bg-transparent" />

              <span className="text-sm font-medium text-gray-600 min-w-[2ch] text-center">
                {current}
              </span>

              <CarouselNext className="static translate-y-0 size-10 rounded-full transition-colors border-0 bg-transparent shadow-none hover:bg-transparent" />
            </div>
          </Carousel>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                y: -6,

                transition: { duration: 0.3 },
              }}
            >
              <div className="rounded-lg p-6 text-center transition-all duration-300 h-full">
                <div className="  mx-auto mb-4 rounded-full   flex items-center justify-center">
                  <ImageFallback
                    src={feature.icon}
                    alt={feature.title}
                    className="size-[71px] object-contain"
                    width={71}
                    height={71}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
