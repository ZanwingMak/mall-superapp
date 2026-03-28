import { create } from 'zustand';

export interface CartItem { id: string; name: string; price: number; count: number; }

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'count'>) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find((x) => x.id === item.id);
    if (existing) {
      return { items: state.items.map((x) => x.id === item.id ? { ...x, count: x.count + 1 } : x) };
    }
    return { items: [...state.items, { ...item, count: 1 }] };
  }),
  clear: () => set({ items: [] })
}));
