"use client";
import ImageFallback from "@/components/image-fallback";
import { useState } from "react";

export default function ProductOfCategory() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    {
      id: 1,
      name: "كوفرتة 3 قطع فوربد مجوز 240*240",
      price: "LE 1,550.00 EGP",
      image: "/images/product1.jpg",
      soldOut: true,
    },
    // Add more products...
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          New Arrival Products
        </h2>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ImageFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fill
                  />
                  {product.soldOut && (
                    <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded">
                      Sold out
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
