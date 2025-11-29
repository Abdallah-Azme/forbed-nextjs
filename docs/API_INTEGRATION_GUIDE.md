# API Integration - Quick Start Guide

## Overview

The API integration is now complete with a fully functional layered architecture. All Client endpoints from the Postman collection are implemented and ready to use.

## Project Structure

```
fourbed/
├── config/
│   └── api.config.ts          # API configuration
├── types/
│   └── api.ts                 # TypeScript types
├── lib/
│   ├── api-client.ts          # Base API client
│   └── utils/
│       └── auth.ts            # Token management
├── services/                  # Service layer (API calls)
│   ├── auth.service.ts
│   ├── account.service.ts
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   ├── address.service.ts
│   ├── category.service.ts
│   ├── content.service.ts
│   └── index.ts
├── hooks/                     # React Query hooks
│   ├── use-auth.ts
│   ├── use-account.ts
│   ├── use-products.ts
│   ├── use-cart.ts
│   ├── use-orders.ts
│   ├── use-addresses.ts
│   ├── use-categories.ts
│   ├── use-content.ts
│   └── index.ts
└── providers/
    └── query-provider.tsx     # React Query provider
```

## Usage Examples

### 1. Authentication

```tsx
"use client";

import { useLogin, useRegister } from "@/hooks";
import { useState } from "react";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const [credentials, setCredentials] = useState({
    auth: "",
    password: "",
    phone_code: "+20",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={credentials.auth}
        onChange={(e) =>
          setCredentials({ ...credentials, auth: e.target.value })
        }
        placeholder="Phone or Email"
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        placeholder="Password"
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### 2. Product Listing with Filters

```tsx
"use client";

import { useProducts, useProductFilters } from "@/hooks";
import { useState } from "react";

export function ProductList({ categoryId }: { categoryId: string }) {
  const [filters, setFilters] = useState({
    category_id: categoryId,
    price_min: 0,
    price_max: 1000,
  });

  const { data: products, isLoading } = useProducts(filters);
  const { data: filterOptions } = useProductFilters(categoryId);

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div>
      {/* Filter UI */}
      <div className="filters">
        <select
          onChange={(e) => setFilters({ ...filters, brand_id: e.target.value })}
        >
          <option value="">All Brands</option>
          {filterOptions?.brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-4">
        {products?.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### 3. Add to Cart

```tsx
"use client";

import { useAddToCart } from "@/hooks";

export function AddToCartButton({ productId }: { productId: string }) {
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = () => {
    addToCart({
      product_id: productId,
      quantity: 1,
    });
  };

  return (
    <button onClick={handleAddToCart} disabled={isPending}>
      {isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

### 4. Shopping Cart

```tsx
"use client";

import { useCart, useApplyCoupon } from "@/hooks";
import { useState } from "react";

export function CartPage() {
  const { data: cart, isLoading } = useCart();
  const { mutate: applyCoupon } = useApplyCoupon();
  const [couponCode, setCouponCode] = useState("");

  if (isLoading) return <div>Loading cart...</div>;

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cart?.items.map((item) => (
        <div key={item.id}>
          <h3>{item.product.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price}</p>
        </div>
      ))}

      <div>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Coupon code"
        />
        <button onClick={() => applyCoupon(couponCode)}>Apply Coupon</button>
      </div>

      <div>
        <p>Subtotal: ${cart?.subtotal}</p>
        <p>Discount: ${cart?.discount}</p>
        <p>Total: ${cart?.total}</p>
      </div>
    </div>
  );
}
```

### 5. Checkout

```tsx
"use client";

import { useCreateOrder, useAddresses } from "@/hooks";
import { useState } from "react";

export function CheckoutPage() {
  const { data: addresses } = useAddresses();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleCheckout = () => {
    createOrder({
      address_id: selectedAddress,
      amount: 100, // Get from cart
      payment_method_id: "1",
    });
  };

  return (
    <div>
      <h1>Checkout</h1>

      <select
        value={selectedAddress}
        onChange={(e) => setSelectedAddress(e.target.value)}
      >
        <option value="">Select delivery address</option>
        {addresses?.map((address) => (
          <option key={address.id} value={address.id}>
            {address.address}, {address.city}
          </option>
        ))}
      </select>

      <button onClick={handleCheckout} disabled={isPending}>
        {isPending ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
```

### 6. User Profile

```tsx
"use client";

import { useAccount, useUpdateAccount } from "@/hooks";
import { useState } from "react";

export function ProfilePage() {
  const { data: user, isLoading } = useAccount();
  const { mutate: updateAccount } = useUpdateAccount();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  if (isLoading) return <div>Loading profile...</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccount(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.full_name}
        onChange={(e) =>
          setFormData({ ...formData, full_name: e.target.value })
        }
        placeholder="Full Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <button type="submit">Update Profile</button>
    </form>
  );
}
```

### 7. Product Search with Debounce

```tsx
"use client";

import { useProductSearch } from "@/hooks";
import { useState, useEffect } from "react";

export function ProductSearch() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const { data: results, isLoading } = useProductSearch(
    { keyword: debouncedKeyword },
    debouncedKeyword.length > 2
  );

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
      />

      {isLoading && <div>Searching...</div>}

      {results?.suggestions.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 8. Favorite Toggle with Optimistic Update

```tsx
"use client";

import { useToggleFavorite } from "@/hooks";

export function FavoriteButton({
  productId,
  isFavorite,
}: {
  productId: string;
  isFavorite: boolean;
}) {
  const { mutate: toggleFavorite } = useToggleFavorite();

  return (
    <button onClick={() => toggleFavorite(productId)}>
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
}
```

## Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://riche-house.arabtecs.cloud/api
```

## Features

✅ **Complete API Integration** - All Client endpoints implemented
✅ **Type Safety** - Full TypeScript support
✅ **React Query** - Automatic caching, revalidation, and state management
✅ **Optimistic Updates** - Instant UI feedback
✅ **Error Handling** - Toast notifications for all operations
✅ **Token Management** - Automatic authentication
✅ **FormData Support** - File uploads and Laravel compatibility
✅ **Layered Architecture** - Clean separation of concerns

## Available Hooks

### Authentication

- `useLogin()` - Login with phone/email
- `useSocialLogin()` - Social authentication
- `useRegister()` - User registration
- `useVerifyOtp()` - OTP verification
- `useResendOtp()` - Resend OTP
- `useLogout()` - Logout user
- `useForgetPassword()` - Password reset flow
- `useResetPassword()` - Reset password

### Products

- `useProducts(filters)` - Get products with filters
- `useProductSearch(filters)` - Search products
- `useProductFilters(categoryId)` - Get filter options
- `useProduct(productId)` - Get single product
- `useToggleFavorite()` - Toggle favorite status

### Cart & Orders

- `useCart()` - Get shopping cart
- `useAddToCart()` - Add item to cart
- `useApplyCoupon()` - Apply coupon code
- `useOrders()` - Get order history
- `useOrder(orderId)` - Get single order
- `useCreateOrder()` - Checkout

### Account

- `useAccount()` - Get user profile
- `useUpdateAccount()` - Update profile
- `useUpdatePassword()` - Change password
- `useUpdateEmail()` - Update email
- `useUpdatePhone()` - Update phone
- `useDeleteAccount()` - Delete account
- `useNotificationSettings()` - Update notifications

### Addresses

- `useAddresses()` - Get all addresses
- `useAddress(addressId)` - Get single address
- `useCreateAddress()` - Add new address
- `useUpdateAddress()` - Update address
- `useDeleteAddress()` - Delete address

### Categories & Content

- `useCategories()` - Get all categories
- `useCategory(categoryId)` - Get single category
- `useHeaderCategories()` - Get navigation categories
- `useBlogs()` - Get blog posts
- `useBlog(blogId)` - Get single blog
- `useHomeData()` - Get home page data
- `useFooterData()` - Get footer data

## Next Steps

1. **Update existing components** to use the new hooks
2. **Remove old API calls** and replace with service layer
3. **Add loading states** using `isLoading` from hooks
4. **Handle errors** - errors are automatically shown via toast
5. **Test all flows** - authentication, cart, checkout, etc.

## Notes

- All mutations automatically show toast notifications
- Cart and orders invalidate related queries on success
- Favorites use optimistic updates for instant feedback
- All services handle FormData for Laravel compatibility
- Token is automatically injected in all authenticated requests
