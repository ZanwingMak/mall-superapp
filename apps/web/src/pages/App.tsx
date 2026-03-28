import {
  useAddressesQuery,
  useCheckoutMutation,
  useCouponsQuery,
  useOrdersQuery,
  useProductsQuery
} from '@mall/api-client';
import { useCartStore } from '@mall/store';
import { ProductCard, SectionTitle } from '@mall/ui';
import { useMemo, useState } from 'react';

const categoryOptions = [
  { label: '全部', value: 'all' },
  { label: '服饰', value: 'fashion' },
  { label: '数码', value: 'digital' },
  { label: '家居', value: 'home' },
  { label: '食品', value: 'food' }
] as const;

export default function App() {
  const { data: products = [] } = useProductsQuery();
  const { data: coupons = [] } = useCouponsQuery();
  const { data: addresses = [] } = useAddressesQuery();
  const { data: orders = [] } = useOrdersQuery();

  const { items, favorites, paymentMethod, addItem, removeItem, clear, toggleFavorite, setPaymentMethod } =
    useCartStore();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<(typeof categoryOptions)[number]['value']>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const checkout = useCheckoutMutation();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const hitKeyword = p.title.toLowerCase().includes(keyword.toLowerCase());
      const hitCategory = category === 'all' || p.category === category;
      return hitKeyword && hitCategory;
    });
  }, [products, keyword, category]);

  const subtotal = items.reduce((s, i) => s + i.price * i.count, 0);
  const couponAmount = coupons.find((x) => x.id === selectedCoupon && subtotal >= x.minSpend)?.discount ?? 0;
  const payable = Math.max(subtotal - couponAmount, 0);

  const submitOrder = async () => {
    if (!items.length || !selectedAddress) return;
    await checkout.mutateAsync({
      itemIds: items.map((i) => i.id),
      couponId: selectedCoupon || undefined,
      addressId: selectedAddress,
      paymentMethod
    });
    clear();
  };

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <header className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
        <h1 className="text-2xl font-bold md:text-4xl">Mall SuperApp</h1>
        <p className="mt-2 opacity-90">多端购物商城演示（Web + Taro + Tauri）</p>
      </header>

      <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm md:flex md:items-center md:gap-4">
        <input
          aria-label="搜索商品"
          className="mb-3 w-full rounded-xl border px-3 py-2 md:mb-0"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索商品名..."
        />
        <div className="flex gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              className={`rounded-xl border px-3 py-2 text-sm ${
                category === option.value ? 'bg-slate-900 text-white' : 'bg-white'
              }`}
              onClick={() => setCategory(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>推荐商品</SectionTitle>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {filteredProducts.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white p-2 shadow-sm">
              <ProductCard title={p.title} price={p.price} image={p.image} />
              <div className="mt-2 flex gap-2">
                <button
                  className="w-full rounded-xl bg-slate-900 py-2 text-sm text-white"
                  onClick={() => addItem({ id: p.id, name: p.title, price: p.price })}
                >
                  加入购物车
                </button>
                <button
                  aria-label={`收藏${p.title}`}
                  className="rounded-xl border px-3"
                  onClick={() => toggleFavorite(p.id)}
                >
                  {favorites.includes(p.id) ? '♥' : '♡'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <SectionTitle>购物车与支付</SectionTitle>
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.id} className="flex items-center justify-between text-sm">
                <span>
                  {i.name} x {i.count}
                </span>
                <div className="flex items-center gap-2">
                  <span>¥{(i.price * i.count).toFixed(2)}</span>
                  <button className="rounded border px-2" onClick={() => removeItem(i.id)}>
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 text-sm">
            <p>小计：¥{subtotal.toFixed(2)}</p>
            <p>优惠：-¥{couponAmount.toFixed(2)}</p>
            <p className="text-base font-semibold">应付：¥{payable.toFixed(2)}</p>
          </div>

          <label className="mt-4 block text-sm font-medium">优惠券</label>
          <select
            aria-label="优惠券"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={selectedCoupon}
            onChange={(e) => setSelectedCoupon(e.target.value)}
          >
            <option value="">不使用</option>
            {coupons.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}（门槛 ¥{c.minSpend}）
              </option>
            ))}
          </select>

          <label className="mt-3 block text-sm font-medium">收货地址</label>
          <select
            aria-label="收货地址"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            <option value="">请选择地址</option>
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} / {a.city} / {a.detail}
              </option>
            ))}
          </select>

          <label className="mt-3 block text-sm font-medium">支付方式</label>
          <div className="mt-1 flex gap-2">
            {[
              ['alipay', '支付宝'],
              ['wechat', '微信支付'],
              ['card', '银行卡']
            ].map(([key, label]) => (
              <button
                key={key}
                className={`rounded-xl border px-3 py-2 text-sm ${paymentMethod === key ? 'bg-orange-500 text-white' : ''}`}
                onClick={() => setPaymentMethod(key as 'alipay' | 'wechat' | 'card')}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
            disabled={!items.length || !selectedAddress || checkout.isPending}
            onClick={submitOrder}
          >
            {checkout.isPending ? '下单中...' : '提交订单'}
          </button>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <SectionTitle>订单列表</SectionTitle>
          <ul className="space-y-2">
            {orders.map((o) => (
              <li key={o.id} className="rounded-xl border p-3 text-sm">
                <div className="flex justify-between">
                  <span>订单号 {o.id}</span>
                  <span>{o.status}</span>
                </div>
                <div className="mt-1 flex justify-between text-slate-600">
                  <span>{o.createdAt}</span>
                  <span>
                    {o.itemCount} 件，¥{o.amount}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {checkout.isSuccess ? (
            <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">订单提交成功：{checkout.data.orderId}</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
