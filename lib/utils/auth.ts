import { AUTH_CONFIG } from "@/config/api.config";

/**
 * Token Management Utilities
 * Handles storage and retrieval of authentication tokens
 */

export const tokenManager = {
  /**
   * Get the authentication token
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_CONFIG.tokenKey);
  },

  /**
   * Set the authentication token
   */
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_CONFIG.tokenKey, token);
  },

  /**
   * Remove the authentication token
   */
  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
  },

  /**
   * Get the refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_CONFIG.refreshTokenKey);
  },

  /**
   * Set the refresh token
   */
  setRefreshToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_CONFIG.refreshTokenKey, token);
  },

  /**
   * Remove the refresh token
   */
  removeRefreshToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_CONFIG.refreshTokenKey);
  },

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.removeToken();
    this.removeRefreshToken();
  },
};

/**
 * User Data Management
 */

export const userManager = {
  /**
   * Get stored user data
   */
  getUser(): any | null {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem(AUTH_CONFIG.userKey);
    if (!userData || userData === "undefined") return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      // Clear invalid data
      localStorage.removeItem(AUTH_CONFIG.userKey);
      return null;
    }
  },

  /**
   * Set user data
   */
  setUser(user: any): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user));
  },

  /**
   * Remove user data
   */
  removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_CONFIG.userKey);
  },
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!tokenManager.getToken();
};
