import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  type?: "spinner" | "skeleton";
  count?: number;
  className?: string;
  text?: string;
}

export function LoadingState({
  type = "spinner",
  count = 3,
  className,
  text,
}: LoadingStateProps) {
  if (type === "spinner") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12",
          className
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        {text && <p className="mt-4 text-sm text-gray-500">{text}</p>}
      </div>
    );
  }

  // Skeleton loader
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse space-y-3 rounded-lg border bg-white p-6"
        >
          <div className="flex gap-4">
            <div className="h-20 w-20 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-1/4 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
