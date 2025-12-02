"use client";

import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/content.service";
import { Loader2, Calendar, Eye, User, ArrowRight } from "lucide-react";
import ImageFallback from "@/components/image-fallback";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => blogService.getBlog(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
        <Link
          href="/blogs"
          className="text-orange-600 hover:text-orange-700 hover:underline"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-gray-100">
        <ImageFallback
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base text-gray-200">
              {blog.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {blog.author && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{blog.author}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{blog.visitors} Views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/blogs"
              className="hover:text-orange-600 transition-colors"
            >
              Blogs
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">
              {blog.title}
            </span>
          </div>

          {/* Article Body */}
          <article className="prose prose-lg max-w-none prose-orange prose-img:rounded-xl prose-headings:text-gray-900 prose-p:text-gray-700">
            {/* 
                If the content is HTML, use dangerouslySetInnerHTML. 
                If it's plain text (based on the 'text' field in API), just render it.
                The API seems to return 'text' which might be the full content or excerpt.
                Checking types/api.ts, we have 'text' and optional 'content'.
                We'll prefer 'content' if available, otherwise 'text'.
            */}
            <div
              dangerouslySetInnerHTML={{
                __html: blog.content || blog.text || "",
              }}
            />
          </article>

          {/* Share / Tags / Navigation Footer could go here */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
