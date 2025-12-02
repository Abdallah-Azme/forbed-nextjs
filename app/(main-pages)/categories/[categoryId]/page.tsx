"use client";

import React, { useState } from "react";
import { FilterBar } from "@/features/category/components/filter-bar";
import { CategoryProductCard } from "@/features/category/components/category-product-card";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const page = searchParams.get("page") || "1";

  const { data: categoryDetails, isLoading } = useQuery({
    queryKey: ["category", categoryId, page],
    queryFn: () => categoryService.getCategory(categoryId, parseInt(page)),
  });

  // Since the API response structure for pagination is provided, we assume getCategory handles the page param or we need to append it.
  // The provided API endpoint example was /client/categories/test-1?page=1
  // So we should update the service to accept query params or handle it here.
  // For now, let's assume the service needs a small update to pass the query string,
  // OR we can just append it to the ID if the service doesn't support params object.
  // Actually, looking at the service, it just takes categoryId.
  // I should probably update the service to accept params, but for now I'll hack it slightly or rely on the fact that I can pass "slug?page=1" if needed,
  // but better to fix the service.
  // Wait, I can't easily change the service signature without breaking other things potentially.
  // Let's assume for this step I'll just fetch the category.
  // BUT the user wants pagination.
  // Let's update the queryFn to include the page in the URL.

  const handlePageChange = (newPage: number) => {
    router.push(`/categories/${categoryId}?page=${newPage}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!categoryDetails) {
    return <div className="text-center py-20">Category not found</div>;
  }

  const { category, products } = categoryDetails;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium text-right mb-8">{category.name}</h1>

      <FilterBar count={products.meta.total} />

      {products.data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No products found in this category.
        </div>
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
