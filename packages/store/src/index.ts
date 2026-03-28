import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  originPrice?: number;
  count: number;
  selected: boolean;
  invalid?: boolean;
  skuText?: string;
}

interface CartState {
  items: CartItem[];
  favorites: string[];
  paymentMethod: 'alipay' | 'wechat' | 'card';
  buyNowItem?: CartItem;
  addItem: (item: Omit<CartItem, 'count' | 'selected'>) => void;
  removeItem: (id: string) => void;
  updateCount: (id: string, count: number) => void;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  removeSelected: () => void;
  clear: () => void;
  toggleFavorite: (id: string) => void;
  setPaymentMethod: (method: CartState['paymentMethod']) => void;
  setBuyNowItem: (item?: CartItem) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  favorites: [],
  paymentMethod: 'alipay',
  buyNowItem: undefined,
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((x) => x.id === item.id && x.skuText === item.skuText);
      if (existing) {
        return {
          items: state.items.map((x) =>
            x.id === item.id && x.skuText === item.skuText ? { ...x, count: x.count + 1, invalid: false } : x
          )
        };
      }
      return { items: [...state.items, { ...item, count: 1, selected: true }] };
    }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((x) => x.id !== id) })),
  updateCount: (id, count) =>
    set((state) => ({
      items: state.items.map((x) => (x.id === id ? { ...x, count: Math.max(1, count) } : x))
    })),
  toggleSelect: (id) =>
    set((state) => ({ items: state.items.map((x) => (x.id === id ? { ...x, selected: !x.selected } : x)) })),
  toggleSelectAll: (selected) => set((state) => ({ items: state.items.map((x) => ({ ...x, selected: !x.invalid && selected })) })),
  removeSelected: () => set((state) => ({ items: state.items.filter((x) => !x.selected || x.invalid) })),
  clear: () => set({ items: [], buyNowItem: undefined }),
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id]
    })),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setBuyNowItem: (buyNowItem) => set({ buyNowItem })
}));
