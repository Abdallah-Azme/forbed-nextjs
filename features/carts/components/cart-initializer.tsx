"use client";

import { useCartStore } from "@/features/carts/stores/cart-store";
import { useEffect } from "react";

/**
 * Cart Initializer Component
 * Initializes the cart store on app mount
 * Checks authentication and fetches server cart if authenticated
 */
export default function CartInitializer() {
  const initialize = useCartStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
