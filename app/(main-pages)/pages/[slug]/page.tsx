import { homeService } from "@/services/content.service";
import ImageFallback from "@/components/image-fallback";
import ShareButton from "@/components/share-button";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page;
  try {
    page = await homeService.getPageDetails(slug);
  } catch (error) {
    // If API returns null or error, show empty state
    page = null;
  }
  // If no page data, show empty state
  if (!page) {
    return (
      <main className="container mx-auto px-4 py-20 max-w-4xl min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            لا يوجد محتوى لهذه الصفحة حالياً
          </h1>
          <p className="text-gray-500">
            المحتوى غير متوفر في الوقت الحالي. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl min-h-[60vh]">
      {/* Header Image */}
      {page.image && (
        <div className="relative w-full h-[250px] md:h-[400px] rounded-lg overflow-hidden mb-8 bg-gray-100">
          <ImageFallback
            src={page.image}
            alt={page.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Title & Meta */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {page.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <span className="uppercase tracking-wider">SEPTEMBER 14, 2024</span>
          <ShareButton />
        </div>
      </div>

      {/* Content */}
      <div
        className="prose max-w-none leading-loose text-gray-700 text-lg text-end"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  );
}
