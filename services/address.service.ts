import { apiClient } from "@/lib/api-client";
import type { Address, CreateAddressRequest } from "@/types/api";

/**
 * Address Service
 * Handles all address management API calls
 */

export const addressService = {
  /**
   * Get all user addresses
   */
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get<Address[]>("/client/addresses");
    return response.data;
  },

  /**
   * Get single address
   */
  async getAddress(addressId: string): Promise<Address> {
    const response = await apiClient.get<Address>(
      `/client/addresses/${addressId}`
    );
    return response.data;
  },

  /**
   * Create new address
   */
  async createAddress(data: CreateAddressRequest): Promise<Address> {
    const formData = new FormData();
    formData.append("lat", data.lat);
    formData.append("lng", data.lng);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("type", data.type);
    formData.append("description", data.description);
    formData.append("phone_code", data.phone_code);
    formData.append("phone", data.phone);

    const response = await apiClient.postFormData<Address>(
      "/client/addresses",
      formData
    );
    return response.data;
  },

  /**
   * Update address
   */
  async updateAddress(
    addressId: string,
    data: CreateAddressRequest
  ): Promise<Address> {
    const formData = new FormData();
    formData.append("lat", data.lat);
    formData.append("lng", data.lng);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("type", data.type);
    formData.append("description", data.description);
    formData.append("phone_code", data.phone_code);
    formData.append("phone", data.phone);
    formData.append("_method", "PUT");

    const response = await apiClient.postFormData<Address>(
      `/client/addresses/${addressId}`,
      formData
    );
    return response.data;
  },

  /**
   * Delete address
   */
  async deleteAddress(addressId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/client/addresses/${addressId}`
    );
    return response.data;
  },
};
