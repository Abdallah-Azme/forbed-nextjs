/**
 * Request Headers Utility
 * Manages client IP, X-Forwarded-For, and User-Agent headers
 */

const HEADER_KEYS = {
  REMOTE_ADDR: "x-client-ip",
  X_FORWARDED_FOR: "x-forwarded-for",
  USER_AGENT: "x-user-agent",
} as const;

/**
 * Get client IP address from stored headers
 */
export function getClientIP(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(HEADER_KEYS.REMOTE_ADDR);
}

/**
 * Get X-Forwarded-For header from stored headers
 */
export function getForwardedFor(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(HEADER_KEYS.X_FORWARDED_FOR);
}

/**
 * Get User-Agent from stored headers
 */
export function getUserAgent(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(HEADER_KEYS.USER_AGENT);
}

/**
 * Store headers in session storage
 * Called by middleware response headers
 */
export function storeRequestHeaders(headers: {
  clientIp?: string;
  forwardedFor?: string;
  userAgent?: string;
}): void {
  if (typeof window === "undefined") return;

  if (headers.clientIp) {
    sessionStorage.setItem(HEADER_KEYS.REMOTE_ADDR, headers.clientIp);
  }
  if (headers.forwardedFor) {
    sessionStorage.setItem(HEADER_KEYS.X_FORWARDED_FOR, headers.forwardedFor);
  }
  if (headers.userAgent) {
    sessionStorage.setItem(HEADER_KEYS.USER_AGENT, headers.userAgent);
  }
}

/**
 * Get all tracking headers as an object
 * Returns headers that should be sent with API requests
 */
export function getTrackingHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};

  // Get from session storage (client-side)
  if (typeof window !== "undefined") {
    const clientIp = getClientIP();
    const forwardedFor = getForwardedFor();
    const userAgent = getUserAgent();

    if (clientIp) {
      headers["REMOTE_ADDR"] = clientIp;
    }
    if (forwardedFor) {
      headers["X-Forwarded-For"] = forwardedFor;
    }
    if (userAgent) {
      headers["User-Agent"] = userAgent;
    }
  } else {
    // Server-side: get from navigator if available
    if (typeof navigator !== "undefined" && navigator.userAgent) {
      headers["User-Agent"] = navigator.userAgent;
    }
  }

  return headers;
}

/**
 * Initialize headers from response
 * Call this when the app loads to capture headers from middleware
 */
export function initializeHeadersFromResponse(): void {
  if (typeof window === "undefined") return;

  // Headers will be set by middleware in meta tags
  const clientIpMeta = document.querySelector('meta[name="x-client-ip"]');
  const forwardedForMeta = document.querySelector(
    'meta[name="x-forwarded-for"]'
  );
  const userAgentMeta = document.querySelector('meta[name="x-user-agent"]');

  storeRequestHeaders({
    clientIp: clientIpMeta?.getAttribute("content") || undefined,
    forwardedFor: forwardedForMeta?.getAttribute("content") || undefined,
    userAgent: userAgentMeta?.getAttribute("content") || undefined,
  });
}
