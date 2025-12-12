import { apiClient } from "@/lib/api-client";
import type {
  Blog,
  HomeData,
  FooterData,
  PageDetails,
  PageDetailsResponse,
  PaymentMethodsResponse,
} from "@/types/api";

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

  /**
   * Get blogs for dropdown menu (limited to 10 items)
   */
  async getBlogsForDropdown(): Promise<Blog[]> {
    const response = await apiClient.get<Blog[]>("/client/blogs?per_page=10");
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
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get dynamic pages
   */
  async getPages(): Promise<{ key: string; text: string }[]> {
    const response = await apiClient.get<{
      data: { key: string; text: string }[];
      message: string | null;
      status: string;
    }>("/general/pages/pages");
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get dynamic page details
   */
  async getPageDetails(id: string): Promise<PageDetails | null> {
    const response = await apiClient.get<PageDetails[]>(
      `/general/pages/page/${id}`
    );

    // apiClient already unwraps the response
    // response.data is directly the array [{ id, title, content, image }]
    const pageData = response.data;
    return Array.isArray(pageData) && pageData.length > 0 ? pageData[0] : null;
  },

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    const response = await apiClient.get<PaymentMethodsResponse>(
      "/general/payment/methods"
    );
    return response as unknown as PaymentMethodsResponse;
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

  /**
   * Subscribe to newsletter
   */
  async subscribeToNewsletter(email: string): Promise<any> {
    await apiClient.post("/general/pages/newsletter", {
      email,
      front_link: window.location.origin,
    });
  },
};
