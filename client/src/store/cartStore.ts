import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meal } from '@/src/types';

export interface CartItem {
  meal: Meal;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (meal: Meal, quantity?: number) => void;
  removeItem: (mealId: number) => void;
  updateQuantity: (mealId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (meal, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.meal.id === meal.id);
          if (existingItem) {
            // If item exists, increase quantity
            return {
              items: state.items.map((item) =>
                item.meal.id === meal.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          // If new item, add to array
          return { items: [...state.items, { meal, quantity }] };
        });
      },

      removeItem: (mealId) => {
        set((state) => ({
          items: state.items.filter((item) => item.meal.id !== mealId),
        }));
      },

      updateQuantity: (mealId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.meal.id === mealId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = typeof item.meal.price === 'string' ? parseFloat(item.meal.price) : item.meal.price;
          return total + (price * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'foodhub-cart', // Saves cart to LocalStorage automatically!
    }
  )
);