"use client";

import { Loader2, PackageX } from "lucide-react";
import { useCartStore } from "@/features/carts/stores/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import ProductOfCategory from "@/features/home/product-of-category";
import ProductInfoSection from "./product-info-section";
import { ProductDetails, HomeProduct } from "@/types/api";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    refetch,
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
    return <LoadingState type="spinner" text="Loading product details..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load product"
        description="We couldn't load this product. It may have been removed or is temporarily unavailable."
        onRetry={() => refetch()}
      />
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon={PackageX}
        title="Product not found"
        description="The product you're looking for doesn't exist or has been removed."
        action={
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Browse Products
            </Button>
          </Link>
        }
      />
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
