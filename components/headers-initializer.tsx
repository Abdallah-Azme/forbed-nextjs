"use client";

import { useEffect } from "react";

/**
 * HeadersInitializer Component
 * Captures tracking headers from middleware response and stores them in sessionStorage
 */
export default function HeadersInitializer() {
  useEffect(() => {
    // Function to capture headers from the initial page load
    const captureHeaders = async () => {
      try {
        // Make a request to capture headers from middleware
        const response = await fetch(window.location.href, {
          method: "HEAD",
        });

        const clientIp = response.headers.get("x-client-ip");
        const forwardedFor = response.headers.get("x-forwarded-for");
        const userAgent = response.headers.get("x-user-agent");

        if (clientIp) {
          sessionStorage.setItem("x-client-ip", clientIp);
        }
        if (forwardedFor) {
          sessionStorage.setItem("x-forwarded-for", forwardedFor);
        }
        if (userAgent) {
          sessionStorage.setItem("x-user-agent", userAgent);
        }
      } catch (error) {
        console.error("Failed to capture tracking headers:", error);
      }
    };

    // Only capture if not already stored
    if (!sessionStorage.getItem("x-client-ip")) {
      captureHeaders();
    }
  }, []);

  return null;
}
