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
import { useTranslations } from "next-intl";

export default function SignupForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const signupSchema = z
    .object({
      full_name: z.string().min(3, t("fullNameLength")),
      phone: z.string().min(6, t("invalidPhone")),
      password: z.string().min(6, t("passwordLength")),
      password_confirmation: z.string().min(6, t("confirmPasswordLength")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("passwordsMismatch"),
      path: ["password_confirmation"],
    });

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
    let phone = values.phone;
    let phone_code = "";

    try {
      // Try to parse as phone number
      const phoneNumber = parsePhoneNumber(values.phone);
      if (phoneNumber) {
        phone = phoneNumber.nationalNumber;
        phone_code = phoneNumber.countryCallingCode;
      }
    } catch (error) {}

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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          if (error?.response?.data?.messages) {
            const messages = error.response.data.messages;
            Object.keys(messages).forEach((key) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        className="w-full bg-white shadow-sm rounded-xl border px-10 py-12"
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
                  <FormLabel>{t("fullNameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fullNameLabel")}
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
                  <FormLabel>{t("phoneLabel")}</FormLabel>
                  <FormControl>
                    <div dir="ltr" className="">
                      <PhoneInput
                        defaultCountry="EG"
                        placeholder="10xxxxxxxx"
                        className="h-12"
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
                  <FormLabel>{t("passwordLabel")}</FormLabel>
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
                  <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
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

            <div className="text-sm text-gray-600">{t("otpNotice")}</div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 text-base bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? t("creatingAccount") : t("createAccount")}
            </Button>

            <div className="text-center text-sm text-gray-600">
              {t("hasAccount")}{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">
                {t("login")}
              </Link>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
