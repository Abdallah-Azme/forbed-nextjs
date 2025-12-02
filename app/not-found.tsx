import { Button } from "@/components/ui/button";
import { Home, Search, Package } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center">
            <span className="text-9xl font-bold text-orange-500">4</span>
            <div className="mx-4 bg-orange-100 p-6 rounded-full">
              <Package className="w-16 h-16 text-orange-500" />
            </div>
            <span className="text-9xl font-bold text-orange-500">4</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="w-4 h-4 mr-2" />
              Search Products
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t pt-8">
          <p className="text-sm text-gray-500 mb-4">
            You might be interested in:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/categories">
              <Button
                variant="link"
                className="text-orange-500 hover:text-orange-600"
              >
                Browse Categories
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                variant="link"
                className="text-orange-500 hover:text-orange-600"
              >
                View Cart
              </Button>
            </Link>
            <Link href="/orders">
              <Button
                variant="link"
                className="text-orange-500 hover:text-orange-600"
              >
                My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
