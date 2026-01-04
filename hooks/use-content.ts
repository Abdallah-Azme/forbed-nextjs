"use client";

import { useQuery } from "@tanstack/react-query";
import { blogService, homeService } from "@/services/content.service";

/**
 * Blog Hooks
 * Custom hooks for blog operations using React Query
 */

/**
 * Get all blog posts
 */
export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: () => blogService.getBlogs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get single blog post
 */
export function useBlog(blogId?: string) {
  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => blogService.getBlog(blogId!),
    enabled: !!blogId,
  });
}

/**
 * Home Page Hooks
 * Custom hooks for home page data using React Query
 */

/**
 * Get home page data
 */
export function useHomeData() {
  return useQuery({
    queryKey: ["home"],
    queryFn: () => homeService.getHomeData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get footer data
 */
export function useFooterData() {
  return useQuery({
    queryKey: ["footer"],
    queryFn: () => homeService.getFooterData(),
    staleTime: 15 * 60 * 1000, // 15 minutes - footer rarely changes
  });
}
