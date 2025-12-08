import ImageFallback from "@/components/image-fallback";
import Link from "next/link";
import { HomeProduct } from "@/types/api";

export function CategoryProductCard({ product }: { product: HomeProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-[#f3f3f3] cursor-pointer overflow-hidden group transition-transform duration-200 hover:-translate-y-1.5 block"
    >
      <div className="relative aspect-4/5 overflow-hidden">
        <ImageFallback
          src={product.thumbnail}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          fill
        />
        {product.price.has_offer && (
          <div className="absolute bottom-4 left-4 bg-[#f7931d] text-white px-4 py-1 text-xs rounded-full font-medium">
            Sale
          </div>
        )}
      </div>
      <div className="p-4 text-start" dir="ltr">
        <h3 className="font-medium text-sm mb-1 line-clamp-2  " dir="rtl">
          {product.name}
        </h3>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">
          Rich House
        </p>
        <div className="flex flex-col gap-1">
          {product.price.has_offer && (
            <span className="text-gray-400 text-xs line-through decoration-gray-400">
              LE {product.price.price_before_discount.toLocaleString()} EGP
            </span>
          )}
          <span className="text-[#121212] text-base">
            {product.price.start_from ? "From " : ""}LE{" "}
            {product.price.price_after_discount.toLocaleString()} EGP
          </span>
        </div>
      </div>
    </Link>
  );
}
