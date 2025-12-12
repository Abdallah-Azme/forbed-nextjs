"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_CONFIG } from "@/config/api.config";
import dynamic from "next/dynamic";

/**
 * React Query Provider
 * Wraps the application with TanStack Query for data fetching and caching
 */

// Dynamically import ReactQueryDevtools to avoid SSR issues and ensure proper context access
const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false }
);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_CONFIG.staleTime,
            gcTime: QUERY_CONFIG.cacheTime,
            refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
            retry: QUERY_CONFIG.retry,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  );
}
