"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactService } from "@/services/content.service";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const contactSchema = z.object({
  full_name: z.string().min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(6, "رقم الهاتف غير صالح"),
  content: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      content: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: contactService.submitContactForm,
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("تم إرسال رسالتك بنجاح");
      form.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    },
    onError: (error: any) => {
      // Handle server-side validation errors
      if (error?.errors || error?.messages) {
        const messages = error.messages || error.errors;
        Object.keys(messages).forEach((key) => {
          form.setError(key as any, {
            type: "server",
            message: messages[key][0],
          });
        });
      } else {
        toast.error(error?.message || "حدث خطأ أثناء إرسال الرسالة");
      }
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    submitMutation.mutate({
      full_name: values.full_name,
      email: values.email,
      phone: values.phone?.replace(/^\+/, "") || values.phone,
      content: values.content,
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-8">
        contact
      </h1>

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-500 text-green-800 text-center"
        >
          تم إرسال رسالتك بنجاح! سنتواصل معك قريباً
        </motion.div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      className="h-14 border-black border-2 rounded-none bg-white text-left placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      className="h-14 border-black border-2 rounded-none bg-white text-left placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    placeholder="Phone number"
                    value={field.value}
                    onChange={field.onChange}
                    defaultCountry="PS"
                    international
                    className="h-14 border-black border-2 rounded-none bg-white text-left placeholder:text-gray-400 [&>input]:h-full [&>input]:border-0 [&>input]:outline-none [&>input]:bg-transparent [&>input]:px-3 [&>.PhoneInputCountry]:px-3 [&>.PhoneInputCountry]:border-r [&>.PhoneInputCountry]:border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content/Message Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Comment"
                    className="min-h-[150px] border-black border-2 rounded-none bg-white text-left placeholder:text-gray-400 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="h-14 px-12 bg-black hover:bg-gray-800 text-white rounded-none font-normal text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitMutation.isPending ? "Sending..." : "Send"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
