"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Logo from "@/features/header/logo";
import { useRegister } from "@/hooks/use-auth";
import Link from "next/link";
import { PhoneInput } from "@/components/ui/phone-input";
import { Input } from "@/components/ui/input";

import { parsePhoneNumber } from "react-phone-number-input";

import { useRouter } from "next/navigation";

const signupSchema = z
  .object({
    full_name: z.string().min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل"),
    phone: z.string().min(6, "رقم الهاتف غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    password_confirmation: z
      .string()
      .min(6, "تأكيد كلمة المرور يجب أن يكون 6 أحرف على الأقل"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمة المرور غير متطابقة",
    path: ["password_confirmation"],
  });

export default function SignupForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    console.log({ values });
    let phone = values.phone;
    let phone_code = "";

    try {
      // Try to parse as phone number
      const phoneNumber = parsePhoneNumber(values.phone);
      if (phoneNumber) {
        phone = phoneNumber.nationalNumber;
        phone_code = phoneNumber.countryCallingCode;
      }
    } catch (error) {
      console.log("Invalid phone number format:", error);
    }

    register(
      {
        phone_code,
        phone,
        full_name: values.full_name,
        password: values.password,
        password_confirmation: values.password_confirmation,
      },
      {
        onSuccess: (data) => {
          if (data?.status === "fail" && data?.messages) {
            Object.keys(data.messages).forEach((key) => {
              form.setError(key as any, {
                type: "server",
                message: data.messages[key][0],
              });
            });
            return;
          }

          router.push(
            `/verify?phone=${phone}&code=${encodeURIComponent(phone_code)}`
          );
        },
        onError: (error: any) => {
          if (error?.response?.data?.messages) {
            const messages = error.response.data.messages;
            Object.keys(messages).forEach((key) => {
              form.setError(key as any, {
                type: "server",
                message: messages[key][0],
              });
            });
          }
        },
      }
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
        <div className="mx-auto w-fit">
          <Logo className="max-w-[300px]" />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="الاسم الكامل"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <div dir="ltr" className="">
                      <PhoneInput
                        defaultCountry="EG"
                        placeholder="10xxxxxxxx"
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
                    <Input
                      type="password"
                      placeholder="********"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Confirmation Field */}
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm text-gray-600 text-right">
              سيتم إرسال رمز التحقق (OTP) إلى رقم هاتفك
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 text-base bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "جاري الإرسال..." : "إنشاء حساب"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
