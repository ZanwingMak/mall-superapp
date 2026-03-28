import { describe, expect, test } from 'vitest';
import { useCartStore } from './index';

describe('cart store', () => {
  test('add item and toggle favorite', () => {
    useCartStore.setState({ items: [], favorites: [], paymentMethod: 'alipay' });

    useCartStore.getState().addItem({ id: 'p1', name: '测试商品', price: 100 });
    useCartStore.getState().addItem({ id: 'p1', name: '测试商品', price: 100 });
    useCartStore.getState().toggleFavorite('p1');

    const state = useCartStore.getState();
    expect(state.items[0].count).toBe(2);
    expect(state.favorites).toContain('p1');
  });
});
