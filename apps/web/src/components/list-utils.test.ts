import { describe, expect, it } from 'vitest';
import {
  buildReviewChunks,
  filterAndSortProducts,
  filterNotificationsList,
  filterOrderList,
  getOrderStatusMeta,
  getReviewStats,
  paginateItems
} from '../pages/list-utils';

describe('list utils', () => {
  it('handles product filter + smart sort', () => {
    const list = [
      { id: 'p1', title: 'Nova耳机', price: 299, category: 'digital', tags: [], stock: 1, soldCount: 200, rating: 4.8 },
      { id: 'p2', title: 'Nova保温杯', price: 99, category: 'home', tags: [], stock: 1, soldCount: 1000, rating: 4.3 },
      { id: 'p3', title: 'Lumi耳机', price: 199, category: 'digital', tags: [], stock: 1, soldCount: 90, rating: 4.0 }
    ] as any;
    const result = filterAndSortProducts(list, '耳机', 'digital', 'smart');
    expect(result.map((x) => x.id)).toEqual(['p1', 'p3']);
  });

  it('supports pagination load-more model', () => {
    const source = Array.from({ length: 35 }, (_, i) => i + 1);
    const page1 = paginateItems(source, 1, 16);
    const page3 = paginateItems(source, 3, 16);
    expect(page1.visible).toHaveLength(16);
    expect(page1.hasMore).toBe(true);
    expect(page3.visible).toHaveLength(35);
    expect(page3.hasMore).toBe(false);
  });

  it('returns current showing count in pagination', () => {
    const source = Array.from({ length: 33 }, (_, i) => i + 1);
    expect(paginateItems(source, 1, 12).showing).toBe(12);
    expect(paginateItems(source, 10, 12).showing).toBe(33);
  });

  it('filters order anomalies by keyword and status', () => {
    const orders = [
      { id: 'o1', amount: 100, status: 'done' },
      { id: 'o2', amount: 180, status: 'out_of_stock' },
      { id: 'o3', amount: 230, status: 'refund_processing' }
    ] as any;
    expect(filterOrderList(orders, 'o2', 'all')).toHaveLength(1);
    expect(filterOrderList(orders, '', 'refund_processing')).toHaveLength(1);
  });

  it('maps order status to visual meta', () => {
    expect(getOrderStatusMeta('pending').label).toBe('待付款');
    expect(getOrderStatusMeta('done').progress).toBe(100);
    expect(getOrderStatusMeta('unknown').chip).toContain('bg-slate-100');
  });

  it('supports review chunk loading and with-image filter', () => {
    const reviews = [
      { id: 'r1', rating: 5, content: '好', images: ['x'] },
      { id: 'r2', rating: 2, content: '一般' },
      { id: 'r3', rating: 4, content: '追评', appendComment: '追加' }
    ] as any;
    const chunk = buildReviewChunks(reviews, 'withPic', 1);
    expect(chunk.filtered).toHaveLength(2);
    expect(chunk.chunk(1)).toHaveLength(1);
    expect(chunk.hasMore(1)).toBe(true);
  });

  it('provides review showing count', () => {
    const reviews = Array.from({ length: 25 }, (_, i) => ({ id: `r${i}`, rating: 5, content: 'ok' })) as any;
    const chunk = buildReviewChunks(reviews, 'all', 12);
    expect(chunk.showing(1)).toBe(12);
    expect(chunk.showing(3)).toBe(25);
  });

  it('aggregates review stats', () => {
    const reviews = [
      { id: 'r1', rating: 5, content: 'a', images: ['a'] },
      { id: 'r2', rating: 4, content: 'b' },
      { id: 'r3', rating: 3, content: 'c' },
      { id: 'r4', rating: 1, content: 'd', appendComment: '补充' }
    ] as any;
    const stats = getReviewStats(reviews);
    expect(stats.total).toBe(4);
    expect(stats.positive).toBe(2);
    expect(stats.neutral).toBe(1);
    expect(stats.negative).toBe(1);
    expect(stats.mediaRatio).toBe(50);
  });

  it('filters notifications with tab + type + keyword', () => {
    const list = [
      { id: 'n1', title: '物流提醒', content: '已发货', read: false, type: 'logistics' },
      { id: 'n2', title: '促销', content: '满减', read: true, type: 'promo' }
    ] as any;
    expect(filterNotificationsList(list, 'unread', '', 'all')).toHaveLength(1);
    expect(filterNotificationsList(list, 'all', '满减', 'promo')).toHaveLength(1);
  });

  it('supports empty review stats', () => {
    const stats = getReviewStats([] as any);
    expect(stats.total).toBe(0);
    expect(stats.mediaRatio).toBe(0);
  });
});
