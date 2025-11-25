import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function GhostLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-[#8b8b8b] underline text-sm hover:underline hover:decoration-black hover:decoration-2 transition-all duration-200",
        className
      )}
    >
      {children}
    </Link>
  );
}
