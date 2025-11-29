"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { orderService } from "@/services/order.service";
import type { CreateOrderRequest } from "@/types/api";

/**
 * Order Hooks
 * Custom hooks for order operations using React Query
 */

/**
 * Get user's order history
 */
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get single order details
 */
export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrder(orderId!),
    enabled: !!orderId,
  });
}

/**
 * Create new order (checkout)
 */
export function useCreateOrder() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: (data) => {
      // Clear cart and invalidate orders
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.success("Order placed successfully!");

      // Redirect to order confirmation page
      router.push(`/orders/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to place order");
    },
  });
}
