"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function OrdersPage() {
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getOrders,
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 mr-1" />;
      case "processing":
        return <Loader2 className="w-4 h-4 mr-1" />;
      case "shipped":
        return <Truck className="w-4 h-4 mr-1" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <LoadingState type="skeleton" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <ErrorState
            title="Failed to load orders"
            description="We couldn't load your orders. Please try again."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!ordersData?.data || ordersData.data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Looks like you haven't placed any orders yet."
            action={
              <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Start Shopping
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {!ordersData?.data || ordersData.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border">
            <div className="bg-orange-50 p-4 rounded-full mb-4">
              <Package className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't placed any orders yet.
            </p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersData.data.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {order.order_number}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status_trans || order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {" • "}
                      {order.items?.length || order.item_count} items
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-orange-600">
                        E£
                        {order.grand_total?.toFixed(2) ||
                          order.total?.toFixed(2)}
                      </p>
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" className="group">
                        Details
                        <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
