import CategoriesCollection from "@/features/category/components/category-collection";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center gap-2">
      <CategoriesCollection title="مــراتــب" secondary />
      <CategoriesCollection title="إكسسوارات" secondary />
      <CategoriesCollection title="أثـــاث" secondary />
      <CategoriesCollection title="مفروشات" secondary />
    </main>
  );
}
