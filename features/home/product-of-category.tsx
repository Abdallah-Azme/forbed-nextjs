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
import MainLink from "@/components/main-link";
import Link from "next/link";
import HeaderSection from "@/components/header-section";

export default function ProductOfCategory({
  main,
  title = "",
  number = 5,
}: {
  main?: boolean;
  title?: string;
  number?: number;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

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
      id: 6,
      name: "طقم ملايات فوربد قطن",
      price: "LE 1,800.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 7,
      name: "مرتبة فوربد بلاتينيوم",
      price: "LE 7,500.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 8,
      name: "كوفرتة صيفي فوربد",
      price: "LE 1,200.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 9,
      name: "مخدة فوربد ميموري فوم",
      price: "LE 650.00 EGP",
      image: "/mrtba.webp",
    },
    {
      id: 10,
      name: "مرتبة فوربد كلاسيك",
      price: "LE 3,500.00 EGP",
      image: "/mrtba.webp",
    },
  ];

  return (
    <section className="py-4  w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className=" my-5 ">
          <HeaderSection title={title || "New Arrival Products"} />
        </div>

        {/* MOBILE CAROUSEL - Shows 2.15 cards */}
        <div className="lg:hidden">
          <Carousel
            dir="rtl"
            opts={{
              align: "end",
              loop: true,
            }}
            setApi={setApi}
            className="w-full mx-auto relative"
          >
            <CarouselContent className="-ml-2">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 basis-[46.5%]">
                  <ProductCard product={product} />
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
        {/* DESKTOP GRID - Shows 5 items */}
        <div className="hidden lg:grid grid-cols-5 gap-6">
          {(number !== undefined && number !== null
            ? products?.slice(0, number)
            : products
          )?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mx-auto w-fit my-5 hidden lg:block">
          <MainLink
            href="/collections"
            className={
              main
                ? "px-[30px] py-[10px]"
                : "bg-white border border-black text-black px-[30px] py-[10px]"
            }
          >
            View all
          </MainLink>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link
      href={"/products/123"}
      className="bg-[#f3f3f3] cursor-pointer overflow-hidden group transition-transform duration-200 hover:-translate-y-1.5"
    >
      <div className="relative aspect-4/5 overflow-hidden">
        <ImageFallback
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300"
          fill
        />
        {product.soldOut && (
          <div className="absolute bottom-2 left-2 bg-[#f7931d] text-white px-4 py-1 text-xs rounded-full">
            Sold out
          </div>
        )}
      </div>
      <div className="p-4 text-end">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs">FORBED</p>
        <p className="text-gray-600 text-sm">{product.price}</p>
      </div>
    </Link>
  );
}
