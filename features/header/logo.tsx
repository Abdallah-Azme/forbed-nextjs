import ImageFallback from "@/components/image-fallback";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Logo({
  className,
  width,
  height,
  logoUrl,
}: {
  className?: string;
  width?: number;
  height?: number;
  logoUrl?: string;
}) {
  const url = "/logo.png";
  return (
    <Link href="/" className={cn("shrink-0")}>
      <ImageFallback
        src={url || logoUrl || "/pages/home/forbed-logo.png"}
        alt="Rich House"
        width={100}
        height={80}
        className={cn("w-full h-full object-contain", className)}
      />
    </Link>
  );
}
