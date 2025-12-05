"use client";

import ImageFallback from "@/components/image-fallback";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { accountService } from "@/services/account.service";
import { User } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .optional()
    .or(z.literal("")),
  d_o_b: z.string().optional(),
  gender: z.enum(["male", "female"]),
  country_id: z.string().optional(),
  image: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  user,
}: EditProfileDialogProps) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.image || null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    user.d_o_b ? new Date(user.d_o_b) : undefined
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.full_name || "",
      email: user.email || "",
      d_o_b: user.d_o_b || "",
      gender: user.gender || "male",
      country_id: user.country_id?.toString() || "",
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: accountService.updateAccount,
    onSuccess: () => {
      toast.success("تم تحديث الملف الشخصي بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["user-account"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "فشل تحديث الملف الشخصي";
      toast.error(errorMessage);

      // Handle field-specific errors
      if (error.errors) {
        Object.keys(error.errors).forEach((field) => {
          const messages = error.errors[field];
          if (messages && messages.length > 0) {
            form.setError(field as any, {
              type: "manual",
              message: messages[0],
            });
          }
        });
      }
    },
  });

  async function onSubmit(values: ProfileFormData) {
    const formData: any = {
      full_name: values.full_name,
      gender: values.gender,
    };

    if (values.email) {
      formData.email = values.email;
    }

    if (values.d_o_b) {
      formData.d_o_b = values.d_o_b;
    }

    if (values.country_id) {
      formData.country_id = values.country_id;
    }

    // Upload image first if a new one is selected
    if (selectedImageFile) {
      try {
        setIsUploadingImage(true);
        const uploadResult = await accountService.uploadAttachment(
          selectedImageFile
        );
        formData.image = uploadResult.path; // Use the path from upload response
        setIsUploadingImage(false);
      } catch (error: any) {
        setIsUploadingImage(false);
        toast.error(error.message || "فشل رفع الصورة");
        return;
      }
    }

    updateProfile(formData);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      form.setValue("d_o_b", formattedDate);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل الملف الشخصي</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative size-24 rounded-full overflow-hidden bg-gray-200">
                {imagePreview ? (
                  <ImageFallback
                    src={imagePreview}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center size-full bg-gray-300 text-gray-600 text-3xl font-semibold">
                    {user.full_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                          <Upload className="size-4" />
                          <span className="text-sm">تحميل صورة</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          {...field}
                        />
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Full Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسمك الكامل" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="d_o_b"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>تاريخ الميلاد</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full ps-3 text-start font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>اختر تاريخاً</span>
                          )}
                          <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النوع</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-row-reverse">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value="male"
                        className="flex-row-reverse justify-end"
                      >
                        ذكر
                      </SelectItem>
                      <SelectItem
                        value="female"
                        className="flex-row-reverse justify-end"
                      >
                        أنثى
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending || isUploadingImage}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isPending || isUploadingImage}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري رفع الصورة...
                  </>
                ) : isPending ? (
                  "جاري الحفظ..."
                ) : (
                  "حفظ التغييرات"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
