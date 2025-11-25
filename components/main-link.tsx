import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function MainLink({
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
        "bg-black duration-500 w-fit text-white transition-transform   hover:-translate-y-1.5 inline-block",
        className
      )}
    >
      {children}
    </Link>
  );
}
