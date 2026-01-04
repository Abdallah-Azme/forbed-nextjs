"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-orange-100 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("title")}</h1>

        <p className="text-gray-600 mb-8">{t("description")}</p>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg  ">
            <p className="text-sm font-mono text-red-800 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("tryAgain")}
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="w-4 h-4 mr-2" />
            {t("goToHomepage")}
          </Button>
        </div>
      </div>
    </div>
  );
}
