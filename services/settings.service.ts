import { apiClient } from "@/lib/api-client";
import type { Settings, SettingsResponse } from "@/types/api";

/**
 * Settings Service
 * Handles general application settings API calls
 */

export const settingsService = {
  /**
   * Get general application settings
   * Transforms the flat array response into a structured object
   */
  async getSettings(): Promise<Settings> {
    const response = await apiClient.get<SettingsResponse>("/general/settings");

    // Transform the flat array into a structured object
    const settings: Record<string, unknown> = {};

    // The API returns { data: [...], message, status }
    // apiClient.get returns this directly, so response.data is the array
    const settingsArray = (response as unknown as SettingsResponse).data;

    if (Array.isArray(settingsArray)) {
      settingsArray.forEach((item) => {
        settings[item.key] = item.value;
      });
    }

    return settings as unknown as Settings;
  },
};
