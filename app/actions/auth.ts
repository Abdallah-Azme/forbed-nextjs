"use server";

import { cookies } from "next/headers";

export async function createSession(token: string) {
  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
  });
}

export async function deleteSession() {
  (await cookies()).delete("auth_token");
}

export async function hasSession() {
  return (await cookies()).has("auth_token");
}
