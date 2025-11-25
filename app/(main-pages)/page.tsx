"use client";
import CategoriesCollection from "@/features/category/components/category-collection";
import { BlogSection } from "@/features/home/blogs";
import FeaturesSection from "@/features/home/features-section";
import HeroBanner from "@/features/home/hero";

import PaymentSection from "@/features/home/payment-section";
import ProductOfCategory from "@/features/home/product-of-category";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center ">
      <HeroBanner />
      <CategoriesCollection />
      <FeaturesSection />
      <ProductOfCategory main />
      <ProductOfCategory title="خداديه فوربد" />
      <BlogSection />
      <PaymentSection />
    </div>
  );
}
