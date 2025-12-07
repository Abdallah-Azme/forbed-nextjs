"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartService } from "@/services/cart.service";
import type { AddToCartRequest } from "@/types/api";

/**
 * Cart Hooks
 * Custom hooks for shopping cart operations using React Query
 */

/**
 * Get user's cart
 */
export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Add item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addToCart(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      toast.success("Added to cart!");
    },
    onError: (error: any) => {
      // toast.error(error.message || "Failed to add to cart");
    },
  });
}

/**
 * Apply coupon to cart
 */
export function useApplyCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coupon: string) => cartService.applyCoupon(coupon),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      toast.success("Coupon applied successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Invalid or expired coupon");
    },
  });
}
