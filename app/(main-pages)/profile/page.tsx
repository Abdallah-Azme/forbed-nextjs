"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, MapPin, Trash2, Key } from "lucide-react";
import { userManager } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddAddressDialog from "@/features/profile/components/add-address-dialog";
import EditProfileDialog from "@/features/profile/components/edit-profile-dialog";
import ChangePasswordDialog from "@/features/profile/components/change-password-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";
import { accountService } from "@/services/account.service";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<any>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user-account"],
    queryFn: accountService.getAccount,
  });

  const {
    data: addresses,
    isLoading: isLoadingAddresses,
    error: addressesError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressService.getAddresses,
  });

  const { mutate: deleteAddress, isPending: isDeletingAddress } = useMutation({
    mutationFn: (addressId: string) => addressService.deleteAddress(addressId),
    onSuccess: () => {
      toast.success("تم حذف العنوان بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setAddressToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل حذف العنوان");
    },
  });

  const handleDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete.id);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <LoadingState type="spinner" text="جاري تحميل الملف الشخصي..." />
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <ErrorState
            title="فشل تحميل الملف الشخصي"
            description="لم نتمكن من تحميل معلومات ملفك الشخصي. يرجى المحاولة مرة أخرى."
            onRetry={() => refetchUser()}
          />
        </div>
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
          <h1 className="text-3xl font-bold mb-8">الملف الشخصي</h1>

          {/* User Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative size-20 rounded-full overflow-hidden bg-gray-200">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.full_name || "المستخدم"}
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
                    {user.full_name || "المستخدم"}
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
                    الاسم
                  </label>
                  <button
                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-sm"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <Pencil className="size-3" />
                  </button>
                </div>
                <p className="mt-1 text-gray-900">
                  {user.full_name || "غير محدد"}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </label>
                  <button
                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-sm"
                    onClick={() => setIsChangePasswordOpen(true)}
                  >
                    <Key className="size-3" />
                    <span>تغيير كلمة المرور</span>
                  </button>
                </div>
                <p className="mt-1 text-gray-900">
                  {user.email || user.phone_complete_form}
                </p>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">العناوين</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="size-4 ml-1" />
                إضافة
              </Button>
            </div>

            {/* Address Cards */}
            {isLoadingAddresses ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">جاري تحميل العناوين...</p>
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
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="text-orange-600 hover:text-orange-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAddress(address);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddressToDelete(address);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {address.address}
                      </p>
                      <p>{address.city}</p>
                      <p className="flex items-center gap-1">
                        <span dir="ltr">+{address.phone_code}</span>
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
                <p className="text-gray-500 text-sm">لم يتم إضافة عناوين</p>
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

        {/* Edit Profile Dialog */}
        {user && (
          <EditProfileDialog
            open={isEditProfileOpen}
            onOpenChange={setIsEditProfileOpen}
            user={user}
          />
        )}

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!addressToDelete}
          onOpenChange={(open) => !open && setAddressToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>حذف العنوان</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد أنك تريد حذف هذا العنوان؟ لا يمكن التراجع عن هذا
                الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingAddress}>
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAddress}
                disabled={isDeletingAddress}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeletingAddress ? "جاري الحذف..." : "حذف"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
