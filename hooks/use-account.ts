"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: UpdateAccountRequest) =>
      accountService.updateAccount(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["account"], data);
      toast.success(t("profileUpdated"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("profileUpdateFailed"));
    },
  });
}

/**
 * Update password
 */
export function useUpdatePassword() {
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) =>
      accountService.updatePassword(data),
    onSuccess: (data) => {
      toast.success(data.message || t("passwordUpdated"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("passwordUpdateFailed"));
    },
  });
}

/**
 * Update email
 */
export function useUpdateEmail() {
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: UpdateEmailRequest) => accountService.updateEmail(data),
    onSuccess: (data) => {
      toast.success(data.message || t("emailSent"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("emailUpdateFailed"));
    },
  });
}

/**
 * Verify new email
 */
export function useVerifyNewEmail() {
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (code: string) => accountService.verifyNewEmail(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success(data.message || t("emailVerified"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("emailVerificationFailed"));
    },
  });
}

/**
 * Update phone
 */
export function useUpdatePhone() {
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: UpdatePhoneRequest) => accountService.updatePhone(data),
    onSuccess: (data) => {
      toast.success(data.message || t("verificationCodeSent"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("phoneUpdateFailed"));
    },
  });
}

/**
 * Verify new phone
 */
export function useVerifyNewPhone() {
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (code: string) => accountService.verifyNewPhone(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success(data.message || t("phoneVerified"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("phoneVerificationFailed"));
    },
  });
}

/**
 * Delete account
 */
export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: () => accountService.deleteAccount(),
    onSuccess: (data) => {
      queryClient.clear();
      toast.success(data.message || t("accountDeleted"));
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || t("accountDeleteFailed"));
    },
  });
}

/**
 * Update notification settings
 */
export function useNotificationSettings() {
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: NotificationSettingsRequest) =>
      accountService.updateNotificationSettings(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success(data.message || t("settingsUpdated"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("settingsUpdateFailed"));
    },
  });
}

/**
 * Switch theme
 */
export function useSwitchTheme() {
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (themeId: string) => accountService.switchTheme(themeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success(data.message || t("themeUpdated"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("themeUpdateFailed"));
    },
  });
}
