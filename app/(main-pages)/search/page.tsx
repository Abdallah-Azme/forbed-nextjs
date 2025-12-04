"use client";

import React from "react";
import { FilterBar } from "@/features/category/components/filter-bar";
import { CategoryProductCard } from "@/features/category/components/category-product-card";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || "1";

  const [sortBy, setSortBy] = React.useState("best-selling");
  const [priceRange, setPriceRange] = React.useState("all");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

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

  const handleSearch = (searchKeyword: string) => {
    if (searchKeyword.trim()) {
      router.push(`/search?keyword=${searchKeyword}`);
      setIsSearchOpen(false);
    }
  };

  // Empty keyword state
  if (!keyword.trim()) {
    return (
      <>
        {/* Search Overlay */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isSearchOpen ? "auto" : 0,
            opacity: isSearchOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 overflow-hidden bg-white border-b shadow-lg"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:outline-none focus:border-gray-900 text-lg text-right"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const target = e.target as HTMLInputElement;
                      handleSearch(target.value);
                    }
                  }}
                />
                <button className="absolute left-4 top-1/2 -translate-y-1/2">
                  <SearchIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-700 hover:text-gray-900 p-2"
              >
                <X className="size-6" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={SearchIcon}
            title="ابدأ البحث"
            description="أدخل كلمة مفتاحية للبحث عن المنتجات."
            action={
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <SearchIcon className="w-5 h-5 ml-2" />
                  ابدأ البحث
                </Button>
                <Link href="/">
                  <Button variant="outline">تصفح المنتجات</Button>
                </Link>
              </div>
            }
          />
        </div>
      </>
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
    <>
      {/* Search Overlay */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isSearchOpen ? "auto" : 0,
          opacity: isSearchOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 overflow-hidden bg-white border-b shadow-lg"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ابحث..."
                defaultValue={keyword}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:outline-none focus:border-gray-900 text-lg text-right"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    handleSearch(target.value);
                  }
                }}
              />
              <button className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Header with Search Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-medium text-right">
            نتائج البحث عن: "{keyword}"
          </h1>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SearchIcon className="w-5 h-5" />
            <span>بحث جديد</span>
          </button>
        </div>

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
    </>
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
