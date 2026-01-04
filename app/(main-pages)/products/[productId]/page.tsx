import ProductDetails from "@/features/product/components/product-details";

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const { productId } = await params;

  return (
    <main className="container px-4 mx-auto">
      <ProductDetails productId={productId} />
    </main>
  );
}
