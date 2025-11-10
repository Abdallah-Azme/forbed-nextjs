import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  addToCart: (
    product: Omit<CartItem, "quantity" | "addedAt">,
    quantity?: number
  ) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string, amount?: number) => void;
  decreaseQuantity: (id: string, amount?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemById: (id: string) => CartItem | undefined;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (id: string) => boolean;
}

// Create the Zustand store with localStorage persistence
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add a product to cart or update quantity if already exists
      addToCart: (
        product: Omit<CartItem, "quantity" | "addedAt">,
        quantity: number = 1
      ) => {
        const existingItem = get().items.find((item) => item.id === product.id);

        if (existingItem) {
          // If item exists, increase its quantity
          set((state) => ({
            items: state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          // Add new item
          const newItem: CartItem = {
            ...product,
            quantity,
            addedAt: Date.now(),
          };
          set((state) => ({
            items: [...state.items, newItem],
          }));
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
