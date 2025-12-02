"use client";

import { useEffect } from "react";
import { tokenManager } from "@/lib/utils/auth";
import { deleteSession, hasSession } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

/**
 * SessionSync Component
 *
 * Handles the "zombie session" state where a user has an HTTP-only cookie
 * (preventing login page access via middleware) but no local storage token
 * (client thinks they are logged out).
 *
 * If this mismatch is detected, it clears the server session to allow re-login.
 */
export default function SessionSync() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // 1. Check if we have a local token
      const localToken = tokenManager.getToken();

      // 2. If NO local token, check if we have a server session
      if (!localToken) {
        const hasServerSession = await hasSession();

        // 3. Mismatch detected: Server thinks logged in, Client thinks logged out
        if (hasServerSession) {
          console.log("Zombie session detected - clearing server session...");
          await deleteSession();

          // 4. Refresh to clear middleware state and allow access to public pages
          router.refresh();
        }
      }
    };

    checkSession();
  }, [router]);

  return null;
}
