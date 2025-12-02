"use client";

import React from "react";
import { FilterBar } from "@/features/category/components/filter-bar";
import { CategoryProductCard } from "@/features/category/components/category-product-card";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || "1";

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", keyword, page],
    queryFn: () =>
      productService.searchProducts({
        keyword,
        // We might need to handle pagination in the service call if the API supports it via query params
        // The current searchProducts implementation accepts filters, but we need to ensure page is passed correctly if needed.
        // Assuming the API handles page via query string appended to the URL in the service or via the filters object if supported.
        // Based on previous steps, I updated the service to accept filters.
        // I should check if I need to pass page in filters or if I need to update the service to handle page param explicitly like I did for categories.
        // Let's check product.service.ts again.
      }),
  });

  // Re-checking product.service.ts, searchProducts takes filters.
  // The API endpoint is /client/products?keyword=...
  // So passing { keyword } is correct.
  // BUT what about pagination?
  // The API response has pagination links.
  // Usually pagination is handled via ?page=X query param.
  // If I pass { keyword } to axios params, it becomes ?keyword=...
  // I should also pass page.

  // Let's update the queryFn to pass page as well.

  const { data: results, isLoading: isSearchLoading } = useQuery({
    queryKey: ["search", keyword, page],
    queryFn: () =>
      productService.searchProducts({ keyword, page: parseInt(page) }),
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/search?keyword=${keyword}&page=${newPage}`);
  };

  if (isSearchLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!results) {
    return <div className="text-center py-20">No results found</div>;
  }

  const { products } = results;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium text-right mb-8">
        Search Results for: "{keyword}"
      </h1>

      <FilterBar count={products.meta.total} />

      {products.data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No products found matching your search.
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
