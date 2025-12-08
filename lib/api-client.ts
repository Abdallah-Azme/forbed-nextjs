import { API_CONFIG } from "@/config/api.config";
import { tokenManager } from "@/lib/utils/auth";
import type { ApiResponse, ApiError } from "@/types/api";

/**
 * API Client
 * Centralized HTTP client for all API requests
 */

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  /**
   * Get default headers for requests
   */
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      Accept: "application/json",
      "X-Front-URL":
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL ||
            "https://forbed-nextjs.vercel.app",
    };

    // Add language header
    if (typeof window !== "undefined") {
      const locale = localStorage.getItem("locale") || "ar";
      headers["Accept-Language"] = locale;
    }

    if (includeAuth) {
      const token = tokenManager.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Add tracking headers
    if (typeof window !== "undefined") {
      const clientIp = sessionStorage.getItem("x-client-ip");
      const forwardedFor = sessionStorage.getItem("x-forwarded-for");
      const userAgent = sessionStorage.getItem("x-user-agent");

      if (clientIp) {
        headers["REMOTE_ADDR"] = clientIp;
      }
      if (forwardedFor) {
        headers["X-Forwarded-For"] = forwardedFor;
      }
      if (userAgent) {
        headers["User-Agent"] = userAgent;
      }
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      if (response.status === 401) {
        await this.handle401Error();
      }

      if (isJson) {
        const error = await response.json();
        throw this.createError(error, response.status);
      }
      throw this.createError(
        { message: `HTTP Error: ${response.status}` },
        response.status
      );
    }

    if (isJson) {
      return await response.json();
    }

    return {
      success: true,
      message: "Success",
      data: null as T,
    };
  }

  /**
   * Handle 401 Unauthorized errors
   * Clears tokens, session, cart, and redirects to sign-in
   */
  private async handle401Error(): Promise<void> {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Clear local storage tokens
    tokenManager.clearTokens();

    // Clear user data
    const { userManager } = await import("@/lib/utils/auth");
    userManager.removeUser();

    // Clear cart from localStorage to prevent previous user's cart from showing
    localStorage.removeItem("cart-storage");

    // Clear session cookie (server action)
    const { deleteSession } = await import("@/app/actions/auth");

    await deleteSession();

    // Redirect to sign-in page
    // window.location.href = "/signin";
  }

  /**
   * Create standardized error object
   */
  private createError(error: any, status?: number): ApiError {
    return {
      message: error.message || "An error occurred",
      errors: error.errors,
      status: status || error.status,
    };
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, params);

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request with JSON body
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request with FormData (for file uploads and Laravel _method workaround)
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: formData,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Request without authentication
   */
  async publicRequest<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Front-URL":
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "https://forbed.com",
    };

    // Add language header
    if (typeof window !== "undefined") {
      const locale = localStorage.getItem("locale") || "ar";
      headers["Accept-Language"] = locale;
    }

    // Add tracking headers
    if (typeof window !== "undefined") {
      const clientIp = sessionStorage.getItem("x-client-ip");
      const forwardedFor = sessionStorage.getItem("x-forwarded-for");
      const userAgent = sessionStorage.getItem("x-user-agent");

      if (clientIp) {
        headers["REMOTE_ADDR"] = clientIp;
      }
      if (forwardedFor) {
        headers["X-Forwarded-For"] = forwardedFor;
      }
      if (userAgent) {
        headers["User-Agent"] = userAgent;
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
