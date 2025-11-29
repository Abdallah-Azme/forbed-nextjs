"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { accountService } from "@/services/account.service";
import type {
  UpdateAccountRequest,
  UpdatePasswordRequest,
  UpdateEmailRequest,
  UpdatePhoneRequest,
  NotificationSettingsRequest,
} from "@/types/api";

/**
 * Account Hooks
 * Custom hooks for account management using React Query
 */

/**
 * Get user account data
 */
export function useAccount() {
  return useQuery({
    queryKey: ["account"],
    queryFn: () => accountService.getAccount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Update account profile
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAccountRequest) =>
      accountService.updateAccount(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["account"], data);
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

/**
 * Update password
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) =>
      accountService.updatePassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Password updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update password");
    },
  });
}

/**
 * Update email
 */
export function useUpdateEmail() {
  return useMutation({
    mutationFn: (data: UpdateEmailRequest) => accountService.updateEmail(data),
    onSuccess: (data) => {
      toast.success(data.message || "Verification email sent!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update email");
    },
  });
}

/**
 * Verify new email
 */
export function useVerifyNewEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => accountService.verifyNewEmail(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success(data.message || "Email verified successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Email verification failed");
    },
  });
}

/**
 * Update phone
 */
export function useUpdatePhone() {
  return useMutation({
    mutationFn: (data: UpdatePhoneRequest) => accountService.updatePhone(data),
    onSuccess: (data) => {
      toast.success(data.message || "Verification code sent!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update phone");
    },
  });
}

/**
 * Verify new phone
 */
export function useVerifyNewPhone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => accountService.verifyNewPhone(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success(data.message || "Phone verified successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Phone verification failed");
    },
  });
}

/**
 * Delete account
 */
export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => accountService.deleteAccount(),
    onSuccess: (data) => {
      queryClient.clear();
      toast.success(data.message || "Account deleted successfully");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete account");
    },
  });
}

/**
 * Update notification settings
 */
export function useNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NotificationSettingsRequest) =>
      accountService.updateNotificationSettings(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success(data.message || "Settings updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update settings");
    },
  });
}

/**
 * Switch theme
 */
export function useSwitchTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (themeId: string) => accountService.switchTheme(themeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success(data.message || "Theme updated!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update theme");
    },
  });
}
