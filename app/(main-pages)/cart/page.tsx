"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/features/carts/stores/cart-store";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import ImageFallback from "@/components/image-fallback";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { cartService } from "@/services/cart.service";
import { toast } from "sonner";

const COUPON_STORAGE_KEY = "cart_coupon";

export default function CartPage() {
  const t = useTranslations("Cart");
  const tToast = useTranslations("Toast");
  const {
    items,
    getTotalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    updateQuantity,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const total = getTotalPrice();

  // Load coupon from local storage and apply it on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
    if (savedCoupon) {
      setCouponCode(savedCoupon);
      // Auto-apply the saved coupon
      applySavedCoupon(savedCoupon);
    }
  }, []);

  const applySavedCoupon = async (coupon: string) => {
    try {
      await cartService.applyCoupon(coupon);
      // Silently applied - no toast needed for auto-apply
    } catch {
      // If auto-apply fails, clear the saved coupon
      localStorage.removeItem(COUPON_STORAGE_KEY);
      setCouponCode("");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return;
    }

    setIsApplying(true);
    try {
      await cartService.applyCoupon(couponCode);
      // Save to local storage on successful application
      localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
      toast.success(tToast("couponApplied"));
    } catch {
      toast.error(tToast("couponInvalid"));
      // Clear from local storage if invalid
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } finally {
      setIsApplying(false);
    }
  };

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value) || 1;
    updateQuantity(id, quantity);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className=" mx-auto px-4  py-8  container">
        {/* Header */}
        <div className="flex justify-between items-center  mb-8 lg:mb-12">
          <Link
            href="/"
            className="text-sm underline hover:text-gray-600 transition-colors"
          >
            {t("continueShopping")}
          </Link>
          <h1 className="text-3xl lg:text-4xl text-[#121212]">
            {t("shoppingCart")}
          </h1>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <EmptyState
            icon={ShoppingCart}
            title={t("emptyCart")}
            description={t("cartEmptyDescription")}
            action={
              <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  {t("startShopping")}
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            {/* Table Header - Desktop Only */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-4 border-b text-sm text-gray-500 uppercase tracking-wider">
              <div className="col-span-8 text-start">{t("product")}</div>
              <div className="col-span-2 text-center">{t("quantity")}</div>
              <div className="col-span-2 text-end">{t("total")}</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y  border-b">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center"
                >
                  {/* Product Info - 8 columns */}
                  <div className="lg:col-span-8 flex gap-4 sm:gap-8">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32 shrink-0 overflow-hidden bg-gray-100">
                      <ImageFallback
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2 text-start">
                      <h3 className="font-medium text-base lg:text-lg">
                        {item.name}
                      </h3>
                      <p className="text-gray-600">
                        {item?.price?.toFixed(2)} ج.م
                      </p>

                      {/* Mobile Quantity Controls */}
                      <div className="lg:hidden flex items-center gap-3 mt-4">
                        <div className="flex items-center border overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => decreaseQuantity(item.id)}
                            className="h-10 w-10 rounded-none hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            className="w-16 text-center border-none focus-visible:ring-0 h-10"
                            min="1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => increaseQuantity(item.id)}
                            className="h-10 w-10 rounded-none hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Mobile Total */}
                      <div className="lg:hidden">
                        <p className="text-lg font-semibold mt-2">
                          {(item.price * item.quantity).toFixed(2)} ج.م
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Quantity Controls - 2 columns */}
                  <div className="hidden lg:flex lg:col-span-2 justify-center items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center border overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => decreaseQuantity(item.id)}
                        className="h-10 w-8 rounded-none hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="w-24 px-2 text-center border-none focus-visible:ring-0 h-10 text-black font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => increaseQuantity(item.id)}
                        className="h-10 w-8 rounded-none hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Desktop Total - 2 columns */}
                  <div className="hidden lg:block lg:col-span-2 text-end">
                    <p className="text-lg font-semibold">
                      {(item.price * item.quantity).toFixed(2)} ج.م
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Cart Summary */}
        {!!(items.length > 0) && (
          <div className="mt-8 lg:mt-12 flex w-fit  ">
            <div className="w-full lg:w-96 space-y-6">
              {/* Coupon Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#121212]">
                  {t("couponCode")}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t("couponPlaceholder")}
                    className="flex-1 h-12 rounded-none"
                    disabled={isApplying}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isApplying || !couponCode.trim()}
                    className="bg-black text-white rounded-none h-12 px-6 hover:bg-gray-800"
                  >
                    {isApplying ? t("applying") : t("applyCoupon")}
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between gap-2 items-center">
                <span>{t("estimatedTotal")}</span>
                <span>
                  {total.toFixed(2)} {t("currency")}
                </span>
              </div>

              {/* Info Text */}
              <p className="text-xs text-[#121212] text-start">
                {t("taxShippingNote")}
              </p>

              {/* Checkout Button */}
              <Link href="/checkout">
                <button className="w-full bg-black text-white rounded-none h-14 text-base font-semibold transition-transform duration-200 hover:-translate-y-1.5">
                  {t("checkout")}
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
