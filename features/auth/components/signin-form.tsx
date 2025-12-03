"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Logo from "@/features/header/logo";
import { useLogin } from "@/hooks/use-auth";
import { PhoneInput } from "@/components/ui/phone-input";

import { parsePhoneNumber } from "react-phone-number-input";

const formSchema = z.object({
  auth: z.string().min(1, "البريد الإلكتروني أو رقم الهاتف مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auth: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let auth = values.auth;
    let phone_code = "";

    try {
      // Try to parse as phone number
      const phoneNumber = parsePhoneNumber(values.auth);
      if (phoneNumber) {
        auth = phoneNumber.nationalNumber;
        phone_code = phoneNumber.countryCallingCode;
      }
    } catch (error) {
      // If parsing fails, it might be an email or invalid phone
      // We'll send it as is, and let the backend handle it
      console.log("Not a phone number or invalid format:", error);
    }

    login({
      auth: auth,
      password: values.password,
      phone_code: phone_code,
    });
  }

  return (
    <div className="flex items-center justify-center w-full h-full py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-white shadow-sm rounded-xl border px-10 py-12 text-right"
      >
        <div className="mx-auto w-fit">
          <Logo className="max-w-[300px]" />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email or Phone Field */}
            <FormField
              control={form.control}
              name="auth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <div className="" dir={"ltr"}>
                      <PhoneInput
                        placeholder="رقم الهاتف"
                        className="h-12 text-right"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="h-12 text-right ps-12"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Continue Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 text-base bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>

            <div className="text-center text-sm text-gray-600 ">
              ليس لديك حساب؟{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                سجل الآن
              </Link>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
