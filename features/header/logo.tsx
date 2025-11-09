import ImageFallback from "@/components/image-fallback";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="shrink-0">
      <ImageFallback
        src="/pages/home/forbed-logo.png"
        alt="Forbed"
        width={100}
        height={80}
        className="w-25 h-20 object-contain"
      />
    </Link>
  );
}
