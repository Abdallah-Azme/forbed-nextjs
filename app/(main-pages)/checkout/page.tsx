"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import Image from "next/image";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { useCartStore } from "@/features/carts/stores/cart-store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";
import { homeService } from "@/services/content.service";
import { orderService } from "@/services/order.service";
import { cartService } from "@/services/cart.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddAddressDialog from "@/features/profile/components/add-address-dialog";
import ImageFallback from "@/components/image-fallback";
import { useTranslations, useLocale } from "next-intl";
import type { PaymentMethod } from "@/types/api";

const COUPON_STORAGE_KEY = "cart_coupon";

export default function Page() {
  const t = useTranslations("Checkout");
  const tCart = useTranslations("Cart");
  const tHome = useTranslations("HomePage");
  const locale = useLocale();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [transactionScreenshot, setTransactionScreenshot] =
    useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [coupon, setCoupon] = useState<string>("");

  // Fetch Cart Data
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
  });

  // Fetch Addresses
  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAddresses(),
  });

  // Fetch Payment Methods from new API
  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } =
    useQuery({
      queryKey: ["payment-methods"],
      queryFn: () => homeService.getPaymentMethods(),
    });

  const paymentMethods = paymentMethodsData?.data || [];

  // Load coupon from local storage
  useEffect(() => {
    const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
    if (savedCoupon) {
      setCoupon(savedCoupon);
    }
  }, []);

  // Set default payment method (prioritize COD)
  useEffect(() => {
    if (paymentMethods.length && !selectedPaymentMethod) {
      // Find COD payment method, otherwise use first available
      const codMethod = paymentMethods.find((m) => m.key === "cod");
      setSelectedPaymentMethod(codMethod || paymentMethods[0]);
    }
  }, [paymentMethods, selectedPaymentMethod]);

  // Set default selected address
  useEffect(() => {
    if (addresses?.length) {
      // If we have addresses and none selected (or previously selected one is gone), select the first one
      if (
        !selectedAddressId ||
        !addresses.find((a) => a.id.toString() === selectedAddressId)
      ) {
        setSelectedAddressId(addresses[0].id.toString());
      }
    }
  }, [addresses, selectedAddressId]);

  // Create Order Mutation
  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      toast.success(t("success"));
      router.push(`/orders/${data.id}`); // Redirect to order details or success page
      clearCart();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("failed"));
      console.error("Order creation error:", error);
    },
  });

  // Get price data from cart API
  const subtotal = cartData?.price?.price || getTotalPrice();
  const vat = cartData?.price?.vat || 0;
  const discount = cartData?.price?.discount || 0;
  const shipping = cartData?.price?.shipping || 0;
  const total = cartData?.price?.total || subtotal + shipping;

  // Handle screenshot upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setTransactionScreenshot(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);
    }
  };

  // Remove screenshot
  const handleRemoveScreenshot = () => {
    setTransactionScreenshot(null);
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
      setScreenshotPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) {
      toast.error(t("selectAddress"));
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error(t("selectPayment"));
      return;
    }

    // Validate screenshot for non-COD payments
    if (selectedPaymentMethod.key !== "cod" && !transactionScreenshot) {
      toast.error(t("screenshotRequired"));
      return;
    }

    createOrderMutation.mutate({
      address_id: selectedAddressId,
      amount: total,
      payment_method_id: selectedPaymentMethod.id.toString(),
      coupon: coupon || undefined,
      transaction_screenshot: transactionScreenshot || undefined,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{tCart("emptyCart")}</h1>
        <Link href="/">
          <Button>{tCart("continueShopping")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              For<span className="text-orange-500">bed</span>
            </h1>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Right Column - Order Summary */}
          <div className="lg:border-s lg:ps-8 order-1 lg:order-2">
            <div className="sticky top-8 space-y-6">
              {/* Products */}
              <div className="space-y-4">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4"
                  >
                    {/* Left: Name + Price */}
                    <div className="flex-1 space-y-1 text-start">
                      <div className="text-sm font-semibold">
                        {(product.price * product.quantity).toFixed(2)}{" "}
                        {tHome("currency")}
                      </div>
                    </div>

                    {/* Right: Image + Qty */}
                    <div className="relative flex items-center gap-3 shrink-0">
                      <p className="text-sm font-medium line-clamp-2 text-start">
                        {product.name}
                      </p>
                      <div className="relative w-16 h-16 rounded-lg border-2 border-white bg-gray-100">
                        <ImageFallback
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {/* Qty badge */}
                        <span className="absolute -top-2 border-2 border-white -right-2 bg-black text-white text-xs rounded-md size-6 flex items-center justify-center">
                          {product.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span>
                    {subtotal.toFixed(2)} {tHome("currency")}
                  </span>
                  <span>{t("subtotal")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>
                    {vat.toFixed(2)} {tHome("currency")}
                  </span>
                  <span>{t("vat")}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>
                      -{discount.toFixed(2)} {tHome("currency")}
                    </span>
                    <span>{t("discount")}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>
                    {shipping.toFixed(2)} {tHome("currency")}
                  </span>
                  <span>{t("shipping")}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-4">
                <div className="text-start">
                  <span className="text-lg font-bold">
                    {total.toFixed(2)} {tHome("currency")}
                  </span>
                </div>
                <span className="text-lg font-bold">{t("total")}</span>
              </div>

              {/* Delivery Time */}
              {cartData?.delivery_time && (
                <div className="flex justify-between text-sm text-gray-600 pt-2">
                  <span>
                    {cartData.delivery_time} {t("days")}
                  </span>
                  <span>{t("estimatedDelivery")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Left Column - Form */}
          <div className="space-y-8 text-start order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {t("shippingAddress")}
                  </h2>
                </div>

                {isLoadingAddresses ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Select
                        value={selectedAddressId}
                        onValueChange={setSelectedAddressId}
                        disabled={!addresses || addresses.length === 0}
                      >
                        <SelectTrigger className="h-12 w-full text-start flex-row-reverse">
                          <SelectValue
                            placeholder={
                              addresses && addresses.length > 0
                                ? t("selectAddressPlaceholder")
                                : t("noAddresses")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {addresses?.map((addr) => (
                            <SelectItem
                              key={addr.id}
                              value={addr.id.toString()}
                              className="flex-row-reverse"
                            >
                              <div className="flex flex-col text-start">
                                <span className="font-medium">{addr.type}</span>
                                <span className="text-sm text-gray-500">
                                  {addr.address}, {addr.city}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 shrink-0 border-orange-200 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setIsAddAddressDialogOpen(true)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t("paymentMethod")}
                </h2>
                {isLoadingPaymentMethods ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedPaymentMethod?.id.toString() || ""}
                    onValueChange={(value) => {
                      const method = paymentMethods.find(
                        (m) => m.id.toString() === value
                      );
                      if (method) {
                        setSelectedPaymentMethod(method);
                        // Clear screenshot if switching to COD
                        if (method.key === "cod") {
                          handleRemoveScreenshot();
                        }
                      }
                    }}
                    className="grid gap-4"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPaymentMethod?.id === method.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-200"
                        }`}
                        onClick={() => {
                          setSelectedPaymentMethod(method);
                          // Clear screenshot if switching to COD
                          if (method.key === "cod") {
                            handleRemoveScreenshot();
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2 w-full justify-between">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value={method.id.toString()}
                              id={`pay-${method.id}`}
                            />
                            {method.image && (
                              <div className="relative w-8 h-8">
                                <ImageFallback
                                  src={method.image}
                                  alt={method.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                          </div>
                          <Label
                            htmlFor={`pay-${method.id}`}
                            className="flex-1 cursor-pointer text-start font-medium"
                          >
                            {locale === "ar" ? method.ar.name : method.en.name}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {/* Transaction Screenshot Upload - Only for non-COD payments */}
              {selectedPaymentMethod && selectedPaymentMethod.key !== "cod" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {t("transactionScreenshot")}
                  </h2>

                  {!screenshotPreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        id="screenshot-upload"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-12 h-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {t("uploadScreenshot")}
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, JPEG
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border rounded-lg p-4">
                      <div className="relative w-full h-64">
                        <Image
                          src={screenshotPreview}
                          alt="Transaction screenshot"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveScreenshot}
                        className="absolute top-2 right-2 bg-white"
                      >
                        <X className="w-4 h-4 mr-1" />
                        {t("changeScreenshot")}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-[#f7931d] hover:bg-[#f7931d] text-white rounded-lg h-12 text-base font-semibold"
              >
                {createOrderMutation.isPending ? (
                  <Loader2 className="animate-spin ml-2" />
                ) : null}
                {t("payNow")} ({total.toFixed(2)} {tHome("currency")})
              </Button>

              {/* Footer Links */}
              <div className="flex  gap-4 justify-end text-sm text-orange-500 border-t pt-5">
                <Link href="/pages/cancel_terms" className="hover:underline">
                  {t("refundPolicy")}
                </Link>
                <Link
                  href="/pages/service_condition"
                  className="hover:underline"
                >
                  {t("termsOfService")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AddAddressDialog
        open={isAddAddressDialogOpen}
        onOpenChange={setIsAddAddressDialogOpen}
      />
    </div>
  );
}
