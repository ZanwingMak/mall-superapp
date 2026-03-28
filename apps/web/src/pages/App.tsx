import {
  useAddressesQuery,
  useCheckoutMutation,
  useCouponsQuery,
  useHomeQuery,
  useOrdersQuery,
  useProductDetailQuery,
  useProductsQuery,
  useReviewsQuery
} from '@mall/api-client';
import { useCartStore } from '@mall/store';
import { Button, Card, EmptyState, ProductCard, SectionTitle, Skeleton, Tag } from '@mall/ui';
import { useEffect, useMemo, useState } from 'react';

const categoryOptions = [
  { label: '全部', value: 'all' },
  { label: '服饰', value: 'fashion' },
  { label: '数码', value: 'digital' },
  { label: '家居', value: 'home' },
  { label: '食品', value: 'food' }
] as const;

const orderTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'shipping', label: '待发货' },
  { key: 'done', label: '已完成' }
] as const;

const categories = ['潮流服饰', '数码好物', '居家精选', '食品生鲜', '美妆个护', '运动户外', '母婴亲子', '百货日用'];

function usePath() {
  const [path, setPath] = useState(window.location.pathname || '/');
  useEffect(() => {
    const fn = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn);
  }, []);
  const go = (next: string) => {
    if (next === window.location.pathname) return;
    window.history.pushState({}, '', next);
    setPath(next);
  };
  return { path, go };
}

export default function App() {
  const { path, go } = usePath();
  const { data: products = [], isLoading: productsLoading, isError } = useProductsQuery();
  const { data: home } = useHomeQuery();
  const { favorites, toggleFavorite } = useCartStore();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<(typeof categoryOptions)[number]['value']>('all');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!home?.banners?.length) return;
    const timer = setInterval(() => setBannerIndex((v) => (v + 1) % home.banners.length), 3200);
    return () => clearInterval(timer);
  }, [home?.banners?.length]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 1400);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const hitKeyword = p.title.toLowerCase().includes(keyword.toLowerCase());
        const hitCategory = category === 'all' || p.category === category;
        return hitKeyword && hitCategory;
      }),
    [products, keyword, category]
  );

  const onAddCart = (p: (typeof products)[number]) => {
    useCartStore.getState().addItem({ id: p.id, name: p.title, image: p.image, price: p.price, originPrice: p.originPrice });
    setToast('已加入购物车');
  };

  const Header = (
    <header className="sticky top-0 z-10 mb-4 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 p-3 md:p-4">
        <button className="text-base font-bold text-[var(--color-brand)]" onClick={() => go('/')}>
          Mall SuperApp
        </button>
        <input
          aria-label="搜索商品"
          className="h-10 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[var(--color-brand)]"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索商品、品牌、品类"
        />
        <Button variant="secondary" onClick={() => go('/cart')}>
          购物车
        </Button>
        <Button variant="secondary" onClick={() => go('/me')}>
          我的
        </Button>
      </div>
    </header>
  );

  if (path.startsWith('/product/')) {
    return (
      <PageWrap header={Header} toast={toast}>
        <ProductDetailPage id={path.replace('/product/', '')} go={go} onBuyNowToast={setToast} />
      </PageWrap>
    );
  }
  if (path === '/cart') return <PageWrap header={Header} toast={toast}><CartPage go={go} /></PageWrap>;
  if (path === '/checkout') return <PageWrap header={Header} toast={toast}><CheckoutPage go={go} /></PageWrap>;
  if (path === '/success') return <PageWrap header={Header} toast={toast}><SuccessPage go={go} /></PageWrap>;
  if (path === '/orders') return <PageWrap header={Header} toast={toast}><OrdersPage go={go} /></PageWrap>;
  if (path === '/favorites') return <PageWrap header={Header} toast={toast}><FavoritesPage go={go} products={products} /></PageWrap>;
  if (path === '/addresses') return <PageWrap header={Header} toast={toast}><AddressesPage /></PageWrap>;
  if (path === '/me') return <PageWrap header={Header} toast={toast}><MePage go={go} /></PageWrap>;

  return (
    <PageWrap header={Header} toast={toast}>
      <main className="mx-auto max-w-6xl space-y-5 px-3 pb-10 md:px-4">
        <Card className="overflow-hidden">
          {home?.banners?.length ? (
            <div className="relative">
              <img src={home.banners[bannerIndex].image} alt={home.banners[bannerIndex].title} className="h-40 w-full object-cover md:h-64" />
              <div className="absolute left-4 top-4 rounded-2xl bg-black/40 px-3 py-2 text-white">
                <p className="text-lg font-semibold">{home.banners[bannerIndex].title}</p>
                <p className="text-xs opacity-90">{home.banners[bannerIndex].subtitle}</p>
              </div>
            </div>
          ) : (
            <Skeleton className="h-44 w-full md:h-64" />
          )}
        </Card>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Card className="p-4">
            <SectionTitle>活动专区</SectionTitle>
            <div className="grid gap-2 md:grid-cols-3">
              {(home?.activities || []).map((x) => (
                <div key={x.id} className="rounded-2xl bg-[var(--color-brand-soft)] p-3">
                  <Tag tone="hot">{x.badge}</Tag>
                  <p className="mt-2 text-sm font-semibold">{x.title}</p>
                  <p className="text-xs text-slate-500">{x.desc}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <SectionTitle>热门榜单</SectionTitle>
            <ul className="space-y-2 text-sm">
              {(home?.hotRank || []).map((x, i) => (
                <li key={x.id} className="flex items-center justify-between">
                  <span>#{i + 1} {x.name}</span>
                  <span className="text-xs text-orange-600">{x.score}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-4">
          <SectionTitle>分类宫格</SectionTitle>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
            {categories.map((x) => (
              <div key={x} className="rounded-2xl bg-slate-50 py-3 text-center text-xs md:text-sm">{x}</div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle extra={<Tag tone="success">新人专区</Tag>}>精选商品</SectionTitle>
          <div className="mb-3 flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                className={`rounded-xl px-3 py-1 text-sm ${category === option.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                onClick={() => setCategory(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64" />)}</div>
          ) : isError ? (
            <EmptyState title="商品加载失败" desc="请稍后重试" />
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {filteredProducts.map((p) => (
                <div key={p.id}>
                  <button className="w-full text-left" onClick={() => go(`/product/${p.id}`)}>
                    <ProductCard
                      title={p.title}
                      price={p.price}
                      originPrice={p.originPrice}
                      image={p.image}
                      tags={p.tags}
                      rating={p.rating}
                      soldCount={p.soldCount}
                    />
                  </button>
                  <div className="mt-2 flex gap-2">
                    <Button className="flex-1" onClick={() => onAddCart(p)}>加入购物车</Button>
                    <Button variant="secondary" onClick={() => toggleFavorite(p.id)}>{favorites.includes(p.id) ? '♥' : '♡'}</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </PageWrap>
  );
}

function PageWrap({ header, toast, children }: { header: React.ReactNode; toast: string; children: React.ReactNode }) {
  return (
    <div>
      {header}
      {children}
      {toast ? <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs text-white">{toast}</div> : null}
    </div>
  );
}

function ProductDetailPage({ id, go, onBuyNowToast }: { id: string; go: (path: string) => void; onBuyNowToast: (x: string) => void }) {
  const { data: product } = useProductDetailQuery(id);
  const { data: reviews = [] } = useReviewsQuery(id);
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (!product) return <div className="mx-auto max-w-6xl p-4"><Skeleton className="h-96" /></div>;

  const skuText = Object.entries(selected).map(([k, v]) => `${k}:${v}`).join(' / ');

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3 md:p-4">
      <Card className="grid gap-4 p-4 md:grid-cols-2">
        <img src={product.images?.[0] || product.image} alt={product.title} className="h-72 w-full rounded-2xl object-cover md:h-[420px]" />
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{product.subtitle}</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-bold text-[var(--color-brand)]">¥{product.price}</span>
            {product.originPrice ? <span className="text-sm text-slate-400 line-through">¥{product.originPrice}</span> : null}
          </div>
          <p className="mt-2 text-xs text-slate-500">库存 {product.stock} · 已售 {product.soldCount} · ⭐ {product.rating}</p>
          {(product.specs || []).map((spec) => (
            <div key={spec.name} className="mt-4">
              <p className="mb-2 text-sm font-medium">{spec.name}</p>
              <div className="flex flex-wrap gap-2">
                {spec.values.map((v) => (
                  <button
                    key={v}
                    className={`rounded-xl border px-3 py-1 text-sm ${selected[spec.name] === v ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)]' : 'border-slate-200'}`}
                    onClick={() => setSelected((s) => ({ ...s, [spec.name]: v }))}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-6 flex gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                useCartStore.getState().addItem({ id: product.id, name: product.title, image: product.image, price: product.price, originPrice: product.originPrice, skuText });
                onBuyNowToast('加入购物车成功');
              }}
            >
              加入购物车
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                useCartStore.getState().setBuyNowItem({ id: product.id, name: product.title, image: product.image, price: product.price, originPrice: product.originPrice, count: 1, selected: true, skuText });
                go('/checkout');
              }}
            >
              立即购买
            </Button>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <SectionTitle>图文详情</SectionTitle>
        <p className="text-sm text-slate-600">{product.description}</p>
      </Card>
      <Card className="p-4">
        <SectionTitle>评价预览</SectionTitle>
        <div className="space-y-3">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
              <p className="font-medium">{r.user} · ⭐ {r.rating}</p>
              <p className="mt-1 text-slate-600">{r.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}

function CartPage({ go }: { go: (x: string) => void }) {
  const { items, toggleSelect, toggleSelectAll, updateCount, removeItem, removeSelected } = useCartStore();
  const validItems = items.filter((x) => !x.invalid);
  const checkedItems = validItems.filter((x) => x.selected);
  const subtotal = checkedItems.reduce((s, i) => s + i.price * i.count, 0);
  const allChecked = !!validItems.length && checkedItems.length === validItems.length;

  return (
    <main className="mx-auto max-w-6xl p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle>购物车</SectionTitle>
        {!items.length ? <EmptyState title="购物车空空如也" desc="去首页逛逛吧" /> : null}
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className={`flex items-center gap-3 rounded-2xl p-3 ${i.invalid ? 'bg-slate-100 opacity-60' : 'bg-slate-50'}`}>
              <input type="checkbox" checked={i.selected} disabled={i.invalid} onChange={() => toggleSelect(i.id)} />
              <img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{i.name}</p>
                <p className="text-xs text-slate-500">{i.skuText || '默认规格'} {i.invalid ? '（已失效）' : ''}</p>
                <p className="text-sm text-[var(--color-brand)]">¥{i.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => updateCount(i.id, i.count - 1)}>-</Button>
                <span className="w-6 text-center text-sm">{i.count}</span>
                <Button size="sm" variant="secondary" onClick={() => updateCount(i.id, i.count + 1)}>+</Button>
              </div>
              <Button size="sm" variant="ghost" onClick={() => removeItem(i.id)}>删除</Button>
            </div>
          ))}
        </div>
        {items.length ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white p-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allChecked} onChange={(e) => toggleSelectAll(e.target.checked)} /> 全选</label>
            <Button variant="ghost" onClick={removeSelected}>删除选中</Button>
            <p className="text-sm">合计：<span className="text-lg font-bold text-[var(--color-brand)]">¥{subtotal.toFixed(2)}</span></p>
            <Button onClick={() => go('/checkout')} disabled={!checkedItems.length}>去结算</Button>
          </div>
        ) : null}
      </Card>
    </main>
  );
}

function CheckoutPage({ go }: { go: (x: string) => void }) {
  const { data: coupons = [] } = useCouponsQuery();
  const { data: addresses = [] } = useAddressesQuery();
  const checkout = useCheckoutMutation();
  const { items, buyNowItem, paymentMethod, setPaymentMethod } = useCartStore();

  const sourceItems = buyNowItem ? [buyNowItem] : items.filter((x) => x.selected && !x.invalid);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(addresses.find((x) => x.isDefault)?.id || '');
  const [remark, setRemark] = useState('');
  const shipping = sourceItems.length ? 8 : 0;
  const subtotal = sourceItems.reduce((s, i) => s + i.price * i.count, 0);
  const couponAmount = coupons.find((x) => x.id === selectedCoupon && subtotal >= x.minSpend)?.discount ?? 0;
  const total = Math.max(subtotal - couponAmount + shipping, 0);

  const submit = async () => {
    await checkout.mutateAsync({
      itemIds: sourceItems.map((x) => x.id),
      couponId: selectedCoupon || undefined,
      addressId: selectedAddress,
      paymentMethod,
      remark,
      shippingFee: shipping
    });
    useCartStore.getState().setBuyNowItem(undefined);
    useCartStore.getState().clear();
    go('/success');
  };

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle extra={<Button variant="ghost" onClick={() => go('/addresses')}>地址管理</Button>}>收货地址</SectionTitle>
        <select aria-label="收货地址" className="w-full rounded-xl border border-slate-200 px-3 py-2" value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
          <option value="">请选择地址</option>
          {addresses.map((a) => <option key={a.id} value={a.id}>{a.name} / {a.city} / {a.detail}</option>)}
        </select>
      </Card>

      <Card className="p-4">
        <SectionTitle>商品清单</SectionTitle>
        {sourceItems.map((i) => <p key={i.id} className="mb-2 text-sm">{i.name} x {i.count} <span className="text-slate-500">¥{(i.price * i.count).toFixed(2)}</span></p>)}
        {!sourceItems.length ? <EmptyState title="暂无可结算商品" /> : null}
      </Card>

      <Card className="p-4">
        <SectionTitle>优惠与备注</SectionTitle>
        <label className="text-sm">优惠券</label>
        <select aria-label="优惠券" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={selectedCoupon} onChange={(e) => setSelectedCoupon(e.target.value)}>
          <option value="">不使用</option>
          {coupons.map((c) => <option key={c.id} value={c.id}>{c.title}（满{c.minSpend}可用）</option>)}
        </select>
        <label className="mt-3 block text-sm">订单备注</label>
        <textarea value={remark} onChange={(e) => setRemark(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm" rows={3} placeholder="如：工作日送货" />
      </Card>

      <Card className="p-4">
        <SectionTitle>支付方式</SectionTitle>
        <div className="flex gap-2">
          {[
            ['alipay', '支付宝'],
            ['wechat', '微信支付'],
            ['card', '银行卡']
          ].map(([k, l]) => <Button key={k} variant={paymentMethod === k ? 'primary' : 'secondary'} onClick={() => setPaymentMethod(k as 'alipay' | 'wechat' | 'card')}>{l}</Button>)}
        </div>
      </Card>

      <Card className="p-4">
        <SectionTitle>价格明细</SectionTitle>
        <div className="space-y-1 text-sm">
          <p>商品小计：¥{subtotal.toFixed(2)}</p>
          <p>运费：¥{shipping.toFixed(2)}</p>
          <p>优惠：-¥{couponAmount.toFixed(2)}</p>
          <p className="text-lg font-bold text-[var(--color-brand)]">应付总额：¥{total.toFixed(2)}</p>
        </div>
        <Button className="mt-4 w-full" disabled={!sourceItems.length || !selectedAddress || checkout.isPending} onClick={submit}>{checkout.isPending ? '下单中...' : '提交订单'}</Button>
      </Card>
    </main>
  );
}

function SuccessPage({ go }: { go: (x: string) => void }) {
  return <main className="mx-auto max-w-6xl p-4"><Card className="p-8 text-center"><h2 className="text-2xl font-bold text-emerald-600">下单成功</h2><p className="mt-2 text-slate-500">订单已提交，商家正在处理。</p><div className="mt-6 flex justify-center gap-2"><Button onClick={() => go('/orders')}>查看订单</Button><Button variant="secondary" onClick={() => go('/')}>继续购物</Button></div></Card></main>;
}

function MePage({ go }: { go: (x: string) => void }) {
  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3 md:p-4">
      <Card className="p-4"><div className="flex items-center gap-3"><img src="https://picsum.photos/seed/avatar/120/120" className="h-14 w-14 rounded-full" /><div><p className="font-semibold">张三</p><p className="text-xs text-slate-500">PLUS 会员 · 成长值 3820</p></div></div></Card>
      <Card className="p-4"><SectionTitle>我的订单</SectionTitle><div className="grid grid-cols-4 gap-2 text-center text-sm">{orderTabs.slice(1).map((t) => <button key={t.key} className="rounded-xl bg-slate-50 py-3" onClick={() => go('/orders')}>{t.label}</button>)}</div></Card>
      <Card className="grid grid-cols-2 gap-2 p-4 md:grid-cols-4">{[
        ['我的收藏', '/favorites'],
        ['收货地址', '/addresses'],
        ['购物车', '/cart'],
        ['首页', '/']
      ].map(([name, url]) => <button key={name} className="rounded-xl bg-slate-50 py-3 text-sm" onClick={() => go(url)}>{name}</button>)}</Card>
    </main>
  );
}

function OrdersPage({ go }: { go: (x: string) => void }) {
  const [tab, setTab] = useState('all');
  const { data: orders = [] } = useOrdersQuery(tab);

  return (
    <main className="mx-auto max-w-6xl p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle extra={<Button variant="ghost" onClick={() => go('/me')}>返回个人中心</Button>}>我的订单</SectionTitle>
        <div className="mb-4 flex gap-2">{orderTabs.map((t) => <button key={t.key} className={`rounded-xl px-3 py-1 text-sm ${tab === t.key ? 'bg-slate-900 text-white' : 'bg-slate-100'}`} onClick={() => setTab(t.key)}>{t.label}</button>)}</div>
        <div className="space-y-3">{orders.map((o) => <div key={o.id} className="rounded-2xl border border-slate-100 p-3 text-sm"><div className="flex justify-between"><span>订单号 {o.id}</span><span>{o.status}</span></div><div className="mt-1 flex justify-between text-slate-500"><span>{o.createdAt}</span><span>{o.itemCount} 件 · ¥{o.amount}</span></div></div>)}</div>
      </Card>
    </main>
  );
}

function FavoritesPage({ go, products }: { go: (x: string) => void; products: any[] }) {
  const { favorites } = useCartStore();
  const list = products.filter((p) => favorites.includes(p.id));
  return <main className="mx-auto max-w-6xl p-3 md:p-4"><Card className="p-4"><SectionTitle extra={<Button variant="ghost" onClick={() => go('/me')}>返回</Button>}>我的收藏</SectionTitle>{!list.length ? <EmptyState title="暂无收藏商品" /> : <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{list.map((p) => <button key={p.id} onClick={() => go(`/product/${p.id}`)}><ProductCard title={p.title} price={p.price} image={p.image} tags={p.tags} rating={p.rating} soldCount={p.soldCount} originPrice={p.originPrice} /></button>)}</div>}</Card></main>;
}

function AddressesPage() {
  const { data: addresses = [] } = useAddressesQuery();
  return <main className="mx-auto max-w-6xl p-3 md:p-4"><Card className="p-4"><SectionTitle>收货地址管理</SectionTitle><div className="space-y-3">{addresses.map((a) => <div key={a.id} className="rounded-2xl border border-slate-100 p-3 text-sm"><p className="font-medium">{a.name} {a.phone} {a.isDefault ? <Tag tone="success">默认</Tag> : null}</p><p className="mt-1 text-slate-500">{a.city} {a.detail}</p></div>)}</div></Card></main>;
}
