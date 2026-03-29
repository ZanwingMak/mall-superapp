import type { NotificationItem, Order, Product, Review } from '@mall/api-client';

export type SortBy = 'smart' | 'sold' | 'rating' | 'price-asc' | 'price-desc';

export function filterAndSortProducts(products: Product[], keyword: string, category: string, sortBy: SortBy) {
  const normalized = keyword.trim().toLowerCase();
  const list = products.filter((p) => {
    const fields = [p.title, p.subtitle, p.brand, p.tags?.join(' '), p.promoTags?.join(' ')].filter(Boolean).join(' ').toLowerCase();
    const hitKeyword = !normalized || fields.includes(normalized);
    const hitCategory = category === 'all' || p.category === category;
    return hitKeyword && hitCategory;
  });

  return [...list].sort((a, b) => {
    const scoreA = (a.rating || 0) * 20 + (a.soldCount || 0) / 100;
    const scoreB = (b.rating || 0) * 20 + (b.soldCount || 0) / 100;
    switch (sortBy) {
      case 'sold':
        return (b.soldCount || 0) - (a.soldCount || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'smart':
      default:
        return scoreB - scoreA;
    }
  });
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const safePage = Math.max(page, 1);
  const end = safePage * pageSize;
  return {
    visible: items.slice(0, end),
    hasMore: end < items.length,
    total: items.length
  };
}

export function filterOrderList(orders: Order[], keyword: string, status: string) {
  const normalized = keyword.trim().toLowerCase();
  return orders.filter((o) => {
    const hitKeyword = !normalized || `${o.id} ${o.amount} ${o.status}`.toLowerCase().includes(normalized);
    const hitStatus = status === 'all' || o.status === status;
    return hitKeyword && hitStatus;
  });
}

export function filterNotificationsList(notifications: NotificationItem[], tab: 'all' | 'unread', keyword: string, type: 'all' | NotificationItem['type']) {
  const normalized = keyword.trim().toLowerCase();
  return notifications.filter((x) => {
    const hitTab = tab === 'all' || !x.read;
    const hitKeyword = !normalized || `${x.title} ${x.content}`.toLowerCase().includes(normalized);
    const hitType = type === 'all' || x.type === type;
    return hitTab && hitKeyword && hitType;
  });
}

export function buildReviewChunks(reviews: Review[], tab: 'all' | 'withPic' | 'low', chunkSize: number) {
  const filtered = reviews.filter((r) => {
    if (tab === 'withPic') return !!r.images?.length || !!r.appendComment;
    if (tab === 'low') return r.rating <= 3;
    return true;
  });

  return {
    filtered,
    chunk: (page: number) => filtered.slice(0, Math.max(1, page) * chunkSize),
    hasMore: (page: number) => Math.max(1, page) * chunkSize < filtered.length
  };
}
