import ImageFallback from "@/components/image-fallback";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("shrink-0", className)}>
      <ImageFallback
        src="/pages/home/forbed-logo.png"
        alt="Forbed"
        width={100}
        height={80}
        className="w-full h-full object-contain"
      />
    </Link>
  );
}
