"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/features/carts/stores/cart-store";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    getTotalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    updateQuantity,
  } = useCartStore();

  const total = getTotalPrice();

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value) || 1;
    updateQuantity(id, quantity);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className=" mx-auto px-4  py-8  container">
        {/* Header */}
        <div className="flex justify-between items-center max-w-1/2 mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold">Your cart</h1>
          <Link
            href="/"
            className="text-sm underline hover:text-gray-600 transition-colors"
          >
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 flex-1">
            <p className="text-gray-500 mb-6 text-lg">Your cart is empty</p>
            <Link href="/">
              <Button className="bg-black hover:bg-gray-800 rounded-none px-8">
                Continue shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Table Header - Desktop Only */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-4 border-b text-sm text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center"
                >
                  {/* Product Info - 6 columns */}
                  <div className="lg:col-span-6 flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium text-base lg:text-lg">
                        {item.name}
                      </h3>
                      <p className="text-gray-600">
                        LE {item.price.toFixed(2)}
                      </p>

                      {/* Mobile Quantity Controls */}
                      <div className="lg:hidden flex items-center gap-3 mt-4">
                        <div className="flex items-center border rounded-md overflow-hidden">
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
                          LE {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Quantity Controls - 3 columns */}
                  <div className="hidden lg:flex lg:col-span-3 justify-center items-center gap-2">
                    <div className="flex items-center border rounded-md overflow-hidden">
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
                        className="w-20 text-center border-none focus-visible:ring-0 h-10"
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

                  {/* Desktop Total - 3 columns */}
                  <div className="hidden lg:block lg:col-span-3 text-right">
                    <p className="text-lg font-semibold">
                      LE {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Cart Summary */}
        <div className="mt-8 lg:mt-12 flex w-fit mx-auto">
          <div className="w-full lg:w-96 space-y-6">
            {/* Total */}
            <div className="flex justify-between items-center text-xl lg:text-2xl font-semibold pb-6 border-b">
              <span>Estimated total</span>
              <span>LE {total.toFixed(2)} EGP</span>
            </div>

            {/* Info Text */}
            <p className="text-sm text-gray-500 text-right">
              Taxes, discounts and shipping calculated at checkout
            </p>

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-none h-14 text-base font-semibold">
                Check out
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
