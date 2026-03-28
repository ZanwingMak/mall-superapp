import { useMutation, useQuery } from '@tanstack/react-query';

export type Category = 'fashion' | 'digital' | 'home' | 'food';
export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'done';

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  originPrice?: number;
  image: string;
  images?: string[];
  category: Category;
  tags: string[];
  stock: number;
  soldCount?: number;
  rating?: number;
  description?: string;
  specs?: { name: string; values: string[] }[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  content: string;
  createdAt: string;
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
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
}

export interface HomePayload {
  banners: { id: string; title: string; image: string; subtitle: string }[];
  activities: { id: string; title: string; desc: string; badge: string }[];
  hotRank: { id: string; name: string; score: string }[];
  newcomer: { id: string; title: string; perk: string }[];
}

export interface CheckoutPayload {
  itemIds: string[];
  couponId?: string;
  addressId: string;
  paymentMethod: 'alipay' | 'wechat' | 'card';
  remark?: string;
  shippingFee?: number;
  invoice?: {
    needInvoice: boolean;
    type?: 'personal' | 'company';
    title?: string;
    taxNo?: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'logistics' | 'promo' | 'price_drop' | 'service';
  createdAt: string;
  read: boolean;
}

export interface FootprintItem {
  id: string;
  viewedAt: string;
  source: 'home' | 'search' | 'activity' | 'recommend';
}

export interface CampaignDetail {
  id: string;
  title: string;
  period: string;
  desc: string;
  rules: string[];
  highlights: string[];
}

const fallback = {
  home: {
    banners: [{ id: 'b1', title: '春季上新', image: 'https://picsum.photos/seed/banner1/1200/420', subtitle: '满299减50' }],
    activities: [{ id: 'a1', title: '限时秒杀', desc: '每日10点开抢', badge: 'HOT' }],
    hotRank: [{ id: 'h1', name: '蓝牙降噪耳机', score: '热度 98%' }],
    newcomer: [{ id: 'n1', title: '新人礼包', perk: '注册领88元券包' }]
  } as HomePayload,
  products: [
    {
      id: 'p1',
      title: 'Air Flex 运动鞋',
      subtitle: '轻弹缓震，全天舒适',
      price: 399,
      originPrice: 499,
      image: 'https://picsum.photos/seed/shoe/400/300',
      images: ['https://picsum.photos/seed/shoe/1000/800', 'https://picsum.photos/seed/shoe2/1000/800'],
      category: 'fashion',
      tags: ['爆款', '轻便'],
      stock: 10,
      soldCount: 2390,
      rating: 4.8,
      description: '高回弹中底，透气鞋面，通勤与运动两相宜。',
      specs: [
        { name: '颜色', values: ['云白', '曜黑', '雾灰'] },
        { name: '尺码', values: ['40', '41', '42', '43'] }
      ]
    }
  ] as Product[],
  reviews: [
    { id: 'r1', user: '星***7', rating: 5, content: '穿着很舒服，尺码标准。', createdAt: '2026-03-28' }
  ] as Review[],
  coupons: [{ id: 'c1', title: '满300减30', discount: 30, minSpend: 300, expireAt: '2026-04-30' }] as Coupon[],
  addresses: [{ id: 'a1', name: '张三', phone: '138', city: '上海', detail: '张江路', isDefault: true }] as Address[],
  orders: [{ id: 'o1', amount: 399, status: 'paid', createdAt: '2026-03-29', itemCount: 1 }] as Order[],
  notifications: [
    { id: 'n1', title: '订单已发货', content: '您的订单已发货，预计明日送达。', type: 'logistics', createdAt: '2026-03-29 01:30', read: false }
  ] as NotificationItem[],
  footprints: [
    { id: 'p1', viewedAt: '2026-03-29 00:58', source: 'search' }
  ] as FootprintItem[],
  campaign: {
    id: 'a1',
    title: '限时秒杀',
    period: '每日 10:00 / 20:00',
    desc: '爆款商品限时直降，库存有限。',
    rules: ['每人限购 2 件', '付款超时自动取消'],
    highlights: ['3 折起', '价保']
  } as CampaignDetail
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export const fetchHome = async () => {
  try {
    return await request<HomePayload>('/api/home');
  } catch {
    return fallback.home;
  }
};

export async function fetchProducts() {
  try {
    return await request<Product[]>('/api/products');
  } catch {
    return fallback.products;
  }
}

export const fetchProductDetail = async (id: string) => {
  try {
    return await request<Product>(`/api/products/${id}`);
  } catch {
    return fallback.products[0];
  }
};

export const fetchReviews = async (productId: string) => {
  try {
    return await request<Review[]>(`/api/reviews?productId=${productId}`);
  } catch {
    return fallback.reviews;
  }
};

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
export async function fetchOrders(status?: string) {
  try {
    return await request<Order[]>(`/api/orders${status ? `?status=${status}` : ''}`);
  } catch {
    return fallback.orders;
  }
}

export async function fetchNotifications() {
  try {
    return await request<NotificationItem[]>('/api/notifications');
  } catch {
    return fallback.notifications;
  }
}

export async function fetchFootprints() {
  try {
    return await request<FootprintItem[]>('/api/footprints');
  } catch {
    return fallback.footprints;
  }
}

export async function fetchCampaignDetail(id: string) {
  try {
    return await request<CampaignDetail>(`/api/campaigns/${id}`);
  } catch {
    return fallback.campaign;
  }
}

export function useHomeQuery() {
  return useQuery({ queryKey: ['home'], queryFn: fetchHome });
}

export function useProductsQuery() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts });
}

export function useProductDetailQuery(id: string) {
  return useQuery({ queryKey: ['product', id], queryFn: () => fetchProductDetail(id), enabled: Boolean(id) });
}

export function useReviewsQuery(productId: string) {
  return useQuery({ queryKey: ['reviews', productId], queryFn: () => fetchReviews(productId), enabled: Boolean(productId) });
}

export function useCouponsQuery() {
  return useQuery({ queryKey: ['coupons'], queryFn: fetchCoupons });
}

export function useAddressesQuery() {
  return useQuery({ queryKey: ['addresses'], queryFn: fetchAddresses });
}

export function useOrdersQuery(status?: string) {
  return useQuery({ queryKey: ['orders', status], queryFn: () => fetchOrders(status) });
}

export function useNotificationsQuery() {
  return useQuery({ queryKey: ['notifications'], queryFn: fetchNotifications });
}

export function useFootprintsQuery() {
  return useQuery({ queryKey: ['footprints'], queryFn: fetchFootprints });
}

export function useCampaignDetailQuery(id: string) {
  return useQuery({ queryKey: ['campaign', id], queryFn: () => fetchCampaignDetail(id), enabled: Boolean(id) });
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
