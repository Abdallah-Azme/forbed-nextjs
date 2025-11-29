import { apiClient } from "@/lib/api-client";
import type {
  User,
  UpdateAccountRequest,
  UpdatePasswordRequest,
  UpdateEmailRequest,
  UpdatePhoneRequest,
  NotificationSettingsRequest,
} from "@/types/api";

/**
 * Account Service
 * Handles all account management API calls
 */

export const accountService = {
  /**
   * Get user account data
   */
  async getAccount(): Promise<User> {
    const response = await apiClient.get<User>("/client/account");
    return response.data;
  },

  /**
   * Update account profile
   */
  async updateAccount(data: UpdateAccountRequest): Promise<User> {
    const formData = new FormData();

    if (data.email) formData.append("email", data.email);
    if (data.full_name) formData.append("full_name", data.full_name);
    if (data.d_o_b) formData.append("d_o_b", data.d_o_b);
    if (data.country_id) formData.append("country_id", data.country_id);
    if (data.gender) formData.append("gender", data.gender);

    // Handle image upload
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    // Laravel PUT method workaround
    formData.append("_method", "PUT");

    const response = await apiClient.postFormData<User>(
      "/client/account/update",
      formData
    );
    return response.data;
  },

  /**
   * Update password
   */
  async updatePassword(
    data: UpdatePasswordRequest
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("current_password", data.current_password);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);
    formData.append("_method", "PUT");

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/account/password/update",
      formData
    );
    return response.data;
  },

  /**
   * Update email
   */
  async updateEmail(data: UpdateEmailRequest): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("email", data.email);
    if (data.resend !== undefined) {
      formData.append("resend", data.resend ? "1" : "0");
    }
    formData.append("_method", "PUT");

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/account/email/update",
      formData
    );
    return response.data;
  },

  /**
   * Verify new email
   */
  async verifyNewEmail(code: string): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("_method", "PUT");

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/account/email/verify",
      formData
    );
    return response.data;
  },

  /**
   * Update phone
   */
  async updatePhone(data: UpdatePhoneRequest): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("phone_code", data.phone_code);
    formData.append("phone", data.phone);
    if (data.resend !== undefined) {
      formData.append("resend", data.resend ? "1" : "0");
    }
    formData.append("_method", "PUT");

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/account/phone/update",
      formData
    );
    return response.data;
  },

  /**
   * Verify new phone
   */
  async verifyNewPhone(code: string): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("_method", "PUT");

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/account/phone/verify",
      formData
    );
    return response.data;
  },

  /**
   * Delete account
   */
  async deleteAccount(): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      "/client/account"
    );
    return response.data;
  },

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    data: NotificationSettingsRequest
  ): Promise<{ message: string }> {
    const formData = new FormData();

    if (data.notify !== undefined) {
      formData.append("notify", data.notify ? "1" : "0");
    }
    if (data.times_notify !== undefined) {
      formData.append("times_notify", data.times_notify ? "1" : "0");
    }
    if (data.mail_notify !== undefined) {
      formData.append("mail_notify", data.mail_notify ? "1" : "0");
    }
    if (data.sms_notify !== undefined) {
      formData.append("sms_notify", data.sms_notify ? "1" : "0");
    }

    const response = await apiClient.postFormData<{ message: string }>(
      "/client/account/notifications",
      formData
    );
    return response.data;
  },

  /**
   * Switch theme
   */
  async switchTheme(themeId: string): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(
      `/client/account/switch/theme/${themeId}`
    );
    return response.data;
  },
};
