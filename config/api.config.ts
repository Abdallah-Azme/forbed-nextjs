/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://riche-house.arabtecs.cloud/api",
  staging: "https://riche-house-laravel-main-gobnpz.laravel.cloud/api",
  production: "https://ez-booking.menem.aait-d.com/api",
  local: "http://127.0.0.1:8000/api",
  timeout: 30000, // 30 seconds
} as const;

export const AUTH_CONFIG = {
  tokenKey: "auth_token",
  refreshTokenKey: "refresh_token",
  userKey: "user_data",
} as const;

export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  retry: 1,
} as const;
