import ProductOfCategory from "@/features/home/product-of-category";
import ProductDetails from "@/features/product/components/product-details";
import SimilarProducts from "@/features/product/components/similar-products";

export default function page() {
  return (
    <main className="container px-4 mx-auto">
      <ProductDetails />
      <ProductOfCategory
        main
        number={5}
        title="You may also like
"
      />
    </main>
  );
}
