"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ImageFallback from "@/components/image-fallback";
import HeaderSection from "@/components/header-section";
import Link from "next/link";
import * as React from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import MainLink from "@/components/main-link";
import { Blog } from "@/types/api";
import { cn } from "@/lib/utils";

interface BlogSectionProps {
  blogs?: Blog[];
}

export function BlogSection({ blogs = [] }: BlogSectionProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  if (!blogs.length) return null;

  return (
    <section className="container mx-auto py-2 px-4 space-y-8">
      <div className=" my-5 ">
        <HeaderSection title="المقالات" />
      </div>

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
          <CarouselContent className="-ml-2 md:-ml-4">
            {blogs.map((blog, i) => (
              <CarouselItem key={i} className="pl-2 md:pl-4 basis-full">
                <BlogCard blog={blog} index={i} />
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

      {/* DESKTOP GRID */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {blogs.map((blog, i) => (
          <BlogCard key={i} blog={blog} index={i} />
        ))}
      </div>

      <div className="mx-auto w-fit my-5 hidden lg:block">
        <MainLink href="/blogs" className="px-[30px] py-[10px]">
          View all
        </MainLink>
      </div>
    </section>
  );
}

function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -1.5 }}
      transition={{ type: "tween", duration: 0.2 }}
    >
      <Link
        href={blog.slug ? `/blogs/${blog.slug}` : "#"}
        className="group flex rounded-none border-none flex-col overflow-hidden h-auto transition-all duration-300 bg-white pt-0"
      >
        <div className="p-0 overflow-hidden">
          <div className="relative w-full aspect-4/3 lg:aspect-auto lg:h-[244px]">
            <ImageFallback
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
            />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg leading-snug text-right group-hover:underline transition-all duration-200 line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-sm min-h-[70px] text-gray-600 leading-relaxed line-clamp-3 text-right">
            {blog.text}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
