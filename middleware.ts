import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Extract client IP address
  const clientIp =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  // Extract X-Forwarded-For
  const forwardedFor = request.headers.get("x-forwarded-for") || clientIp;

  // Extract User-Agent
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Auth routes that logged-in users shouldn't access
  const authRoutes = ["/signin", "/signup", "/verify", "/forget-password"];

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is authenticated and tries to access auth pages, redirect to home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Create response and add tracking headers
  const response = NextResponse.next();

  // Add headers to response so client can access them
  response.headers.set("x-client-ip", clientIp);
  response.headers.set("x-forwarded-for", forwardedFor);
  response.headers.set("x-user-agent", userAgent);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
