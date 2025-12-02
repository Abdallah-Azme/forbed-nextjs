"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { Info, Loader2, Plus } from "lucide-react";
import { useCartStore } from "@/features/carts/stores/cart-store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";
import { homeService } from "@/services/content.service";
import { orderService } from "@/services/order.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddAddressDialog from "@/features/profile/components/add-address-dialog";

export default function Page() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");

  // Fetch Addresses
  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAddresses(),
  });

  // Fetch Home Data for Payment Methods
  const { data: homeData, isLoading: isLoadingHomeData } = useQuery({
    queryKey: ["home-data"],
    queryFn: () => homeService.getHomeData(),
  });

  // Set default payment method
  useEffect(() => {
    if (homeData?.payment_methods?.length) {
      setPaymentMethodId(homeData.payment_methods[0].id.toString());
    }
  }, [homeData]);

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
      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/orders/${data.id}`); // Redirect to order details or success page
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place order");
      console.error("Order creation error:", error);
    },
  });

  const subtotal = getTotalPrice();
  const shipping = 70; // This should ideally come from API based on address
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    if (!paymentMethodId) {
      toast.error("Please select a payment method");
      return;
    }

    createOrderMutation.mutate({
      address_id: selectedAddressId,
      amount: total,
      payment_method_id: paymentMethodId,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/">
          <Button>Continue Shopping</Button>
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
          <div className="lg:border-l lg:pl-8 order-1 lg:order-2">
            <div className="sticky top-8 space-y-6">
              {/* Products */}
              <div className="space-y-4">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4"
                  >
                    {/* Left: Name + Price */}
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-semibold">
                        E£{(product.price * product.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Right: Image + Qty */}
                    <div className="relative flex items-center gap-3 shrink-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {product.name}
                      </p>
                      <div className="relative w-16 h-16 rounded-lg border-2 border-white bg-gray-100">
                        <Image
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
                  <span>E£{subtotal.toFixed(2)}</span>
                  <span>Subtotal</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>E£{shipping.toFixed(2)}</span>
                  <span>Shipping</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center  ">
                <div className="text-right">
                  <span className="text-sm text-gray-500 mr-1">EGP</span>
                  <span className="text-lg font-bold">
                    E£{total.toFixed(2)}
                  </span>
                </div>
                <span className="text-lg font-bold">Total</span>
              </div>
            </div>
          </div>

          {/* Left Column - Form */}
          <div className="space-y-8 text-end order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
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
                        <SelectTrigger className="h-12 w-full text-right flex-row-reverse">
                          <SelectValue
                            placeholder={
                              addresses && addresses.length > 0
                                ? "Select an address"
                                : "No addresses found"
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
                              <div className="flex flex-col text-right">
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
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                {isLoadingHomeData ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <RadioGroup
                    value={paymentMethodId}
                    onValueChange={setPaymentMethodId}
                    className="grid gap-4"
                  >
                    {homeData?.payment_methods.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethodId === method.id.toString()
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-200"
                        }`}
                        onClick={() => setPaymentMethodId(method.id.toString())}
                      >
                        <div className="flex items-center space-x-2 w-full justify-between">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value={method.id.toString()}
                              id={`pay-${method.id}`}
                            />
                            {method.image && (
                              <div className="relative w-8 h-8">
                                <Image
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
                            className="flex-1 cursor-pointer text-right font-medium"
                          >
                            {method.name}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-[#f7931d] hover:bg-[#f7931d] text-white rounded-lg h-12 text-base font-semibold"
              >
                {createOrderMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                Pay now (E£{total.toFixed(2)})
              </Button>

              {/* Footer Links */}
              <div className="flex  gap-4 justify-end text-sm text-orange-500 border-t pt-5">
                <Link href="/refund-policy" className="hover:underline">
                  Refund policy
                </Link>
                <Link href="/terms-of-service" className="hover:underline">
                  Terms of service
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
