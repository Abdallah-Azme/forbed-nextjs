"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingBag, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../stores/cart-store";
import ImageFallback from "@/components/image-fallback";

export default function CartIcon() {
  const {
    items,
    getTotalItems,
    getTotalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Link href={"/cart"} className="relative">
      <div className="text-[#848484] cursor-pointer hover:underline">
        <ShoppingBag className="size-6" />
      </div>
      <span className="absolute -bottom-1 -right-1 bg-[#151625] text-white text-xs rounded-full size-4 flex items-center justify-center font-semibold">
        {totalItems}
      </span>
    </Link>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <button className="text-[#848484] cursor-pointer hover:underline">
            <ShoppingBag className="size-6" />
          </button>
          <span className="absolute -bottom-1 -right-1 bg-[#151625] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {totalItems}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] max-h-[500px] p-0">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-lg">سلة التسوق</h3>
          <p className="text-sm text-gray-500">
            {totalItems} {totalItems === 1 ? "منتج" : "منتجات"}
          </p>
        </div>

        {/* Cart Items */}
        <div className="max-h-[300px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
              <ShoppingCart className="w-16 h-16 text-gray-300" />
              <p className="text-gray-500 text-sm">سلة التسوق فارغة</p>
              <Button
                className="rounded-none bg-orange-500 hover:bg-orange-600"
                size="sm"
              >
                تسوق الآن
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="relative w-16 h-16  shrink-0 rounded-md overflow-hidden bg-gray-100">
                      <ImageFallback
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm font-semibold text-orange-600">
                        LE {item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            decreaseQuantity(item.id);
                          }}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs font-medium min-w-[25px] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            increaseQuantity(item.id);
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove & Total */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="p-1 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="حذف"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <p className="text-sm font-semibold">
                        LE {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50 space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-semibold">الإجمالي:</span>
              <span className="text-lg font-bold text-orange-600">
                LE {totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link href="/cart" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-none"
                  size="sm"
                >
                  عرض السلة
                </Button>
              </Link>
              <Link href="/checkout" className="flex-1">
                <Button
                  className="w-full rounded-none bg-black hover:bg-gray-800"
                  size="sm"
                >
                  إتمام الطلب
                </Button>
              </Link>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
