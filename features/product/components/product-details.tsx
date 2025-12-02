"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/features/carts/stores/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import ProductOfCategory from "@/features/home/product-of-category";
import ProductInfoSection from "./product-info-section";

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart, isLoading: isAddingToCart } = useCartStore();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProduct(productId),
    enabled: !!productId,
  });

  const handleAddToCart = async (
    redirect: boolean,
    quantity: number,
    specification_id?: string
  ) => {
    if (!product) return;

    await addToCart(
      {
        id: product.id.toString(),
        name: product.name,
        price: product.price.price_after_discount,
        image: product.images[0] || "/placeholder.png",
      },
      quantity,
      specification_id
    );

    toast.success("Added to cart");

    if (redirect) {
      router.push("/cart");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        Failed to load product details.
      </div>
    );
  }

  return (
    <>
      <ProductInfoSection
        product={product}
        onAddToCart={handleAddToCart}
        isAddingToCart={isAddingToCart}
      />

      {/* Related Products */}
      {product.related && product.related.length > 0 && (
        <ProductOfCategory
          title="Related Products"
          products={product.related}
        />
      )}
    </>
  );
}
