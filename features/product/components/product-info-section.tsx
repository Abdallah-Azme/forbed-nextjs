"use client";

import { motion, Variants, easeInOut } from "framer-motion";
import ImageFallback from "@/components/image-fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { ProductDetails } from "@/types/api";

interface ProductInfoSectionProps {
  product: ProductDetails;
  onAddToCart: (
    redirect: boolean,
    quantity: number,
    specification_id?: string
  ) => void;
  isAddingToCart: boolean;
}

export default function ProductInfoSection({
  product,
  onAddToCart,
  isAddingToCart,
}: ProductInfoSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = (redirect: boolean) => {
    onAddToCart(redirect, quantity, selectedSize || undefined);
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
    >
      {/* Image */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="show"
        className="w-full lg:w-1/2"
      >
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg bg-gray-100">
          <ImageFallback
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        {/* Thumbnails if needed */}
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200"
              >
                <ImageFallback
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Product Info */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full lg:w-1/2 space-y-6 flex flex-col items-start"
      >
        <div className="space-y-3 w-full text-start">
          <p className="text-xs text-gray-500 tracking-wider">فوربد</p>
          <h1 className="text-3xl md:text-4xl font-normal leading-relaxed">
            {product.name}
          </h1>
          <div className="flex items-center justify-start gap-3">
            <p className="text-xl font-bold text-gray-900">
              {product.price.price_after_discount.toLocaleString()} ج.م
            </p>
            {product.price.has_offer && (
              <p className="text-sm text-gray-500 line-through">
                {product.price.price_before_discount.toLocaleString()} ج.م
              </p>
            )}
          </div>
          {product.price.has_offer && (
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              وفر {product.price.discount.toLocaleString()} ج.م
            </span>
          )}
        </div>

        {/* Specifications / Size Selector (if applicable) */}
        {product.specifications && product.specifications.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="space-y-2 w-full"
          >
            <p className="text-sm text-gray-700 text-start">المواصفات</p>
            <div className="flex flex-col gap-2 items-start">
              {product.specifications.map((spec) => (
                <div key={spec.id} className="flex gap-2 text-sm">
                  <span className="text-gray-500">{spec.key}:</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quantity Selector */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.25 }}
          className="space-y-2 w-full flex flex-col items-start"
        >
          <p className="text-sm text-gray-700 text-start">الكمية</p>
          <div className="flex items-center w-40 h-12 border border-black rounded-none overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={decrease}
              className="h-full rounded-none hover:bg-gray-50 border-none"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, val));
              }}
              className="h-full text-center border-none focus-visible:ring-0 rounded-none"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={increase}
              className="h-full rounded-none hover:bg-gray-50 border-none"
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
          className="flex flex-col gap-3 w-full max-w-md"
        >
          <Button
            variant="outline"
            onClick={() => handleAddToCart(false)}
            className="w-full h-12 rounded-none border-gray-900 text-gray-900 hover:bg-gray-50 font-normal"
            disabled={
              (product.price.start_from && !selectedSize) || isAddingToCart
            }
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : null}
            أضف إلى السلة
          </Button>
          <Button
            onClick={() => handleAddToCart(true)}
            className="w-full h-12 rounded-none bg-black text-white hover:bg-gray-800 font-normal"
          >
            اشترِ الآن
          </Button>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="pt-4 text-gray-700 text-sm leading-loose space-y-1 w-full text-start"
        >
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
