"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useCartStore } from "@/features/carts/stores/cart-store";
import ProductOfCategory from "@/features/home/product-of-category";
import { cn } from "@/lib/utils";
import { productService } from "@/services/product.service";
import { HomeProduct, ProductDetails } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { PackageX } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductInfoSection from "./product-info-section";

interface ProductDetailProps {
  productId?: string;
  productData?: HomeProduct; // For featured product on home page
}

export default function ProductDetail({
  productId,
  productData,
}: ProductDetailProps) {
  const t = useTranslations("Product");
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

  console.log({ fetchedProduct });
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
        stock: productData.stock,
      }
    : fetchedProduct;

  const handleAddToCart = async (
    redirect: boolean,
    quantity: number,
    specification_id?: string
  ) => {
    if (!product) return;

    const result = await addToCart(
      {
        id: product.id.toString(),
        name: product.name,
        price: product.price.price_after_discount,
        image: product.images[0] || "/placeholder.png",
        stock: product.stock,
      },
      quantity,
      specification_id
    );

    if (result.success) {
      toast.success(t("addedToCart"));
      if (redirect) {
        router.push("/cart");
      }
    }
  };

  if (isLoading) {
    return <LoadingState type="spinner" text={t("loadingDetails")} />;
  }

  if (error) {
    return (
      <ErrorState
        title={t("failedToLoad")}
        description={t("failedDescription")}
        onRetry={() => refetch()}
      />
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon={PackageX}
        title={t("notFound")}
        description={t("notFoundDescription")}
        action={
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">
              {t("browseProducts")}
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className={cn(productData && "bg-[#f3f3f3]  w-full")}>
      <div className={cn(productData && " container mx-auto px-4")}>
        <ProductInfoSection
          product={product}
          onAddToCart={handleAddToCart}
          isAddingToCart={isAddingToCart}
        />

        {/* Related Products - only show if fetched from API */}
        {fetchedProduct?.related && fetchedProduct.related.length > 0 && (
          <ProductOfCategory
            title={t("relatedProducts")}
            products={fetchedProduct.related}
          />
        )}
      </div>
    </div>
  );
}
