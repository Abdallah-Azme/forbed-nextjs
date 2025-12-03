"use client";

import OtpForm from "@/features/auth/components/otp-form";
import { Suspense } from "react";

export default function VerifyPage() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <OtpForm />
        </Suspense>
      </div>
    </div>
  );
}
