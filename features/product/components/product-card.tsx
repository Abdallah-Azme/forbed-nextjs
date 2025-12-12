import ImageFallback from "@/components/image-fallback";

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-4/5 overflow-hidden">
        <ImageFallback
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          fill
        />
        {product.soldOut && (
          <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded">
            Sold out
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm">{product.price}</p>
      </div>
    </div>
  );
}
