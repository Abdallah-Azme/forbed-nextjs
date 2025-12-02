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
import { HomeProduct } from "@/types/api";

export default function ProductOfCategory({
  main,
  title = "",
  number = 5,
  products = [],
}: {
  main?: boolean;
  title?: string;
  number?: number;
  products?: HomeProduct[];
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

  if (!products.length) return null;

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

function ProductCard({ product }: { product: HomeProduct }) {
  const isSoldOut = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-[#f3f3f3] cursor-pointer overflow-hidden group transition-transform duration-200 hover:-translate-y-1.5 block h-full"
    >
      <div className="relative aspect-4/5 overflow-hidden">
        <ImageFallback
          src={product.thumbnail}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300"
          fill
        />
        {isSoldOut && (
          <div className="absolute bottom-2 left-2 bg-[#f7931d] text-white px-4 py-1 text-xs rounded-full">
            Sold out
          </div>
        )}
        {product.is_new && !isSoldOut && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-[10px] rounded">
            NEW
          </div>
        )}
        {product.price.has_offer && !isSoldOut && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-[10px] rounded">
            SALE
          </div>
        )}
      </div>
      <div className="p-4 text-end">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs mb-1">FORBED</p>

        <div className="flex flex-col items-end gap-1">
          {product.price.start_from && (
            <span className="text-xs text-gray-500">Starts from</span>
          )}

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-gray-800 font-bold text-sm">
              LE {product.price.price_after_discount.toLocaleString()}
            </span>

            {product.price.has_offer && (
              <span className="text-gray-400 text-xs line-through">
                LE {product.price.price_before_discount.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
