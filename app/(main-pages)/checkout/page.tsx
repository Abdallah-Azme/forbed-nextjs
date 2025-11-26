"use client";

import { useState } from "react";
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
import { Info } from "lucide-react";
import { useCartStore } from "@/features/carts/stores/cart-store";

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];

export default function Page() {
  const { items, getTotalPrice } = useCartStore();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    governorate: "Dakahlia",
    postalCode: "",
    phone: "",
    saveInfo: false,
    newsletter: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingAddress, setBillingAddress] = useState("same");

  const subtotal = getTotalPrice();
  const shipping = 70;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic here
    console.log("Checkout data:", {
      ...formData,
      paymentMethod,
      billingAddress,
    });
  };

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
          <div className="lg:border-l lg:pl-8">
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
          <div className="space-y-8 text-end">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Contact</h2>
                  <Link
                    href="/login"
                    className="text-sm text-orange-500 hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email or mobile phone number"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 placeholder:text-end"
                  required
                />
              </div>

              {/* Delivery */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Delivery</h2>
                <div className="flex flex-col gap-4 text-end">
                  <Select
                    value={formData.governorate}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, governorate: value }))
                    }
                  >
                    <SelectTrigger className="h-12!">
                      <SelectValue placeholder="Country/Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Egypt">Egypt</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="h-12 placeholder:text-end"
                      required
                    />
                    <Input
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="h-12 placeholder:text-end"
                      required
                    />
                  </div>

                  <Input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-12 placeholder:text-end"
                    required
                  />

                  <Input
                    name="apartment"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="h-12 placeholder:text-end"
                  />

                  <div className="grid grid-cols-3 gap-4 ">
                    <Input
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="h-12 placeholder:text-end"
                      required
                    />
                    <Select
                      value={formData.governorate}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, governorate: value }))
                      }
                    >
                      <SelectTrigger className="h-12!">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GOVERNORATES.map((gov) => (
                          <SelectItem key={gov} value={gov}>
                            {gov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      name="postalCode"
                      placeholder="Postal code (optional)"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="h-12 placeholder:text-end"
                    />
                  </div>

                  <div className="relative">
                    <Input
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 placeholder:text-end"
                      required
                    />
                    <Info className="absolute start-3 -translate-y-1/2 top-1/2 w-4 h-4 text-gray-400" />
                  </div>

                  <div className="gap-2 flex flex-col self-end">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="saveInfo" className="text-sm">
                        Save this information for next time
                      </label>
                      <Checkbox
                        id="saveInfo"
                        checked={formData.saveInfo}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("saveInfo", checked as boolean)
                        }
                      />
                    </div>
                    <div className="flex items-center ms-auto space-x-2">
                      <label htmlFor="newsletter" className="text-sm">
                        Text me with news and offers
                      </label>
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("newsletter", checked as boolean)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping method</h2>
                <div className="border border-[#f7931d] bg-orange-50 rounded-lg p-4 flex justify-between items-center">
                  <span className="font-medium">Standard</span>
                  <span className="font-semibold">EE70.00</span>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Payment</h2>
                <p className="text-sm text-gray-500 mb-4">
                  All transactions are secure and encrypted.
                </p>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="border rounded-lg overflow-hidden">
                    <div className="border-b border-[#f7931d] bg-orange-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="cursor-pointer">
                            Pay with Card, Wallet and Installment via Kashier
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <img
                            src="/payment-1.svg"
                            alt="Visa"
                            className="h-5"
                          />
                          <img
                            src="/payment-2.svg"
                            alt="Mastercard"
                            className="h-5"
                          />
                          <img
                            src="/payment-3.svg"
                            alt="Mada"
                            className="h-5"
                          />
                          <img
                            src="/payment-4.svg"
                            alt="Mada"
                            className="h-5"
                          />
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="p-4 bg-gray-50">
                        <div className="flex justify-center mb-4">
                          <div className="w-32 h-20 border-2 border-gray-300 rounded flex items-center justify-center">
                            <div className="text-gray-400">💳</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          After clicking, you will be redirected to Pay with
                          Card, Wallet and Installment via Kashier to complete
                          your purchase securely.
                        </p>
                      </div>
                    )}

                    <div className="border-t p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="cursor-pointer">
                          Cash on Delivery (COD)
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Billing Address */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Billing address</h2>
                <RadioGroup
                  value={billingAddress}
                  onValueChange={setBillingAddress}
                >
                  <div className="border rounded-lg overflow-hidden">
                    <div className="border-b border-[#f7931d] bg-orange-50 p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="same" id="same" />
                        <Label htmlFor="same" className="cursor-pointer">
                          Same as shipping address
                        </Label>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="different" id="different" />
                        <Label htmlFor="different" className="cursor-pointer">
                          Use a different billing address
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#f7931d] hover:bg-[#f7931d] text-white rounded-lg h-12 text-base font-semibold"
              >
                Pay now
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
    </div>
  );
}
