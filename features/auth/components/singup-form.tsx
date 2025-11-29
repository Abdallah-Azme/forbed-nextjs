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

import { parsePhoneNumber } from "react-phone-number-input";

import { useRouter } from "next/navigation";

// API expects only phone_code and phone for registration
// OTP verification happens in the next step
const signupSchema = z.object({
  phone: z.string().min(6, "رقم الهاتف غير صالح"),
});

export default function SignupForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
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
      },
      {
        onSuccess: () => {
          // Redirect to verify page with phone and code
          // Note: We need to pass the full phone number (without code) and the code separately
          // or handle it however the verify page expects it
          router.push(
            `/verify?phone=${phone}&code=${encodeURIComponent(phone_code)}`
          );
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
