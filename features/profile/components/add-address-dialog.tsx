"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { addressService } from "@/services/address.service";
import { toast } from "sonner";
import { parsePhoneNumber } from "react-phone-number-input";

const addressSchema = z.object({
  lat: z.string().min(1, "Latitude is required"),
  lng: z.string().min(1, "Longitude is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  type: z.string().min(1, "Address type is required"),
  description: z.string().min(1, "Description is required"),
  phone: z.string().min(1, "Phone is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: any; // Existing address for editing
}

export default function AddAddressDialog({
  open,
  onOpenChange,
  address,
}: AddAddressDialogProps) {
  const queryClient = useQueryClient();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      lat: address?.lat?.toString() || "",
      lng: address?.lng?.toString() || "",
      address: address?.address || "",
      city: address?.city || "",
      type: (address?.type as "home" | "work" | "other") || "home",
      description: address?.description || "",
      phone: address?.phone || "",
    },
  });

  const isEditMode = !!address?.id;

  const { mutate: createAddress, isPending: isCreating } = useMutation({
    mutationFn: addressService.createAddress,
    onSuccess: () => {
      toast.success("Address added successfully!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add address");
    },
  });

  const { mutate: updateAddress, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => addressService.updateAddress(address.id, data),
    onSuccess: () => {
      toast.success("Address updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update address");
    },
  });

  const isPending = isCreating || isUpdating;

  function onSubmit(values: AddressFormData) {
    let phone = values.phone;
    let phone_code = "";

    try {
      const phoneNumber = parsePhoneNumber(values.phone);
      if (phoneNumber) {
        phone = phoneNumber.nationalNumber;
        phone_code = phoneNumber.countryCallingCode;
      }
    } catch (error) {
      console.log("Phone parsing error:", error);
    }

    const payload = {
      lat: values.lat,
      lng: values.lng,
      address: values.address,
      city: values.city,
      type: values.type as "home" | "work" | "other",
      description: values.description,
      phone_code: phone_code || "20",
      phone: phone,
    };

    if (isEditMode) {
      updateAddress(payload);
    } else {
      createAddress(payload);
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("lat", position.coords.latitude.toString());
        form.setValue("lng", position.coords.longitude.toString());
        toast.success("Location captured!");
        setIsGettingLocation(false);
      },
      (error) => {
        toast.error("Failed to get location: " + error.message);
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{address ? "Edit address" : "Add address"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Location Coordinates */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Location</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation
                    ? "Getting location..."
                    : "Use my location"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Latitude" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Longitude" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details (e.g., apartment number, building name)"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <div className="" dir="ltr">
                    <FormControl>
                      <PhoneInput placeholder="Phone number" {...field} />
                    </FormControl>
                  </div>
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
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isPending}
              >
                {isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
