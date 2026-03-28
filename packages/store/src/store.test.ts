import { describe, expect, test } from 'vitest';
import { useCartStore } from './index';

describe('cart store', () => {
  test('add item and toggle favorite', () => {
    useCartStore.setState({ items: [], favorites: [], paymentMethod: 'alipay' } as any);

    useCartStore.getState().addItem({ id: 'p1', name: '测试商品', price: 100 });
    useCartStore.getState().addItem({ id: 'p1', name: '测试商品', price: 100 });
    useCartStore.getState().toggleFavorite('p1');

    const state = useCartStore.getState();
    expect(state.items[0].count).toBe(2);
    expect(state.favorites).toContain('p1');
  });

  test('select all and remove selected', () => {
    useCartStore.setState({
      items: [
        { id: 'p1', name: 'A', price: 10, count: 1, selected: false },
        { id: 'p2', name: 'B', price: 20, count: 1, selected: false }
      ],
      favorites: [],
      paymentMethod: 'alipay'
    } as any);

    useCartStore.getState().toggleSelectAll(true);
    useCartStore.getState().removeSelected();

    expect(useCartStore.getState().items.length).toBe(0);
  });

  test('update quantity keeps minimum 1', () => {
    useCartStore.setState({ items: [{ id: 'p1', name: 'A', price: 10, count: 2, selected: true }], favorites: [], paymentMethod: 'alipay' } as any);

    useCartStore.getState().updateCount('p1', 0);
    expect(useCartStore.getState().items[0].count).toBe(1);
  });
});
