"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, MapPin } from "lucide-react";
import { userManager } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddAddressDialog from "@/features/profile/components/add-address-dialog";
import { useQuery } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const userData = userManager.getUser();
    setUser(userData);
  }, []);

  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressService.getAddresses,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Profile</h1>

          {/* User Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative size-20 rounded-full overflow-hidden bg-gray-200">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.full_name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center size-full bg-gray-300 text-gray-600 text-2xl font-semibold">
                      {user.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {user.full_name || "User"}
                  </h2>
                  <p className="text-gray-600">
                    {user.email || user.phone_complete_form}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <button className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-sm">
                    <Pencil className="size-3" />
                  </button>
                </div>
                <p className="mt-1 text-gray-900">
                  {user.full_name || "Not set"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-gray-900">
                  {user.email || user.phone_complete_form}
                </p>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Addresses</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="size-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Address Cards */}
            {isLoadingAddresses ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading addresses...</p>
              </div>
            ) : addresses && addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address: any) => (
                  <div
                    key={address.id}
                    className="border rounded-lg p-4 hover:border-orange-500 transition-colors cursor-pointer group"
                    onClick={() => {
                      setSelectedAddress(address);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize bg-gray-100 px-2 py-1 rounded">
                          {address.type_trans || address.type}
                        </span>
                      </div>
                      <button
                        className="text-orange-600 hover:text-orange-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAddress(address);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {address.address}
                      </p>
                      <p>{address.city}</p>
                      <p className="flex items-center gap-1">
                        <span>+{address.phone_code}</span>
                        <span>{address.phone}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-3">
                  <MapPin className="size-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No addresses added</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Add Address Dialog */}
        <AddAddressDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />

        {/* Edit Address Dialog */}
        {selectedAddress && (
          <AddAddressDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            address={selectedAddress}
          />
        )}
      </div>
    </div>
  );
}
