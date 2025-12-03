import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "حدث خطأ ما",
  description = "لم نتمكن من تحميل المحتوى. يرجى المحاولة مرة أخرى.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-red-100 p-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-orange-200 text-orange-500 hover:bg-orange-50"
        >
          <RefreshCw className="ml-2 h-4 w-4" />
          حاول مرة أخرى
        </Button>
      )}
    </div>
  );
}
