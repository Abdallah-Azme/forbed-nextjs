"use client";

import React, { useState } from "react";
import { FilterBar } from "@/features/category/components/filter-bar";
import { CategoryProductCard } from "@/features/category/components/category-product-card";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const page = searchParams.get("page") || "1";

  const {
    data: categoryDetails,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category", categoryId, page],
    queryFn: () => categoryService.getCategory(categoryId, parseInt(page)),
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/categories/${categoryId}?page=${newPage}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 w-48 bg-gray-200 rounded mb-8 animate-pulse" />
        <LoadingState type="skeleton" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Failed to load category"
          description="We couldn't load this category. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!categoryDetails || !categoryDetails.category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={FolderOpen}
          title="Category not found"
          description="The category you're looking for doesn't exist or has been removed."
          action={
            <Link href="/categories">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Browse All Categories
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const { category, products } = categoryDetails;

  const [sortBy, setSortBy] = useState("best-selling");
  const [priceRange, setPriceRange] = useState("all");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium text-right mb-8">{category.name}</h1>

      <FilterBar
        count={products.meta.total}
        onSortChange={setSortBy}
        onPriceChange={setPriceRange}
      />

      {products.data.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No products in this category"
          description="This category doesn't have any products yet. Check back later!"
          action={
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Browse All Products
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.data.map((product) => (
              <CategoryProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {products.meta.last_page > 1 && (
            <div
              className="flex justify-center items-center gap-2 mt-12"
              dir="ltr"
            >
              <button
                onClick={() => handlePageChange(products.meta.current_page - 1)}
                disabled={products.meta.current_page === 1}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from(
                  { length: products.meta.last_page },
                  (_, i) => i + 1
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-md transition-colors ${
                      products.meta.current_page === p
                        ? "bg-orange-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(products.meta.current_page + 1)}
                disabled={
                  products.meta.current_page === products.meta.last_page
                }
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
