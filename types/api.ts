/**
 * API Response Types
 * Common response structures from the API
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * User & Authentication Types
 */

export interface User {
  id: number;
  full_name: string;
  country: string | null;
  phone_code: {
    id: number;
    name: string;
    flag: string;
    phone_code: string;
    short_name: string;
    phone_limit: number;
  };
  phone: string;
  phone_complete_form: string;
  email: string | null;
  image: string;
  locale: string;
  app_theme: boolean;
  is_active: number;
  user_type: string;
  d_o_b?: string;
  gender?: "male" | "female";
  country_id?: number;
  notify?: boolean;
  times_notify?: boolean;
  mail_notify?: boolean;
  sms_notify?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  auth: string; // phone or email
  phone_code?: string;
  password: string;
}

export interface RegisterRequest {
  phone_code: string;
  phone: string;
  full_name: string;
  password: string;
  password_confirmation: string;
}

export interface SocialLoginRequest {
  social_provider_id: string;
  provider_type: "facebook" | "google" | "twitter" | "apple";
  full_name?: string;
  phone?: string;
  email?: string;
  image?: string;
}

export interface VerifyOtpRequest {
  auth: string;
  code: string;
  phone_code?: string;
}

export interface ResetPasswordRequest {
  phone_code: string;
  auth: string;
  code: string;
  password: string;
  password_confirmation: string;
}

/**
 * Address Types
 */

export interface Address {
  id: number;
  user_id: number;
  lat: string;
  lng: string;
  address: string;
  city: string;
  type: "home" | "work" | "other";
  description: string;
  phone_code: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressRequest {
  lat: string;
  lng: string;
  address: string;
  city: string;
  type: "home" | "work" | "other";
  description: string;
  phone_code: string;
  phone: string;
}

/**
 * Product Types
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  image: string;
  images?: string[];
  category_id: number;
  category?: Category;
  brand_id?: number;
  brand?: Brand;
  is_favorite: boolean;
  is_new: boolean;
  status: number;
  stock: number;
  specifications?: ProductSpecification[];
  created_at: string;
  updated_at: string;
}

export interface ProductDetails {
  id: number;
  slug: string;
  images: string[];
  name: string;
  price: ProductPrice;
  description: string;
  specifications: ProductSpecification[];
  related: HomeProduct[];
}

export interface ProductSpecification {
  id: number;
  key: string;
  value: string;
  price: number;
  images: string[];
}

export interface ProductFilters {
  category_id?: string;
  sub_category_id?: string;
  brand_id?: string;
  keyword?: string;
  order_by?: "asc" | "desc";
  order_by_new?: boolean;
  price_min?: number;
  price_max?: number;
  page?: number;
}

export interface ProductFilterOptions {
  sub_categories: Category[];
  brands: Brand[];
  price_range: {
    min: number;
    max: number;
  };
}

/**
 * Category & Brand Types
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  subcategories?: Category[];
  children?: Category[]; // Keeping for backward compatibility if needed, but API uses subcategories
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListingResponse {
  category: Category | null;
  products_count: number;
  products: {
    data: HomeProduct[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number | null;
      last_page: number;
      links: {
        url: string | null;
        label: string;
        active: boolean;
      }[];
      path: string;
      per_page: number;
      to: number | null;
      total: number;
    };
  };
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

/**
 * Cart Types
 */

export interface Cart {
  id: number;
  user_id: number;
  item: {
    items: CartItem[];
  };
  subtotal: number;
  discount: number;
  total: number;
  coupon?: Coupon;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart_id?: number;
  product_id?: number;
  product: {
    id: number;
    slug: string;
    name: string;
    thumbnail: string;
    is_favourite: boolean;
    is_new: boolean;
    price: {
      start_from: boolean;
      has_offer: boolean;
      price_after_discount: number;
      price_before_discount: number;
      discount: number;
    };
    stock: number;
    is_cart: boolean;
    is_cart_quantity: number;
  };
  quantity: number;
  price?: number; // Some responses might still have it? Keeping optional just in case
  specification_id?: number;
  specification?: ProductSpecification;
  total?: number;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  specification_id?: string;
}

export interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_amount?: number;
  max_discount?: number;
  expires_at?: string;
}

/**
 * Order Types
 */

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  address_id: number;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment_method_id: number;
  payment_method?: PaymentMethod;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  transaction_code?: string;
  transaction_screenshot?: string;
  coupon?: Coupon;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  specification_id?: number;
  specification?: ProductSpecification;
  total: number;
}

export interface CreateOrderRequest {
  address_id: string;
  amount: number;
  payment_method_id: string;
  coupon?: string;
  transaction_code?: string;
  transaction_screenshot?: File;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: "cash" | "card" | "wallet";
  status: number;
}

/**
 * Blog Types
 */

export interface Blog {
  id?: number;
  title: string;
  slug: string | null;
  image: string;
  text: string;
  visitors: number;
  content?: string;
  excerpt?: string;
  author?: string;
  status?: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Home Page Types
 */

export interface ProductPrice {
  start_from: boolean;
  has_offer: boolean;
  price_after_discount: number;
  price_before_discount: number;
  discount: number;
}

export interface HomeProduct {
  id: number;
  slug: string;
  name: string;
  thumbnail: string;
  is_favourite: boolean;
  is_new: boolean;
  price: ProductPrice;
  stock: number;
  is_cart: boolean;
  is_cart_quantity: number;
}

export interface HomeCategory {
  id: number;
  slug: string;
  name: string;
  image: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface HomePaymentMethod {
  id: number;
  status: number;
  name: string;
  value: string | null;
  image: string;
}

export interface HomeBranch {
  id: number;
  map_link: string;
  lat: string;
  lng: string;
  icon: string;
  title: string;
  text: string;
}

export interface HomeData {
  sliders: Slider[];
  categories: HomeCategory[];
  services: Service[];
  new_products: HomeProduct[];
  random_products: HomeProduct[];
  featured_product: HomeProduct;
  blogs: Blog[];
  payment_methods: HomePaymentMethod[];
  branches: HomeBranch[];
}

export interface Slider {
  id: number;
  title: string;
  description?: string;
  image: string;
  link?: string;
}

export interface Banner {
  id: number;
  title: string;
  image: string;
  link?: string;
  position: string;
}

export interface FooterData {
  contact_info: {
    location: {
      lat: string;
      lng: string;
      address: string;
    };
    email: string;
    phone: string | null;
    whatsapp: string;
  };
  socials: {
    id: number;
    link: string;
    icon: string;
    title: string;
  }[];
}

/**
 * Account Update Types
 */

export interface UpdateAccountRequest {
  email?: string;
  full_name?: string;
  d_o_b?: string;
  image?: File | string;
  country_id?: string;
  gender?: "male" | "female";
}

export interface UpdatePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateEmailRequest {
  email: string;
  resend?: boolean;
}

export interface UpdatePhoneRequest {
  phone_code: string;
  phone: string;
  resend?: boolean;
}

export interface NotificationSettingsRequest {
  notify?: boolean;
  times_notify?: boolean;
  mail_notify?: boolean;
  sms_notify?: boolean;
}
