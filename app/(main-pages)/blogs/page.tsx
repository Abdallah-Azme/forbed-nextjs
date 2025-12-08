"use client";

import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/content.service";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import ImageFallback from "@/components/image-fallback";
import { Blog } from "@/types/api";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 12;

export default function BlogsPage() {
  const t = useTranslations("Blogs");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => blogService.getBlogs(),
  });

  // Calculate pagination
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 text-lg">{t("subtitle")}</p>
        </div>

        {/* Blog Grid */}
        {currentBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t("noBlogs")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentBlogs.map((blog, index) => (
                <BlogCard key={index} blog={blog} index={index} t={t} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex justify-center items-center gap-2 mt-12"
                dir="ltr"
              >
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("previous")}
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-md transition-colors ${
                          currentPage === page
                            ? "bg-orange-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BlogCard({
  blog,
  index,
  t,
}: {
  blog: Blog;
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ type: "tween", duration: 0.2 }}
    >
      <Link
        href={blog.slug ? `/blogs/${blog.slug}` : "#"}
        className="group flex rounded-none border-none flex-col overflow-hidden h-full transition-all duration-300 bg-white pt-0 shadow-sm hover:shadow-md"
      >
        <div className="p-0 overflow-hidden">
          <div className="relative w-full aspect-4/3 lg:aspect-auto lg:h-[244px]">
            <ImageFallback
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg leading-snug  group-hover:underline transition-all duration-200 line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3  flex-1">
            {blog.text}
          </p>

          <div className="pt-4 mt-auto border-t flex items-center justify-between text-xs text-gray-500">
            <span className="text-orange-600 group-hover:text-orange-700 font-medium">
              {t("readMore")}
            </span>
            <span className="flex items-center gap-1">
              {blog.visitors} {t("views")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
