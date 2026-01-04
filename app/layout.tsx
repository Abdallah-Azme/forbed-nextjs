import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Assistant } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import FloatingWhatsapp from "@/features/footer/components/floating-whatsapp";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import CartInitializer from "@/features/carts/components/cart-initializer";
import SessionSync from "@/features/auth/components/session-sync";
import HeadersInitializer from "@/components/headers-initializer";

const assistant = Assistant({
  subsets: ["latin"],
  display: "swap",
});

import { getTranslations, getMessages } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const l = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={l}
      dir={l === "ar" ? "rtl" : "ltr"}
      className="overflow-x-hidden"
    >
      <GoogleTagManager gtmId="GTM-KGJKV3JP" />
      <body className={`${assistant.className} antialiased overflow-x-hidden`}>
        <QueryProvider>
          <HeadersInitializer />
          <SessionSync />
          <CartInitializer />
          <NextIntlClientProvider messages={messages}>
            {children}
            <FloatingWhatsapp />
          </NextIntlClientProvider>
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
