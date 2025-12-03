"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  CreditCard,
  Package,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <LoadingState type="spinner" text="جاري تحميل تفاصيل الطلب..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <ErrorState
            title="فشل تحميل الطلب"
            description="لم نتمكن من تحميل هذا الطلب. يرجى المحاولة مرة أخرى."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <EmptyState
            icon={Receipt}
            title="الطلب غير موجود"
            description="الطلب الذي تبحث عنه غير موجود أو تم حذفه."
            action={
              <Link href="/orders">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  عرض كل الطلبات
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              طلب رقم {order.order_number}
              <Badge
                variant="outline"
                className={`text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status_trans || order.status}
              </Badge>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              تم الطلب في{" "}
              {new Date(order.created_at).toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  عناصر الطلب ({order.items.length})
                </h2>
              </div>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0 border">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          {item.brand && (
                            <p className="text-sm text-gray-500">
                              الماركة: {item.brand.name}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold">
                          {item.price.toFixed(2)} ج.م
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          الكمية: {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          الإجمالي: {(item.price * item.quantity).toFixed(2)}{" "}
                          ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="font-semibold mb-4">ملخص الطلب</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{order.total.toFixed(2)} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span>{order.shipping_cost.toFixed(2)} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ضريبة القيمة المضافة</span>
                  <span>{order.vat.toFixed(2)} ج.م</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم</span>
                    <span>-{order.discount.toFixed(2)} ج.م</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>الإجمالي</span>
                  <span className="text-orange-600">
                    {order.grand_total.toFixed(2)} ج.م
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                عنوان الشحن
              </h2>
              {order.address ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {order.address.type === "home"
                      ? "المنزل"
                      : order.address.type === "work"
                      ? "العمل"
                      : "آخر"}
                  </p>
                  <p>{order.address.address}</p>
                  <p>{order.address.city}</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr">
                      +{order.address.phone_code} {order.address.phone}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">لا توجد معلومات عنوان</p>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" />
                طريقة الدفع
              </h2>
              <div className="text-sm text-gray-600">
                {order.payment_method ? (
                  <div className="flex items-center gap-2">
                    <span>{order.payment_method.name}</span>
                  </div>
                ) : (
                  <span>الدفع عند الاستلام</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
