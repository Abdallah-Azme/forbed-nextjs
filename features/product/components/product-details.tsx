"use client";

import { motion, Variants, easeInOut } from "framer-motion";
import ImageFallback from "@/components/image-fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const product = {
    id: "product-1",
    name: "كوفرتة مايكرو فايبر مجوز من فوربد",
    price: 1030.0,
    image: "/mrtba.webp",
  };

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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
      className="w-full flex flex-col lg:flex-row-reverse items-start gap-10 px-4 md:px-10 py-10 font-sans"
    >
      {/* Image */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="show"
        className="w-full lg:w-1/2"
      >
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
          <ImageFallback
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
      {/* Product Info */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full lg:w-1/2 space-y-6 flex flex-col items-end"
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-500 tracking-wider text-end">
            FORBED
          </p>
          <h1 className="text-3xl md:text-4xl font-normal leading-relaxed">
            {product.name}
          </h1>
          <p className="text-base font-normal text-end">
            LE {product.price.toFixed(2)} EGP
          </p>
        </div>

        {/* Size Selector */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <p className="text-sm text-gray-700 text-end">مقاس الطقم</p>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full min-w-[248px] max-w-md h-12! border-black rounded-none  ">
              <SelectValue placeholder="قياس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">مفرد</SelectItem>
              <SelectItem value="double">مزدوج</SelectItem>
              <SelectItem value="queen">كوين</SelectItem>
              <SelectItem value="king">كينج</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Quantity Selector */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <p className="text-sm text-gray-700 text-end  ">Quantity</p>
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
            className="w-full h-12 rounded-none border-gray-900 text-gray-900 hover:bg-gray-50 font-normal"
          >
            Add to cart
          </Button>
          <Button className="w-full h-12 rounded-none bg-black text-white hover:bg-gray-800 font-normal">
            Buy it now
          </Button>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="pt-4 text-gray-700 text-sm leading-loose space-y-1"
        >
          <p>طقم 3 قطع يتكون من كوفرتة مقاس 2 كبير مخدة + 2 كبير خدادية</p>
          <p>طقم 6 قطع يتكون من كوفرتة مقاس 2 كبير مخدة + 2 كبير خدادية</p>
          <p>
            طقم 7 قطع يتكون من كوفرتة + 2 مخدة + 2 كبير خدادية + 1 كبير خدادية
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
