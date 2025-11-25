import ImageFallback from "@/components/image-fallback";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Logo({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Link href="/" className={cn("shrink-0")}>
      <ImageFallback
        src="/pages/home/forbed-logo.png"
        alt="Forbed"
        width={100}
        height={80}
        className={cn("w-full h-full object-contain", className)}
      />
    </Link>
  );
}
