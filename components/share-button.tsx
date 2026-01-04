"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton() {
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ الرابط بنجاح");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="gap-2 text-gray-500 hover:text-black"
    >
      <Share2 className="w-4 h-4" />
      Share
    </Button>
  );
}
