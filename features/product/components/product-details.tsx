"use client";

import { motion, Variants, easeInOut } from "framer-motion";
import ImageFallback from "@/components/image-fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import ShareProduct from "./share-product";
import { toast } from "sonner"; // Optional: for notifications
import { useCartStore } from "@/features/carts/stores/cart-store";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart, getItemById } = useCartStore();

  const product = {
    id: "product-1",
    name: "كوفرتة 3 قطع فريب مجوز قطن مخلوط",
    price: 1550,
    image: "/mrtba.webp",
  };

  const inCart = isInCart(product.id);
  const cartItem = getItemById(product.id);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Optional: Show success notification
    toast?.success?.(`تمت الإضافة إلى السلة (${quantity})`);
  };

  // ✨ Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeInOut,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: easeInOut,
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col lg:flex-row items-start gap-10 px-4 md:px-10 py-10 font-sans"
      dir="rtl"
    >
      {/* Product Info */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full lg:w-1/2 space-y-4"
      >
        <h2 className="text-sm text-gray-500">FORBED</h2>
        <h1 className="text-2xl md:text-3xl font-semibold leading-relaxed">
          {product.name}
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">
            LE {product.price.toFixed(2)} EGP
          </span>
          {inCart && (
            <span className="text-xs bg-green-500 text-white rounded-full px-3 py-1 flex items-center gap-1">
              <Check className="w-3 h-3" />
              في السلة ({cartItem?.quantity})
            </span>
          )}
        </div>

        {/* Quantity Selector */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <p className="text-sm text-gray-600">الكمية</p>
          <div className="flex items-center w-32 border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={decrease}
              className="rounded-none hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, val));
              }}
              className="text-center border-none focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={increase}
              className="rounded-none hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Add to Cart + Buy buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
          className="flex gap-2"
        >
          <Button
            onClick={handleAddToCart}
            className="w-full rounded-none max-w-[250px] bg-black text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "تحديث السلة" : "أضف إلى السلة"}
          </Button>
          <Button className="w-full rounded-none max-w-[250px] bg-orange-600 text-white hover:bg-orange-700">
            اشتري الآن
          </Button>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="pt-4 text-gray-700 text-sm leading-relaxed space-y-1"
        >
          <p>كوفرتة + 2 كيس خدادية</p>
          <p>الطول 240 سم</p>
          <p>العرض 240 سم</p>
          <p>خامات التصنيع: قطن / ستان</p>
        </motion.div>

        {/* Share */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.5 }}
        >
          <ShareProduct />
        </motion.div>
      </motion.div>

      {/* Image */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="show"
        className="w-full lg:w-1/2"
      >
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl">
          <ImageFallback
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
