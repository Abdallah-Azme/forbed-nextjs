import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cartService } from "@/services/cart.service";
import { toast } from "sonner";
import { tokenManager } from "@/lib/utils/auth";

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
        const token = tokenManager.getToken();
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
        set({ isLoading: false });
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
      fetchServerCart: async () => {
        const { checkAuth, items: localItems } = get();
        if (!checkAuth()) return;

        set({ isLoading: true });
        try {
          const serverCart = await cartService.getCart();

          // Map server cart items to local cart format
          // API returns items nested in 'item' object
          const cartItems = serverCart.item?.items || [];

          // SYNC LOGIC: If backend has no items but localStorage has items, sync local to backend
          if (cartItems.length === 0 && localItems.length > 0) {
            // Sync each local item to the backend
            for (const item of localItems) {
              try {
                await cartService.addToCart({
                  product_id: item.id,
                  quantity: item.quantity,
                });
              } catch (error) {
                console.error(
                  `Failed to sync item ${item.id} to backend:`,
                  error
                );
              }
            }

            // After syncing, fetch the updated cart from backend
            const updatedServerCart = await cartService.getCart();
            const updatedCartItems = updatedServerCart.item?.items || [];

            if (updatedCartItems.length > 0) {
              // Successfully synced, map the updated items
              const mappedItems: CartItem[] = updatedCartItems.map((item) => {
                let price = 0;
                if (typeof item.price === "number") {
                  price = item.price;
                } else if (item.product?.price) {
                  price =
                    item.product.price.price_after_discount ||
                    item.product.price.price_before_discount ||
                    0;
                }

                return {
                  id: item.product.id.toString(),
                  name: item.product.name,
                  price: Number(price) || 0,
                  image: item.product.thumbnail,
                  quantity: item.quantity,
                  addedAt: Date.now(),
                };
              });

              set({ items: mappedItems });
              toast.success("تم مزامنة السلة بنجاح");
            } else {
              // Sync failed or backend still empty, clear local storage

              set({ items: [] });
            }

            return;
          }

          // NORMAL FLOW: Backend has items, map them to local format
          if (cartItems.length > 0) {
            const mappedItems: CartItem[] = cartItems.map((item) => {
              // Helper to safely get price
              let price = 0;
              if (typeof item.price === "number") {
                price = item.price;
              } else if (item.product?.price) {
                price =
                  item.product.price.price_after_discount ||
                  item.product.price.price_before_discount ||
                  0;
              }

              return {
                id: item.product.id.toString(),
                name: item.product.name,
                price: Number(price) || 0, // Ensure it's always a number
                image: item.product.thumbnail, // API uses 'thumbnail', local store uses 'image'
                quantity: item.quantity,
                addedAt: Date.now(),
              };
            });

            set({ items: mappedItems });
          } else {
            // Backend is empty and local is also empty, just clear to be safe
            set({ items: [] });
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          toast.error("فشل في تحميل السلة");
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
          if (isAuth) {
            // AUTH FLOW: Call API directly, then refresh state
            await cartService.addToCart({
              product_id: product.id,
              quantity,
              specification_id,
            });
            await get().fetchServerCart();
          } else {
            // GUEST FLOW: Update local state
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
          }
        } catch (error) {
          console.error("Failed to add to cart:", error);
          toast.error("Failed to add to cart");
        } finally {
          set({ isLoading: false });
        }
      },

      // Remove item from cart
      removeFromCart: async (id: string) => {
        const { checkAuth } = get();
        const isAuth = checkAuth();

        if (isAuth) {
          // AUTH FLOW: Sync to backend by setting quantity to 0
          try {
            await cartService.addToCart({
              product_id: id,
              quantity: 0,
            });
            await get().fetchServerCart();
          } catch (error) {
            console.error("Failed to remove from cart:", error);
          }
        } else {
          // GUEST FLOW: Remove from local state
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));
        }
      },

      // Increase item quantity
      increaseQuantity: async (id: string, amount: number = 1) => {
        const { checkAuth, items } = get();
        const isAuth = checkAuth();

        // Get current item to calculate new quantity
        const currentItem = items.find((item) => item.id === id);
        if (!currentItem) return;

        const newQuantity = currentItem.quantity + amount;

        if (isAuth) {
          // AUTH FLOW: Call API with new TOTAL quantity
          try {
            await cartService.addToCart({
              product_id: id,
              quantity: newQuantity,
            });
            await get().fetchServerCart();
          } catch (error) {
            console.error("Failed to update quantity:", error);
          }
        } else {
          // GUEST FLOW: Update local state
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity: newQuantity } : item
            ),
          }));
        }
      },

      // Decrease item quantity (removes if quantity becomes 0)
      decreaseQuantity: async (id: string, amount: number = 1) => {
        const { checkAuth, items } = get();
        const isAuth = checkAuth();

        // Get current item to calculate new quantity
        const currentItem = items.find((item) => item.id === id);
        if (!currentItem) return;

        const newQuantity = Math.max(0, currentItem.quantity - amount);

        if (isAuth) {
          // AUTH FLOW: Call API with new TOTAL quantity
          try {
            await cartService.addToCart({
              product_id: id,
              quantity: newQuantity,
            });
            await get().fetchServerCart();
          } catch (error) {
            console.error("Failed to update quantity:", error);
          }
        } else {
          // GUEST FLOW: Update local state
          set((state) => ({
            items: state.items
              .map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
              )
              .filter((item) => item.quantity > 0),
          }));
        }
      },

      // Update item quantity directly
      updateQuantity: async (id: string, quantity: number) => {
        const { checkAuth } = get();
        const isAuth = checkAuth();

        if (quantity <= 0) {
          await get().removeFromCart(id);
          return;
        }

        if (isAuth) {
          // AUTH FLOW: Call API with new TOTAL quantity
          try {
            await cartService.addToCart({
              product_id: id,
              quantity,
            });
            await get().fetchServerCart();
          } catch (error) {
            console.error("Failed to update quantity:", error);
          }
        } else {
          // GUEST FLOW: Update local state
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
