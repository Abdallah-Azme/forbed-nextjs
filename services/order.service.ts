import { apiClient } from "@/lib/api-client";
import type {
  Order,
  CreateOrderRequest,
  PaginatedResponse,
  OrderListingResponse,
} from "@/types/api";

/**
 * Order Service
 * Handles all order-related API calls
 */

export const orderService = {
  /**
   * Get user's order history
   */
  async getOrders(): Promise<OrderListingResponse> {
    const response = await apiClient.get<any>("/client/orders");
    return response as unknown as OrderListingResponse;
  },

  /**
   * Get single order details
   */
  async getOrder(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/client/orders/${orderId}`);
    return response.data;
  },

  /**
   * Create new order (checkout)
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const formData = new FormData();
    formData.append("address_id", data.address_id);
    formData.append("amount", data.amount.toString());
    formData.append("payment_method_id", data.payment_method_id);

    if (data.coupon) {
      formData.append("coupon", data.coupon);
    }
    if (data.transaction_code) {
      formData.append("transaction_code", data.transaction_code);
    }
    if (data.transaction_screenshot) {
      formData.append("transaction_screenshot", data.transaction_screenshot);
    }

    const response = await apiClient.postFormData<Order>(
      "/client/orders/create",
      formData
    );
    return response.data;
  },
};
