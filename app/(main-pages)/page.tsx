"use client";

import { useQuery } from "@tanstack/react-query";
import CategoriesCollection from "@/features/category/components/category-collection";
import { BlogSection } from "@/features/home/blogs";
import FeaturesSection from "@/features/home/features-section";
import HeroBanner from "@/features/home/hero";
import PaymentSection from "@/features/home/payment-section";
import ProductOfCategory from "@/features/home/product-of-category";
import { homeService } from "@/services/content.service";
import { Loader2 } from "lucide-react";
import ProductDetail from "@/features/product/components/product-details";

export default function Home() {
  const {
    data: homeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["home-data"],
    queryFn: () => homeService.getHomeData(),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load home page data. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center ">
      <HeroBanner sliders={homeData?.sliders} />
      <CategoriesCollection
        title="Collections"
        categories={homeData?.categories}
      />
      <FeaturesSection services={homeData?.services} />

      {/* New Products */}
      <ProductOfCategory
        main
        title="New Arrivals"
        products={homeData?.new_products}
      />

      {/* Random Products */}
      <ProductOfCategory
        title="Recommended for You"
        products={homeData?.random_products}
      />

      <BlogSection blogs={homeData?.blogs} />

      {homeData?.featured_product && (
        <ProductDetail productData={homeData.featured_product} />
      )}

      <PaymentSection
        paymentMethods={homeData?.payment_methods}
        branches={homeData?.branches}
      />
    </div>
  );
}
