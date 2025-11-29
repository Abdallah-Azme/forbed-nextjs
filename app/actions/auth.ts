"use server";

import { cookies } from "next/headers";

export async function createSession(token: string) {
  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "lax",
  });
}

export async function deleteSession() {
  (await cookies()).delete("auth_token");
}
