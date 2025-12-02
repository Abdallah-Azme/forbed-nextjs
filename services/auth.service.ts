import { apiClient } from "@/lib/api-client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SocialLoginRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
} from "@/types/api";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Login with phone/email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("auth", data.auth);
    if (data.phone_code) {
      formData.append("phone_code", data.phone_code);
    }
    formData.append("password", data.password);

    const response = await apiClient.postFormData<AuthResponse>(
      "/client/auth/login",
      formData
    );
    return response.data;
  },

  /**
   * Social login (Facebook, Google, Twitter, Apple)
   */
  async socialLogin(data: SocialLoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("social_provider_id", data.social_provider_id);
    formData.append("provider_type", data.provider_type);
    if (data.full_name) formData.append("full_name", data.full_name);
    if (data.phone) formData.append("phone", data.phone);
    if (data.email) formData.append("email", data.email);
    if (data.image) formData.append("image", data.image);

    const response = await apiClient.postFormData<AuthResponse>(
      "/client/auth/social",
      formData
    );
    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<any> {
    const formData = new FormData();

    formData.append("phone_code", data.phone_code);
    formData.append("phone", data.phone);

    formData.append("full_name", data.full_name);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    const response = await apiClient.postFormData<any>(
      "/client/auth/register",
      formData
    );

    return response;
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("auth", data.auth);
    formData.append("code", data.code);
    if (data.phone_code) formData.append("phone_code", data.phone_code);

    const response = await apiClient.postFormData<AuthResponse>(
      "/client/auth/verify",
      formData
    );
    return response.data;
  },

  /**
   * Resend OTP code
   */
  async resendOtp(auth: string, phoneCode?: string): Promise<any> {
    const formData = new FormData();
    formData.append("auth", auth);
    if (phoneCode) formData.append("phone_code", phoneCode);

    const response = await apiClient.postFormData<any>(
      "/client/auth/send",
      formData
    );
    return response;
  },

  /**
   * Logout user
   */
  async logout(
    deviceToken?: string,
    type?: string
  ): Promise<{ message: string }> {
    const formData = new FormData();
    if (deviceToken) formData.append("device_token", deviceToken);
    if (type) formData.append("type", type);

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/logout",
      formData
    );
    return response.data;
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(
    deviceToken: string,
    type: "android" | "ios",
    oldDeviceToken?: string
  ): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("device_token", deviceToken);
    formData.append("type", type);
    if (oldDeviceToken) formData.append("old_device_token", oldDeviceToken);

    const response = await apiClient.postFormData<AuthResponse>(
      "/client/account/refresh/token",
      formData
    );
    return response.data;
  },

  /**
   * Forget password - send OTP
   */
  async forgetPassword(
    auth: string,
    phoneCode?: string
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("auth", auth);
    if (phoneCode) formData.append("phone_code", phoneCode);

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/password/forget",
      formData
    );
    return response.data;
  },

  /**
   * Verify password reset OTP
   */
  async verifyPasswordReset(
    auth: string,
    code: string,
    phoneCode?: string
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("auth", auth);
    formData.append("code", code);
    if (phoneCode) formData.append("phone_code", phoneCode);

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/password/verify",
      formData
    );
    return response.data;
  },

  /**
   * Reset password
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("phone_code", data.phone_code);
    formData.append("auth", data.auth);
    formData.append("code", data.code);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/password/reset",
      formData
    );
    return response.data;
  },
};
