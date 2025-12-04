import { apiClient } from "@/lib/api-client";
import type { Blog, HomeData, FooterData } from "@/types/api";

/**
 * Blog Service
 * Handles all blog-related API calls
 */

export const blogService = {
  /**
   * Get all blog posts
   */
  async getBlogs(): Promise<Blog[]> {
    const response = await apiClient.get<Blog[]>("/client/blogs");
    return response.data;
  },

  /**
   * Get single blog post
   */
  async getBlog(blogId: string): Promise<Blog> {
    const response = await apiClient.get<Blog>(`/client/blogs/${blogId}`);
    return response.data;
  },
};

/**
 * Home Service
 * Handles home page and footer data
 */

export const homeService = {
  /**
   * Get home page data
   */
  async getHomeData(): Promise<HomeData> {
    const response = await apiClient.get<HomeData>("/client/home");
    return response.data;
  },

  /**
   * Get footer data
   */
  async getFooterData(): Promise<FooterData> {
    const response = await apiClient.get<FooterData>("/client/footer");
    return response.data;
  },

  /**
   * Get social media links
   */
  async getSocials(): Promise<
    { id: number; link: string; icon: string; title: string }[]
  > {
    const response = await apiClient.get<{
      data: { id: number; link: string; icon: string; title: string }[];
      message: string | null;
      status: string;
    }>("/general/pages/socials");
    console.log("Full API Response:", response);
    console.log("Response.data:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },
};

/**
 * Contact Service
 * Handles contact form submissions
 */

export const contactService = {
  /**
   * Submit contact form
   */
  async submitContactForm(data: {
    full_name: string;
    email: string;
    phone: string;
    content: string;
  }): Promise<any> {
    await apiClient.post("/general/pages/contact", data);
  },
};
