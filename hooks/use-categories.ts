"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

/**
 * Category Hooks
 * Custom hooks for category operations using React Query
 */

/**
 * Get all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });
}

/**
 * Get single category
 */
export function useCategory(categoryId?: string) {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoryService.getCategory(categoryId!),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get header categories for navigation
 */
export function useHeaderCategories() {
  return useQuery({
    queryKey: ["categories", "header"],
    queryFn: () => categoryService.getHeaderCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutes - header rarely changes
  });
}
