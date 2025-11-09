"use client";
import CategoriesCollection from "@/features/category/components/category-collection";
import { BlogSection } from "@/features/home/blogs";
import FeaturesSection from "@/features/home/features";
import HeroBanner from "@/features/home/hero";
import {
  default as NewArrivalSection,
  default as ProductOfCategory,
} from "@/features/home/new-arrival-section";
import PaymentSection from "@/features/home/payment-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center ">
      <HeroBanner />
      <CategoriesCollection />
      <FeaturesSection />
      <NewArrivalSection />
      <ProductOfCategory />
      <BlogSection />
      <PaymentSection />
    </div>
  );
}
