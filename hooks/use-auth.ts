"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { authService } from "@/services/auth.service";
import { tokenManager, userManager } from "@/lib/utils/auth";
import { createSession, deleteSession } from "@/app/actions/auth";
import type {
  LoginRequest,
  RegisterRequest,
  SocialLoginRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
} from "@/types/api";

/**
 * Authentication Hooks
 * Custom hooks for authentication operations using React Query
 */

/**
 * Login hook
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (data) => {
      // New API structure: data contains both user info and token at same level
      // Store token and user data
      tokenManager.setToken(data.token);
      userManager.setUser(data);

      // Store token in HTTP-only cookie
      await createSession(data.token);

      // Show success message
      toast.success(t("loginSuccess"));

      // Sync local cart to server
      const { useCartStore } = await import(
        "@/features/carts/stores/cart-store"
      );
      const { syncLocalCartToServer } = useCartStore.getState();
      await syncLocalCartToServer();

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["account"] });

      // Redirect to home or dashboard
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || t("loginFailed"));
    },
  });
}

/**
 * Social login hook
 */
export function useSocialLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: SocialLoginRequest) => authService.socialLogin(data),
    onSuccess: async (data) => {
      // Store token and user data
      tokenManager.setToken(data.token);
      userManager.setUser(data.user);

      // Store token in HTTP-only cookie
      await createSession(data.token);

      // Show success message
      toast.success(t("loginSuccess"));

      // Sync local cart to server
      const { useCartStore } = await import(
        "@/features/carts/stores/cart-store"
      );
      const { syncLocalCartToServer } = useCartStore.getState();
      await syncLocalCartToServer();

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["account"] });

      // Redirect to home
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || t("socialLoginFailed"));
    },
  });
}

/**
 * Register hook
 */
export function useRegister() {
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data: any) => {
      // The API returns { data: null, message: "...", status: "success" }
      // So 'data' here is that full object.
      if (data.status === "success") {
        toast.success(data.message || t("registrationSuccessOtp"));
      } else {
        // Fallback if status is not success but no error was thrown
        toast.success(data.message || t("registrationSuccess"));
      }
    },
    onError: (error: any) => {
      toast.error(error.message || t("registrationFailed"));
    },
  });
}

/**
 * Verify OTP hook
 */
export function useVerifyOtp() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: async (data: any) => {
      // Store token in HTTP-only cookie
      await createSession(data.token);

      // Keep localStorage for client-side access
      tokenManager.setToken(data.token);
      userManager.setUser(data);

      toast.success(t("verificationSuccess"));

      // Sync local cart to server
      // Import dynamically to avoid circular dependencies
      const { useCartStore } = await import(
        "@/features/carts/stores/cart-store"
      );
      const { syncLocalCartToServer } = useCartStore.getState();
      await syncLocalCartToServer();

      queryClient.invalidateQueries({ queryKey: ["account"] });
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || t("verificationFailed"));
    },
  });
}

/**
 * Resend OTP hook
 */
export function useResendOtp() {
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (params: { auth: string; phone_code?: string }) =>
      authService.resendOtp(params.auth, params.phone_code),
    onSuccess: (data) => {
      toast.success(data.message || t("otpSent"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("otpSendFailed"));
    },
  });
}

/**
 * Logout hook
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (params?: { deviceToken?: string; type?: string }) =>
      authService.logout(params?.deviceToken, params?.type),
    onSuccess: async () => {
      // Clear session cookie
      await deleteSession();

      // Clear tokens and user data
      tokenManager.clearTokens();
      userManager.removeUser();

      // Clear all queries
      queryClient.clear();

      toast.success(t("logoutSuccess"));
      router.push("/signin");
    },
    onError: async (error: any) => {
      // Even if logout fails on server, clear local data
      await deleteSession();
      tokenManager.clearTokens();
      userManager.removeUser();
      queryClient.clear();

      toast.error(error.message || t("logoutFailed"));
      router.push("/signin");
    },
  });
}

/**
 * Forget password hook
 */
export function useForgetPassword() {
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (params: { auth: string; phoneCode?: string }) =>
      authService.forgetPassword(params.auth, params.phoneCode),
    onSuccess: (data) => {
      toast.success(data.message || t("otpSentPhone"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("otpSendFailed"));
    },
  });
}

/**
 * Verify password reset OTP hook
 */
export function useVerifyPasswordReset() {
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (params: { auth: string; code: string; phoneCode?: string }) =>
      authService.verifyPasswordReset(
        params.auth,
        params.code,
        params.phoneCode
      ),
    onSuccess: (data) => {
      toast.success(data.message || t("otpVerified"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("verificationFailed"));
    },
  });
}

/**
 * Reset password hook
 */
export function useResetPassword() {
  const router = useRouter();
  const t = useTranslations("Toast");

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || t("passwordResetSuccess"));
      router.push("/signin");
    },
    onError: (error: any) => {
      toast.error(error.message || t("passwordResetFailed"));
    },
  });
}
