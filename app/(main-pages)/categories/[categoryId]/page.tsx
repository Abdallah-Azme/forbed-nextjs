import React from "react";
import { FilterBar } from "@/features/category/components/filter-bar";
import { CategoryProductCard } from "@/features/category/components/category-product-card";

export default function Page() {
  const products = [
    {
      id: 1,
      name: "مرتبة سوست منفصلة فوربد كومباكت",
      price: "LE 4,352.00 EGP",
      oldPrice: "LE 5,120.00 EGP",
      image: "/mrtba.webp",
      sale: true,
    },
    {
      id: 2,
      name: "مرتبه فوربد سوست منفصله كلاس",
      price: "LE 4,926.00 EGP",
      oldPrice: "LE 5,795.00 EGP",
      image: "/mrtba.webp",
      sale: true,
    },
    {
      id: 3,
      name: "مرتبه سوست منفصله فوربد برايم",
      price: "LE 5,542.00 EGP",
      oldPrice: "LE 6,520.00 EGP",
      image: "/mrtba.webp",
      sale: true,
    },
    {
      id: 4,
      name: "مرتبه بوكت سوست منفصله فوربد اليجانس",
      price: "LE 9,359.00 EGP",
      oldPrice: "LE 10,130.00 EGP",
      image: "/mrtba.webp",
      sale: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium text-right mb-8">
        سوست منفصلة (فوربد)
      </h1>

      <FilterBar count={9} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <CategoryProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
