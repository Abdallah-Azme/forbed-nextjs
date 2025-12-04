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
    const settings: any = {};

    response.data.data.forEach((item) => {
      settings[item.key] = item.value;
    });

    return settings as Settings;
  },
};
