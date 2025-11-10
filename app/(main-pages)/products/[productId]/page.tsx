import ProductDetails from "@/features/product/components/product-details";
import SimilarProducts from "@/features/product/components/similar-products";
import React from "react";

export default function page() {
  return (
    <main className="container px-4 mx-auto">
      <ProductDetails />
      <SimilarProducts />
    </main>
  );
}
