import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ImageFallback from "@/components/image-fallback";

export const CategoryCard = ({
  collection,
  variants,
}: {
  collection: { title: string; image: string; href: string };
  variants?: any;
}) => (
  <motion.div
    variants={variants}
    whileHover={{
      y: -8,
    }}
    className="bg-white transition-all overflow-hidden h-full group"
  >
    <Link
      href={`/categories/${collection.href}`}
      className="flex flex-col h-full"
    >
      <div className="relative aspect-4/3 overflow-hidden shrink-0">
        <ImageFallback
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="bg-gray-100 text-end py-4 grow flex items-center justify-end px-3">
        <h3 className="text-base text-[#121212] flex justify-end items-center gap-2">
          <span className="text-gray-400 transition-transform duration-300 group-hover:scale-x-110">
            →
          </span>
          {collection.title}
        </h3>
      </div>
    </Link>
  </motion.div>
);
