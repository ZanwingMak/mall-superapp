import { useMutation, useQuery } from '@tanstack/react-query';

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: 'fashion' | 'digital' | 'home' | 'food';
  tags: string[];
  stock: number;
}

export interface Coupon {
  id: string;
  title: string;
  discount: number;
  minSpend: number;
  expireAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  city: string;
  detail: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  amount: number;
  status: 'paid' | 'shipping' | 'done';
  createdAt: string;
  itemCount: number;
}

export interface CheckoutPayload {
  itemIds: string[];
  couponId?: string;
  addressId: string;
  paymentMethod: 'alipay' | 'wechat' | 'card';
}

const fallback = {
  products: [
    { id: 'p1', title: 'Air Flex 运动鞋', price: 399, image: 'https://picsum.photos/seed/shoe/400/300', category: 'fashion', tags: ['爆款'], stock: 10 }
  ] as Product[],
  coupons: [{ id: 'c1', title: '满300减30', discount: 30, minSpend: 300, expireAt: '2026-04-30' }] as Coupon[],
  addresses: [{ id: 'a1', name: '张三', phone: '138', city: '上海', detail: '张江路', isDefault: true }] as Address[],
  orders: [{ id: 'o1', amount: 399, status: 'paid', createdAt: '2026-03-29', itemCount: 1 }] as Order[]
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function fetchProducts() {
  try {
    return await request<Product[]>('/api/products');
  } catch {
    return fallback.products;
  }
}
export async function fetchCoupons() {
  try {
    return await request<Coupon[]>('/api/coupons');
  } catch {
    return fallback.coupons;
  }
}
export async function fetchAddresses() {
  try {
    return await request<Address[]>('/api/addresses');
  } catch {
    return fallback.addresses;
  }
}
export async function fetchOrders() {
  try {
    return await request<Order[]>('/api/orders');
  } catch {
    return fallback.orders;
  }
}

export function useProductsQuery() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts });
}

export function useCouponsQuery() {
  return useQuery({ queryKey: ['coupons'], queryFn: fetchCoupons });
}

export function useAddressesQuery() {
  return useQuery({ queryKey: ['addresses'], queryFn: fetchAddresses });
}

export function useOrdersQuery() {
  return useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
}

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      try {
        return await request<{ orderId: string; status: 'success' }>('/api/checkout', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch {
        return { orderId: `o${Date.now()}`, status: 'success' as const };
      }
    }
  });
}
