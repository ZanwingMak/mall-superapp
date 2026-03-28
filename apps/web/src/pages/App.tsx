import { useProductsQuery } from '@mall/api-client';
import { useCartStore } from '@mall/store';
import { ProductCard, SectionTitle } from '@mall/ui';

export default function App() {
  const { data = [] } = useProductsQuery();
  const { items, addItem, clear } = useCartStore();
  const total = items.reduce((s, i) => s + i.price * i.count, 0);

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <header className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
        <h1 className="text-2xl font-bold md:text-4xl">Mall SuperApp</h1>
        <p className="mt-2 opacity-90">多端购物商城演示（Web + Taro + Tauri）</p>
      </header>

      <section>
        <SectionTitle>推荐商品</SectionTitle>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data.map((p) => (
            <div key={p.id}>
              <ProductCard title={p.title} price={p.price} image={p.image} />
              <button
                className="mt-2 w-full rounded-xl bg-slate-900 py-2 text-sm text-white"
                onClick={() => addItem({ id: p.id, name: p.title, price: p.price })}
              >
                加入购物车
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
        <SectionTitle>购物车</SectionTitle>
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between text-sm">
              <span>{i.name} x {i.count}</span>
              <span>¥{(i.price * i.count).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between font-semibold">
          <span>合计</span><span>¥{total.toFixed(2)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded-xl bg-orange-500 px-4 py-2 text-white">模拟下单</button>
          <button className="rounded-xl border px-4 py-2" onClick={clear}>清空</button>
        </div>
      </section>
    </main>
  );
}
