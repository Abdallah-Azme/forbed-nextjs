"use client";

import { Loader2 } from "lucide-react";
import { useCartStore } from "@/features/carts/stores/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import ProductOfCategory from "@/features/home/product-of-category";
import ProductInfoSection from "./product-info-section";
import { ProductDetails, HomeProduct } from "@/types/api";

interface ProductDetailProps {
  productId?: string;
  productData?: HomeProduct; // For featured product on home page
}

export default function ProductDetail({
  productId,
  productData,
}: ProductDetailProps) {
  const router = useRouter();
  const { addToCart, isLoading: isAddingToCart } = useCartStore();

  // Only fetch if productId is provided and no productData
  const {
    data: fetchedProduct,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProduct(productId!),
    enabled: !!productId && !productData,
  });

  // Convert HomeProduct to ProductDetails format if productData is provided
  const product: ProductDetails | undefined = productData
    ? {
        id: productData.id,
        slug: productData.slug,
        name: productData.name,
        images: [productData.thumbnail],
        price: productData.price,
        description: "", // HomeProduct doesn't have description
        specifications: [], // HomeProduct doesn't have specifications
        related: [], // HomeProduct doesn't have related products
      }
    : fetchedProduct;

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

      {/* Related Products - only show if fetched from API */}
      {fetchedProduct?.related && fetchedProduct.related.length > 0 && (
        <ProductOfCategory
          title="Related Products"
          products={fetchedProduct.related}
        />
      )}
    </>
  );
}
