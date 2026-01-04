import { apiClient } from "@/lib/api-client";
import type { Cart, AddToCartRequest } from "@/types/api";

/**
 * Cart Service
 * Handles all shopping cart API calls
 */

export const cartService = {
  /**
   * Get user's cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>("/client/cart");
    return response.data;
  },

  /**
   * Add item to cart
   */
  async addToCart(data: AddToCartRequest): Promise<Cart> {
    const formData = new FormData();
    formData.append("product_id", data.product_id);
    formData.append("quantity", data.quantity.toString());
    if (data.specification_id) {
      formData.append("specification_id", data.specification_id);
    }

    const response = await apiClient.postFormData<Cart>(
      "/client/cart/cart/item",
      formData
    );
    return response.data;
  },

  /**
   * Apply coupon to cart
   */
  async applyCoupon(coupon: string): Promise<Cart> {
    const formData = new FormData();
    formData.append("coupon", coupon);

    const response = await apiClient.postFormData<Cart>(
      "/client/cart/apply/coupon",
      formData
    );
    return response.data;
  },
};
