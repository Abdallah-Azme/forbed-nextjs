import Footer from "@/features/footer/components/footer";
import Header from "@/features/header/header";
import { settingsService } from "@/services/settings.service";
import type { Metadata } from "next";
import { Fragment } from "react/jsx-runtime";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await settingsService.getSettings();

    return {
      title: settings.site_info?.title || "Rich House",
      description:
        settings.site_info?.description ||
        "Rich House - Your trusted furniture store",
      keywords: settings.site_info?.keywords || "furniture, home, decor",
      icons: {
        icon: settings.fav || "/favicon.ico",
      },
    };
  } catch (error) {
    // Fallback metadata if settings fetch fails
    return {
      title: "Rich House",
      description: "Rich House - Your trusted furniture store",
      keywords: "furniture, home, decor",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
