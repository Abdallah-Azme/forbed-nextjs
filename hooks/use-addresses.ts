"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addressService } from "@/services/address.service";
import type { CreateAddressRequest } from "@/types/api";

/**
 * Address Hooks
 * Custom hooks for address management using React Query
 */

/**
 * Get all user addresses
 */
export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAddresses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get single address
 */
export function useAddress(addressId?: string) {
  return useQuery({
    queryKey: ["address", addressId],
    queryFn: () => addressService.getAddress(addressId!),
    enabled: !!addressId,
  });
}

/**
 * Create new address
 */
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) =>
      addressService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add address");
    },
  });
}

/**
 * Update address
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: string;
      data: CreateAddressRequest;
    }) => addressService.updateAddress(addressId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({
        queryKey: ["address", variables.addressId],
      });
      toast.success("Address updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update address");
    },
  });
}

/**
 * Delete address
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => addressService.deleteAddress(addressId),
    onSuccess: (data, addressId) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.removeQueries({ queryKey: ["address", addressId] });
      toast.success(data.message || "Address deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete address");
    },
  });
}
