"use client";

import React from "react";
import { FilterBar } from "@/features/category/components/filter-bar";
import { CategoryProductCard } from "@/features/category/components/category-product-card";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || "1";

  const [sortBy, setSortBy] = React.useState("best-selling");
  const [priceRange, setPriceRange] = React.useState("all");

  const filters = React.useMemo(() => {
    const params: any = { keyword, page: parseInt(page) };

    // Sort
    if (sortBy === "created-desc") {
      params.order_by_new = true;
    }

    // Price
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-");
      if (min) params.price_min = parseInt(min);
      if (max && max !== "plus") params.price_max = parseInt(max);
    }

    return params;
  }, [keyword, page, sortBy, priceRange]);

  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["search", keyword, page, sortBy, priceRange],
    queryFn: () => productService.searchProducts(filters),
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/search?keyword=${keyword}&page=${newPage}`);
  };

  // Empty keyword state
  if (!keyword.trim()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={SearchIcon}
          title="ابدأ البحث"
          description="أدخل كلمة مفتاحية للبحث عن المنتجات."
          action={
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">
                تصفح المنتجات
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-medium text-right mb-8">
          نتائج البحث عن: "{keyword}"
        </h1>
        <LoadingState type="skeleton" count={4} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-medium text-right mb-8">
          نتائج البحث عن: "{keyword}"
        </h1>
        <ErrorState
          title="فشل البحث"
          description="لم نتمكن من إكمال البحث. يرجى المحاولة مرة أخرى."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // No results
  if (!results || !results.products || results.products.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-medium text-right mb-8">
          نتائج البحث عن: "{keyword}"
        </h1>
        <EmptyState
          icon={SearchIcon}
          title="لا توجد نتائج"
          description={`لم نتمكن من العثور على أي منتجات تطابق "${keyword}". جرب كلمات مفتاحية مختلفة أو تصفح فئاتنا.`}
          action={
            <div className="flex gap-3">
              <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  تصفح جميع المنتجات
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline">عرض الفئات</Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const { products } = results;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium text-right mb-8">
        نتائج البحث عن: "{keyword}"
      </h1>

      <FilterBar
        count={products.meta.total}
        onSortChange={setSortBy}
        onPriceChange={setPriceRange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {products.data.map((product) => (
          <CategoryProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {products.meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange(products.meta.current_page - 1)}
            disabled={products.meta.current_page === 1}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            السابق
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
            disabled={products.meta.current_page === products.meta.last_page}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <LoadingState type="spinner" text="جاري البحث..." />
        </div>
      }
    >
      <SearchContent />
    </React.Suspense>
  );
}
