import React from "react";
import Image from "next/image";
import ImageFallback from "@/components/image-fallback";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative flex-1 2xl:flex-2">
        <ImageFallback
          src="/richhouse.webp"
          alt="Login background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}
