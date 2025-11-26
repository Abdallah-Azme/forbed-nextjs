"use client";

import * as React from "react";
import { motion, easeOut } from "framer-motion";
import { useLocale } from "next-intl";
import GhostLink from "@/components/ghost-link";
import MainLink from "@/components/main-link";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { CategoryCard } from "./category-card";
import HeaderSection from "@/components/header-section";

export default function CategoriesCollection() {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

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

  // Animations
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section className="pt-4 pb-4 w-full">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="flex justify-between items-center mb-8">
          <GhostLink href="/collections" className="lg:hidden">
            View all
          </GhostLink>

          <HeaderSection title="Collections" />
        </div>

        {/* MOBILE CAROUSEL */}
        <div className="lg:hidden">
          <Carousel
            opts={{
              align: "end",
              loop: true,
              direction: dir,
            }}
            setApi={setApi}
            className="w-full mx-auto relative"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {collections.map((collection) => (
                <CarouselItem
                  key={collection.id}
                  className="pl-2 md:pl-4 basis-[46.5%] sm:basis-1/3 md:basis-1/4"
                >
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <CategoryCard collection={collection} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controls */}
            <div
              className="flex items-center justify-center gap-2 mt-8"
              dir="ltr"
            >
              <CarouselPrevious className="static translate-y-0 size-10  rounded-full transition-colors border-0 bg-transparent shadow-none hover:bg-transparent" />

              <span className="text-sm font-medium text-gray-600 min-w-[2ch] text-center">
                {current}
              </span>

              <CarouselNext className="static translate-y-0 size-10  rounded-full transition-colors border-0 bg-transparent shadow-none hover:bg-transparent" />
            </div>
          </Carousel>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {collections.slice(0, 4).map((collection) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <CategoryCard collection={collection} />
            </motion.div>
          ))}
        </div>

        <div className="mx-auto w-fit my-5 hidden lg:block">
          <MainLink href="/collections" className="px-[30px] py-[10px]">
            View all
          </MainLink>
        </div>
      </div>
    </section>
  );
}
