"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { contactService } from "@/services/content.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Loader2, ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const t = useTranslations("Toast");
  const tValidation = useTranslations("Validation");

  const formSchema = z.object({
    email: z.string().email({
      message: tValidation("emailInvalid"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => contactService.subscribeToNewsletter(email),
    onSuccess: () => {
      toast.success(t("subscribed"));
      form.reset();
    },
    onError: () => {
      toast.error(t("subscribeFailed"));
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values.email);
  }

  return (
    <div className="max-w-md w-full">
      <h3 className="text-white text-lg mb-3 text-end">
        اشترك في نشرتنا البريدية
      </h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-0 flex-row-reverse"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="البريد الإلكتروني"
                      dir="ltr"
                      className="bg-transparent border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white rounded-none h-12 ltr:pl-4 rtl:pr-4"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-1 text-end" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 px-4 rounded-none bg-white hover:bg-gray-200 text-black border border-white"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 rotate-180" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
