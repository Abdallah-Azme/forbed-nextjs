"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { productService } from "@/services/product.service";
import type { ProductFilters } from "@/types/api";

/**
 * Product Hooks
 * Custom hooks for product operations using React Query
 */

/**
 * Get products with filters
 */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Search products
 */
export function useProductSearch(filters?: ProductFilters, enabled = true) {
  return useQuery({
    queryKey: ["products", "search", filters],
    queryFn: () => productService.searchProducts(filters),
    enabled: enabled && !!filters?.keyword,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get product filter options
 */
export function useProductFilters(
  categoryId?: string,
  subCategoryId?: string,
  brandId?: string
) {
  return useQuery({
    queryKey: ["products", "filters", categoryId, subCategoryId, brandId],
    queryFn: () =>
      productService.getProductFilters(categoryId!, subCategoryId, brandId),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get single product
 */
export function useProduct(productId?: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProduct(productId!),
    enabled: !!productId,
  });
}

/**
 * Toggle product favorite
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (productId: string) => productService.toggleFavorite(productId),
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["product", productId] });

      // Snapshot previous value
      const previousProduct = queryClient.getQueryData(["product", productId]);

      // Optimistically update
      queryClient.setQueryData(["product", productId], (old: any) => ({
        ...old,
        is_favorite: !old?.is_favorite,
      }));

      return { previousProduct };
    },
    onError: (err, productId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["product", productId],
        context?.previousProduct
      );
      toast.error(t("favoriteFailed"));
    },
    onSuccess: (data, productId) => {
      toast.success(data.is_favorite ? t("favoriteAdded") : t("favoriteAdded"));
    },
    onSettled: (data, error, productId) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
