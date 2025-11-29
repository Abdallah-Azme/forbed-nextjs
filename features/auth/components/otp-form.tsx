"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Logo from "@/features/header/logo";
import { useVerifyOtp, useResendOtp } from "@/hooks/use-auth";

const otpSchema = z.object({
  code: z.string().min(4, "رمز التحقق يجب أن يكون 4 أرقام"),
});

export default function OtpForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const phoneCode = searchParams.get("code") || "20"; // Default or from params

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  function onSubmit(values: z.infer<typeof otpSchema>) {
    if (!phone) return;

    verifyOtp({
      auth: phone,
      code: values.code,
      phone_code: phoneCode,
    });
  }

  const handleResend = () => {
    if (!phone || countdown > 0) return;

    setCountdown(30); // Start 30s cooldown

    resendOtp({
      auth: phone,
      phone_code: phoneCode,
    });
  };

  if (!phone) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">
          رقم الهاتف غير موجود. يرجى إعادة التسجيل.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-white shadow-sm rounded-xl border px-10 py-12 text-right"
      >
        <div className="mx-auto w-fit mb-6">
          <Logo className="max-w-[200px]" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            تفعيل الحساب
          </h2>
          <p className="text-gray-600">
            تم إرسال رمز التحقق إلى الرقم{" "}
            <span dir="ltr">
              {phoneCode} {phone}
            </span>
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <FormLabel className="sr-only">رمز التحقق</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup className="gap-2" dir="ltr">
                        <InputOTPSlot
                          index={0}
                          className="h-12 w-12 text-lg border rounded-md"
                        />
                        <InputOTPSlot
                          index={1}
                          className="h-12 w-12 text-lg border rounded-md"
                        />
                        <InputOTPSlot
                          index={2}
                          className="h-12 w-12 text-lg border rounded-md"
                        />
                        <InputOTPSlot
                          index={3}
                          className="h-12 w-12 text-lg border rounded-md"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isVerifying}
              className="w-full h-12 text-base bg-gray-900 hover:bg-gray-800 text-white rounded-lg disabled:opacity-50"
            >
              {isVerifying ? "جاري التحقق..." : "تفعيل الحساب"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">لم يصلك الرمز؟ </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || countdown > 0}
                className="text-blue-600 hover:underline font-medium disabled:opacity-50 disabled:no-underline disabled:text-gray-400"
              >
                {isResending
                  ? "جاري الإرسال..."
                  : countdown > 0
                  ? `إعادة الإرسال خلال ${countdown} ثانية`
                  : "إعادة إرسال الرمز"}
              </button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
