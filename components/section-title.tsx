"use client";

import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  className?: string;
}

export default function SectionTitle({ title, className }: SectionTitleProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <h2
      className={cn(
        "text-3xl font-bold mb-6",
        isArabic ? "text-right" : "text-left",
        className
      )}
    >
      {title}
    </h2>
  );
}
