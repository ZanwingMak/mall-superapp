import { useMutation, useQuery } from '@tanstack/react-query';

export type Category = 'fashion' | 'digital' | 'home' | 'food';
export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'done' | 'cancelled' | 'out_of_stock' | 'refund_processing' | 'refund_done';

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  brand?: string;
  price: number;
  originPrice?: number;
  image: string;
  images?: string[];
  category: Category;
  tags: string[];
  promoTags?: string[];
  stock: number;
  soldCount?: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
  specs?: { name: string; values: string[] }[];
  skus?: Array<{ id: string; attrs: Record<string, string>; stock: number; price: number }>;
}

export interface Review {
  id: string;
  productId?: string;
  user: string;
  rating: number;
  content: string;
  createdAt: string;
  images?: string[];
  appendComment?: string;
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
    banners: [
      { id: 'b1', title: '春季上新', image: 'https://picsum.photos/seed/banner1/1200/420', subtitle: '满299减50' },
      { id: 'b2', title: '数码尖货周', image: 'https://picsum.photos/seed/banner2/1200/420', subtitle: '爆款低至5折' },
      { id: 'b3', title: '居家生活季', image: 'https://picsum.photos/seed/banner3/1200/420', subtitle: '家清家纺限时直降' }
    ],
    activities: [
      { id: 'ac1', title: '限时秒杀', desc: '每日10点开抢', badge: 'HOT' },
      { id: 'ac2', title: '品牌会员日', desc: '满599享12期免息', badge: 'NEW' },
      { id: 'ac3', title: '9.9包邮专区', desc: '新人专享优选', badge: '省' }
    ],
    hotRank: [
      { id: 'h1', name: '蓝牙降噪耳机', score: '热度 98%' },
      { id: 'h2', name: 'Air Flex 运动鞋', score: '热度 96%' },
      { id: 'h3', name: '智能保温杯', score: '热度 93%' },
      { id: 'h4', name: '磁吸充电宝', score: '热度 91%' }
    ],
    newcomer: [
      { id: 'n1', title: '新人礼包', perk: '注册领88元券包' },
      { id: 'n2', title: '首单包邮', perk: '0门槛下单' }
    ]
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
    },
    {
      id: 'p2',
      title: 'Nova ANC 降噪耳机',
      subtitle: '地铁办公都安静',
      price: 699,
      originPrice: 899,
      image: 'https://picsum.photos/seed/headphone/400/300',
      category: 'digital',
      tags: ['降噪', '长续航'],
      stock: 24,
      soldCount: 1580,
      rating: 4.7
    },
    {
      id: 'p3',
      title: '智能恒温电热水壶',
      subtitle: '五档控温，母婴可用',
      price: 199,
      originPrice: 269,
      image: 'https://picsum.photos/seed/kettle/400/300',
      category: 'home',
      tags: ['家居', '恒温'],
      stock: 56,
      soldCount: 990,
      rating: 4.5
    },
    {
      id: 'p4',
      title: '轻享每日坚果礼盒',
      subtitle: '30 袋独立包装',
      price: 89,
      originPrice: 119,
      image: 'https://picsum.photos/seed/nuts/400/300',
      category: 'food',
      tags: ['零食', '健康'],
      stock: 80,
      soldCount: 3200,
      rating: 4.6
    },
    {
      id: 'p5',
      title: 'CityRun 运动短袖',
      subtitle: '速干透气不闷汗',
      price: 129,
      originPrice: 169,
      image: 'https://picsum.photos/seed/tshirt/400/300',
      category: 'fashion',
      tags: ['速干', '夏季'],
      stock: 120,
      soldCount: 2100,
      rating: 4.4
    },
    {
      id: 'p6',
      title: '便携磁吸充电宝 10000mAh',
      subtitle: '小巧轻薄，支持快充',
      price: 179,
      originPrice: 239,
      image: 'https://picsum.photos/seed/powerbank/400/300',
      category: 'digital',
      tags: ['快充', '磁吸'],
      stock: 35,
      soldCount: 1470,
      rating: 4.6
    }
  ] as Product[],
  reviews: [
    { id: 'r1', user: '星***7', rating: 5, content: '穿着很舒服，尺码标准。', createdAt: '2026-03-28' },
    { id: 'r2', user: '海***2', rating: 4, content: '外观好看，做工在线。', createdAt: '2026-03-27', appendComment: '用了几天依然满意。' },
    { id: 'r3', user: '风***9', rating: 5, content: '物流很快，包装完整。', createdAt: '2026-03-26' },
    { id: 'r4', user: '木***1', rating: 4, content: '性价比不错，值得入手。', createdAt: '2026-03-25' },
    { id: 'r5', user: '雨***5', rating: 5, content: '家里人都说好，回购。', createdAt: '2026-03-24' },
    { id: 'r6', user: '晨***3', rating: 3, content: '整体还行，细节可优化。', createdAt: '2026-03-23' }
  ] as Review[], 
  coupons: [{ id: 'c1', title: '满300减30', discount: 30, minSpend: 300, expireAt: '2026-04-30' }] as Coupon[],
  addresses: [{ id: 'a1', name: '张三', phone: '138', city: '上海', detail: '张江路', isDefault: true }] as Address[],
  orders: [
    { id: 'o1001', amount: 399, status: 'pending', createdAt: '2026-03-29 10:21', itemCount: 1 },
    { id: 'o1002', amount: 1099, status: 'shipping', createdAt: '2026-03-29 09:08', itemCount: 2 },
    { id: 'o1003', amount: 268, status: 'done', createdAt: '2026-03-28 21:16', itemCount: 3 },
    { id: 'o1004', amount: 159, status: 'out_of_stock', createdAt: '2026-03-28 17:45', itemCount: 1 },
    { id: 'o1005', amount: 520, status: 'cancelled', createdAt: '2026-03-27 14:30', itemCount: 2 },
    { id: 'o1006', amount: 239, status: 'refund_processing', createdAt: '2026-03-27 11:02', itemCount: 1 }
  ] as Order[], 
  notifications: [
    { id: 'n1', title: '订单已发货', content: '您的订单已发货，预计明日送达。', type: 'logistics', createdAt: '2026-03-29 01:30', read: false }
  ] as NotificationItem[],
  footprints: [
    { id: 'p1', viewedAt: '2026-03-29 00:58', source: 'search' }
  ] as FootprintItem[],
  campaign: {
    id: 'ac1',
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
    return fallback.products.find((x) => x.id === id) || fallback.products[0];
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
