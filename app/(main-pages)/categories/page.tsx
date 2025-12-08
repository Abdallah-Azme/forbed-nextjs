import CategoriesCollection from "@/features/category/components/category-collection";
import { categoryService } from "@/services/category.service";
import { Category, HomeCategory } from "@/types/api";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const categories = await categoryService.getCategories();
  const t = await getTranslations("Categories");

  // Helper to map Category to HomeCategory (handling optional image)
  const mapToHomeCategory = (cats: Category[]): HomeCategory[] => {
    return cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image || "",
    }));
  };

  return (
    <main className="flex flex-col items-center justify-center gap-2 py-8">
      {/* Show ALL categories in one main collection */}
      {categories.length > 0 && (
        <CategoriesCollection
          title={t("title")}
          secondary
          categories={mapToHomeCategory(categories)}
        />
      )}

      {/* Then show subcategories for specific parents if they exist */}
      {categories.map((category) =>
        category.subcategories && category.subcategories.length > 0 ? (
          <CategoriesCollection
            key={category.id}
            title={category.name}
            secondary
            categories={mapToHomeCategory(category.subcategories)}
          />
        ) : null
      )}

      {/* Fallback if no categories found */}
      {categories.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          {t("noCategories")}
        </div>
      )}
    </main>
  );
}
