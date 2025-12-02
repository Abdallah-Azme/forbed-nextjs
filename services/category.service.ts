import { apiClient } from "@/lib/api-client";
import type { Category, CategoryDetails } from "@/types/api";

/**
 * Category Service
 * Handles all category-related API calls
 */

export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/client/categories");
    return response.data;
  },

  /**
   * Get single category
   */
  async getCategory(
    categoryId: string,
    page: number = 1
  ): Promise<CategoryDetails> {
    const response = await apiClient.get<CategoryDetails>(
      `/client/categories/${categoryId}?page=${page}`
    );
    return response.data;
  },

  /**
   * Get header categories (for navigation)
   */
  async getHeaderCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/client/header/category");
    return response.data;
  },
};
