import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cartService } from "@/services/cart.service";
import { toast } from "sonner";
import Cookies from "js-cookie";

// Define the Cart Item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  addedAt: number;
}

// Define the store state type
interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => boolean;
  addToCart: (
    product: Omit<CartItem, "quantity" | "addedAt">,
    quantity?: number,
    specification_id?: string
  ) => Promise<void>;
  syncLocalCartToServer: () => Promise<void>;
  fetchServerCart: () => Promise<void>;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string, amount?: number) => void;
  decreaseQuantity: (id: string, amount?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemById: (id: string) => CartItem | undefined;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (id: string) => boolean;
  initialize: () => Promise<void>;
}

// Create the Zustand store with localStorage persistence
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isAuthenticated: false,

      // Check if user is authenticated
      checkAuth: () => {
        const token = Cookies.get("auth_token");
        const isAuth = !!token;
        set({ isAuthenticated: isAuth });
        return isAuth;
      },

      // Initialize store - check auth and fetch cart if authenticated
      initialize: async () => {
        const isAuth = get().checkAuth();
        if (isAuth) {
          await get().fetchServerCart();
        }
      },

      // Sync local cart to server
      syncLocalCartToServer: async () => {
        const { items, checkAuth } = get();
        if (!checkAuth() || items.length === 0) return;

        set({ isLoading: true });
        try {
          // Send each item to server
          for (const item of items) {
            await cartService.addToCart({
              product_id: item.id,
              quantity: item.quantity,
            });
          }

          // Clear local cart after successful sync
          set({ items: [] });

          // Fetch updated server cart
          await get().fetchServerCart();

          toast.success("Cart synced successfully");
        } catch (error) {
          console.error("Failed to sync cart:", error);
          toast.error("Failed to sync cart");
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch cart from server
      fetchServerCart: async () => {
        const { checkAuth } = get();
        if (!checkAuth()) return;

        set({ isLoading: true });
        try {
          const serverCart = await cartService.getCart();

          // Map server cart items to local cart format
          const mappedItems: CartItem[] = serverCart.items.map((item) => ({
            id: item.product_id.toString(),
            name: item.product.name,
            price: item.price,
            image: item.product.image,
            quantity: item.quantity,
            addedAt: Date.now(),
          }));

          set({ items: mappedItems });
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Add a product to cart
      addToCart: async (
        product: Omit<CartItem, "quantity" | "addedAt">,
        quantity: number = 1,
        specification_id?: string
      ) => {
        const { checkAuth } = get();
        const isAuth = checkAuth();

        set({ isLoading: true });
        try {
          // Optimistic update for both auth and non-auth users
          const existingItem = get().items.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            set((state) => ({
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }));
          } else {
            const newItem: CartItem = {
              ...product,
              quantity,
              addedAt: Date.now(),
            };
            set((state) => ({
              items: [...state.items, newItem],
            }));
          }

          // If authenticated, also send to server
          if (isAuth) {
            await cartService.addToCart({
              product_id: product.id,
              quantity,
              specification_id,
            });
          }
          // If not authenticated, item is already in local storage via optimistic update
        } catch (error) {
          console.error("Failed to add to cart:", error);
          toast.error("Failed to add to cart");
          // Revert optimistic update if needed (omitted for brevity)
        } finally {
          set({ isLoading: false });
        }
      },

      // Remove item from cart
      removeFromCart: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      // Increase item quantity
      increaseQuantity: (id: string, amount: number = 1) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + amount }
              : item
          ),
        }));
      },

      // Decrease item quantity (removes if quantity becomes 0)
      decreaseQuantity: (id: string, amount: number = 1) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - amount }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      // Update item quantity directly
      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          }));
        }
      },

      // Clear all items from cart
      clearCart: () => {
        set({ items: [] });
      },

      // Get a single item by id
      getItemById: (id: string) => {
        return get().items.find((item) => item.id === id);
      },

      // Get total number of items in cart
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price of all items
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Check if item is in cart
      isInCart: (id: string) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
