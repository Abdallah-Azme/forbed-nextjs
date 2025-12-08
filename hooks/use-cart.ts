"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addToCart(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      toast.success(t("addedToCart"));
    },
    onError: (error: any) => {
      // toast.error(error.message || t("addToCartFailed"));
    },
  });
}

/**
 * Apply coupon to cart
 */
export function useApplyCoupon() {
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (coupon: string) => cartService.applyCoupon(coupon),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      toast.success(t("couponApplied"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("couponInvalid"));
    },
  });
}
