import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  count: number;
}

interface CartState {
  items: CartItem[];
  favorites: string[];
  paymentMethod: 'alipay' | 'wechat' | 'card';
  addItem: (item: Omit<CartItem, 'count'>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  toggleFavorite: (id: string) => void;
  setPaymentMethod: (method: CartState['paymentMethod']) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  favorites: [],
  paymentMethod: 'alipay',
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((x) => x.id === item.id);
      if (existing) {
        return {
          items: state.items.map((x) =>
            x.id === item.id ? { ...x, count: x.count + 1 } : x
          )
        };
      }
      return { items: [...state.items, { ...item, count: 1 }] };
    }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((x) => x.id !== id) })),
  clear: () => set({ items: [] }),
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id]
    })),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod })
}));
