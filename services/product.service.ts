import { apiClient } from "@/lib/api-client";
import type {
  Product,
  PaginatedResponse,
  ProductFilters,
  ProductFilterOptions,
  ProductDetails,
  ProductListingResponse,
} from "@/types/api";

/**
 * Product Service
 * Handles all product-related API calls
 */

export const productService = {
  /**
   * Get paginated list of products with filters
   */
  /**
   * Get paginated list of products with filters
   */
  async getProducts(filters?: ProductFilters): Promise<ProductListingResponse> {
    const response = await apiClient.get<ProductListingResponse>(
      "/client/products",
      filters
    );
    return response.data;
  },

  /**
   * Search products
   */
  async searchProducts(
    filters?: ProductFilters
  ): Promise<ProductListingResponse> {
    const response = await apiClient.get<ProductListingResponse>(
      "/client/products",
      filters
    );
    return response.data;
  },

  /**
   * Get filter options for a category
   */
  async getProductFilters(
    categoryId: string,
    subCategoryId?: string,
    brandId?: string
  ): Promise<ProductFilterOptions> {
    const response = await apiClient.get<ProductFilterOptions>(
      "/client/products/filter",
      {
        category_id: categoryId,
        sub_category_id: subCategoryId,
        brand_id: brandId,
      }
    );
    return response.data;
  },

  /**
   * Get single product details
   */
  async getProduct(slug: string): Promise<ProductDetails> {
    const response = await apiClient.get<ProductDetails>(
      `/client/products/${slug}`
    );
    return response.data;
  },

  /**
   * Toggle product favorite status
   */
  async toggleFavorite(productId: string): Promise<{ is_favorite: boolean }> {
    const response = await apiClient.post<{ is_favorite: boolean }>(
      `/client/products/${productId}/favorites`
    );
    return response.data;
  },
};
