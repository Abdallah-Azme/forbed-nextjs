"use client";

import { motion, Variants, easeInOut } from "framer-motion";
import ImageFallback from "@/components/image-fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { ProductDetails } from "@/types/api";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Product");
  const [quantity, setQuantity] = useState(1);
  // Initialize with the first specification ID if available
  const [selectedSpecId, setSelectedSpecId] = useState<string>(
    product.specifications && product.specifications.length > 0
      ? String(product.specifications[0].id)
      : ""
  );

  const increase = () => {
    if (product.stock > 0 && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = (redirect: boolean) => {
    onAddToCart(redirect, quantity, selectedSpecId || undefined);
  };

  // Find the selected specification object to get its price
  const selectedSpec = product.specifications?.find(
    (s) => String(s.id) === selectedSpecId
  );

  // Determine the price to display:
  // If a spec is selected and has a price, use it.
  // Otherwise fallback to the product's main price.
  const currentPrice =
    selectedSpec?.price || product.price.price_after_discount;

  // Check if product is out of stock
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  // For the "before discount" price, we might not have specific data per spec in the provided snippet,
  // so we'll stick to the main product's before-discount price if we are showing the main price,
  // OR if the spec price is different, we might just show the spec price.
  // However, usually specs override the main price.
  // Let's assume if a spec is selected, that's the final price.
  // If the product has an offer, we might want to show the original price too, but the spec object provided
  // only has "price": 15000. It doesn't seem to have a separate "before discount" price.
  // So if a spec is selected, we'll just show its price.

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
            className="object-contain"
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
                  className="object-contain"
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
          <p className="text-xs text-gray-500 tracking-wider">
            {t("brandName")}
          </p>
          <h1 className="text-3xl md:text-4xl font-normal leading-relaxed">
            {product.name}
          </h1>
          <div className="flex items-center justify-start gap-3">
            <p className="text-xl font-bold text-gray-900">
              {t("currency")} {currentPrice.toLocaleString()}
            </p>
            {/* Show old price only if no spec is selected (using main product offer) OR if we had spec-specific old price logic */}
            {!selectedSpec && product.price.has_offer && (
              <p className="text-sm text-gray-500 line-through">
                {t("currency")}{" "}
                {product.price.price_before_discount.toLocaleString()}
              </p>
            )}
          </div>
          {!selectedSpec && product.price.has_offer && (
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              {t("save")} {t("currency")}{" "}
              {product.price.discount.toLocaleString()}
            </span>
          )}
          {/* Stock availability message */}
          {isOutOfStock ? (
            <p className="text-sm text-red-600 font-medium">Out of Stock</p>
          ) : isLowStock ? (
            <p className="text-sm text-orange-600 font-medium">
              Only {product.stock} left in stock
            </p>
          ) : null}
        </div>

        {/* Specifications / Size Selector */}
        {product.specifications && product.specifications.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="space-y-3 w-full"
          >
            <p className="text-sm text-gray-700 text-start font-medium">
              {t("size")}
            </p>
            <div className="flex flex-wrap gap-3 items-start">
              {product.specifications.map((spec) => {
                const isSelected = String(spec.id) === selectedSpecId;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpecId(String(spec.id))}
                    className={`
                      px-4 py-2 text-sm border transition-all duration-200
                      ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-900"
                      }
                    `}
                  >
                    {spec.value}
                  </button>
                );
              })}
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
          <p className="text-sm text-gray-700 text-start">{t("quantity")}</p>
          <div className="flex items-center w-40 h-12 border border-black rounded-none overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={decrease}
              disabled={isOutOfStock}
              className="h-full rounded-none hover:bg-gray-50 border-none"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                const maxQty = Math.min(val, product.stock);
                setQuantity(Math.max(1, maxQty));
              }}
              disabled={isOutOfStock}
              className="h-full text-center border-none focus-visible:ring-0 rounded-none"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={increase}
              disabled={isOutOfStock || quantity >= product.stock}
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
              isOutOfStock ||
              (product.specifications &&
                product.specifications.length > 0 &&
                product.price.start_from &&
                !selectedSpecId) ||
              isAddingToCart
            }
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : null}
            {isOutOfStock ? "Out of Stock" : t("addToCart")}
          </Button>
          <Button
            onClick={() => handleAddToCart(true)}
            className="w-full h-12 rounded-none bg-black text-white hover:bg-gray-800 font-normal"
            disabled={
              isOutOfStock ||
              (product.specifications &&
                product.specifications.length > 0 &&
                product.price.start_from &&
                !selectedSpecId)
            }
          >
            {isOutOfStock ? "Out of Stock" : t("buyNow")}
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
