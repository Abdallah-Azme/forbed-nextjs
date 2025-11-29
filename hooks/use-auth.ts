"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Store token and user data
      tokenManager.setToken(data.token);
      userManager.setUser(data.user);

      // Show success message
      toast.success("Login successful!");

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["account"] });

      // Redirect to home or dashboard
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });
}

/**
 * Social login hook
 */
export function useSocialLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SocialLoginRequest) => authService.socialLogin(data),
    onSuccess: (data) => {
      tokenManager.setToken(data.token);
      userManager.setUser(data.user);
      toast.success("Login successful!");
      queryClient.invalidateQueries({ queryKey: ["account"] });
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Social login failed. Please try again.");
    },
  });
}

/**
 * Register hook
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data: any) => {
      // The API returns { data: null, message: "...", status: "success" }
      // So 'data' here is that full object.
      if (data.status === "success") {
        toast.success(
          data.message || "Registration successful! Please verify your OTP."
        );
      } else {
        // Fallback if status is not success but no error was thrown
        toast.success(data.message || "Registration successful!");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });
}

/**
 * Verify OTP hook
 */
export function useVerifyOtp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: async (data: any) => {
      // Store token in HTTP-only cookie
      // data is the AuthResponse object (which contains the token)
      await createSession(data.token);

      // Keep localStorage for client-side access (optional, but good for now)
      tokenManager.setToken(data.token);
      // The API returns the user data mixed with the token in the 'data' object
      // So 'data' here IS the user object (plus token)
      userManager.setUser(data);

      toast.success("Verification successful!");
      queryClient.invalidateQueries({ queryKey: ["account"] });
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Verification failed. Please try again.");
    },
  });
}

/**
 * Resend OTP hook
 */
export function useResendOtp() {
  return useMutation({
    mutationFn: (params: { auth: string; phone_code?: string }) =>
      authService.resendOtp(params.auth, params.phone_code),
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    },
  });
}

/**
 * Logout hook
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

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

      toast.success("Logged out successfully!");
      router.push("/sign-in");
    },
    onError: async (error: any) => {
      // Even if logout fails on server, clear local data
      await deleteSession();
      tokenManager.clearTokens();
      userManager.removeUser();
      queryClient.clear();

      toast.error(error.message || "Logout failed.");
      router.push("/sign-in");
    },
  });
}

/**
 * Forget password hook
 */
export function useForgetPassword() {
  return useMutation({
    mutationFn: (params: { auth: string; phoneCode?: string }) =>
      authService.forgetPassword(params.auth, params.phoneCode),
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent to your phone/email!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    },
  });
}

/**
 * Verify password reset OTP hook
 */
export function useVerifyPasswordReset() {
  return useMutation({
    mutationFn: (params: { auth: string; code: string; phoneCode?: string }) =>
      authService.verifyPasswordReset(
        params.auth,
        params.code,
        params.phoneCode
      ),
    onSuccess: (data) => {
      toast.success(data.message || "OTP verified successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Verification failed. Please try again.");
    },
  });
}

/**
 * Reset password hook
 */
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
      router.push("/sign-in");
    },
    onError: (error: any) => {
      toast.error(error.message || "Password reset failed. Please try again.");
    },
  });
}
