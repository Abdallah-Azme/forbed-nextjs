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
import { HomeBranch, HomePaymentMethod } from "@/types/api";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PaymentSectionProps {
  paymentMethods?: HomePaymentMethod[];
  branches?: HomeBranch[];
}

export default function PaymentSection({
  paymentMethods = [],
  branches = [],
}: PaymentSectionProps) {
  const t = useTranslations("HomePage");
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  if (!paymentMethods.length && !branches.length) return null;

  return (
    <section className="py-2 w-full overflow-hidden space-y-12 mb-10">
      {/* Branches */}
      {branches.length > 0 && (
        <div className="container mx-auto px-4">
          <div className=" my-5 ">
            <HeaderSection title={t("ourBranches")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <Link
                key={branch.id}
                href={branch.map_link}
                target="_blank"
                className="flex flex-col items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow group"
              >
                <div className="shrink-0 relative size-40 rounded-sm overflow-hidden bg-gray-100">
                  <ImageFallback
                    src={branch.icon}
                    alt={branch.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 text-start">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {branch.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {branch.text}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* Payment Methods */}
      {paymentMethods.length > 0 && (
        <div className="container mx-auto px-4">
          <div className=" my-5 ">
            <HeaderSection title={t("paymentMethod")} />
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
                  <CarouselItem
                    key={payment.id}
                    className="pl-2 shrink-0 basis-[46.5%]"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ImageFallback
                        src={payment.image}
                        width={236}
                        height={236}
                        alt={payment.name}
                        className="size-[236px] object-contain"
                      />
                      <span className="text-sm font-medium text-center">
                        {payment.name}
                      </span>
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

          {/* DESKTOP GRID */}
          <div className="hidden lg:grid grid-cols-5 gap-6">
            {paymentMethods.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col items-center justify-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ImageFallback
                  src={payment.image}
                  width={130}
                  height={130}
                  alt={payment.name}
                  className="size-[130px] object-contain"
                />
                <span className="text-sm font-medium text-center">
                  {payment.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
