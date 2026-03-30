import {
  useAddressesQuery,
  useCampaignDetailQuery,
  useCheckoutMutation,
  useCouponsQuery,
  useFootprintsQuery,
  useHomeQuery,
  useNotificationsQuery,
  useOrdersQuery,
  useProductDetailQuery,
  useProductsQuery,
  useReviewsQuery,
  type Address
} from '@mall/api-client';
import { useCartStore } from '@mall/store';
import { Button, Card, EmptyState, ProductCard, SectionTitle, Skeleton, Tag } from '@mall/ui';
import { useEffect, useMemo, useState } from 'react';
import {
  buildReviewChunks,
  filterAndSortProducts,
  filterNotificationsList,
  filterOrderList,
  getOrderStatusMeta,
  getReviewStats,
  paginateItems
} from './list-utils';

const categoryOptions = [
  { label: '全部', value: 'all' },
  { label: '服饰', value: 'fashion' },
  { label: '数码', value: 'digital' },
  { label: '家居', value: 'home' },
  { label: '食品', value: 'food' }
] as const;

const sortOptions = [
  { label: '智能推荐', value: 'smart' },
  { label: '销量优先', value: 'sold' },
  { label: '评分优先', value: 'rating' },
  { label: '价格升序', value: 'price-asc' },
  { label: '价格降序', value: 'price-desc' }
] as const;

const orderTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'shipping', label: '待发货' },
  { key: 'done', label: '已完成' },
  { key: 'out_of_stock', label: '缺货异常' },
  { key: 'cancelled', label: '已取消' },
  { key: 'refund_processing', label: '退款中' }
] as const;

const categories = ['潮流服饰', '数码好物', '居家精选', '食品生鲜', '美妆个护', '运动户外', '母婴亲子', '百货日用'];
const quickFeeds = ['会员日每周三满199减30', '开学季数码会场最高12期免息', '晚8点秒杀专场已开启，库存告急'];
const serviceEntries = ['售后进度', '退款管理', '发票助手', '在线客服', '会员权益', '隐私设置'];

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
  const { data: notifications = [] } = useNotificationsQuery();
  const { favorites, toggleFavorite } = useCartStore();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<(typeof categoryOptions)[number]['value']>('all');
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]['value']>('smart');
  const [productPage, setProductPage] = useState(1);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [toast, setToast] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparePanel, setShowComparePanel] = useState(false);
  const [productListLoading, setProductListLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!home?.banners?.length) return;
    const timer = setInterval(() => setBannerIndex((v) => (v + 1) % home.banners.length), 3200);
    return () => clearInterval(timer);
  }, [home?.banners?.length]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 1600);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => filterAndSortProducts(products, keyword, category, sortBy), [products, keyword, category, sortBy]);
  const paginatedProducts = useMemo(() => paginateItems(filteredProducts, productPage, 16), [filteredProducts, productPage]);
  const hasActiveProductFilters = keyword.trim() || category !== 'all' || sortBy !== 'smart';
  const isSingleProductResult = paginatedProducts.total <= 1;

  useEffect(() => {
    setProductPage(1);
    if (!productsLoading) {
      setProductListLoading(true);
      const timer = setTimeout(() => setProductListLoading(false), 260);
      return () => clearTimeout(timer);
    }
  }, [keyword, category, sortBy, productsLoading]);

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((x) => x !== id);
        if (!next.length) setShowComparePanel(false);
        return next;
      }
      const next = [...prev, id];
      setShowComparePanel(true);
      return next;
    });
  };

  const onAddCart = (p: (typeof products)[number]) => {
    useCartStore.getState().addItem({ id: p.id, name: p.title, image: p.image, price: p.price, originPrice: p.originPrice });
    setToast('已加入购物车');
  };

  const loadMoreProducts = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setProductPage((p) => p + 1);
      setLoadingMore(false);
    }, 320);
  };

  const resetProductFilters = () => {
    setKeyword('');
    setCategory('all');
    setSortBy('smart');
    setProductPage(1);
    setToast('已恢复全量商品');
  };

  const unreadCount = notifications.filter((x) => !x.read).length;

  const Header = (
    <header className="sticky top-0 z-10 mb-4 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 p-3 md:gap-3 md:p-4">
        <button className="text-sm font-bold text-[var(--color-brand)] md:text-base" onClick={() => go('/')}>
          Mall SuperApp
        </button>
        {path === '/' ? (
          <div className="order-3 flex w-full items-center gap-2 md:order-none md:flex-1">
            <input
              aria-label="搜索商品"
              className="h-10 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[var(--color-brand)] focus:bg-white"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索商品、品牌、品类"
            />
            <Button size="sm" onClick={() => { setKeyword((v) => v.trim()); setToast('已按关键词筛选'); }}>搜索</Button>
          </div>
        ) : null}
        <div className="ml-auto hidden items-center gap-1.5 md:flex md:gap-2">
          <Button size="sm" variant="secondary" onClick={() => go('/notifications')}>
            消息{unreadCount ? `(${unreadCount})` : ''}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => go('/cart')}>
            购物车
          </Button>
          <Button size="sm" variant="secondary" onClick={() => go('/me')}>
            我的
          </Button>
        </div>
      </div>
    </header>
  );

  if (path.startsWith('/product/')) {
    return (
      <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}>
        <ProductDetailPage id={path.replace('/product/', '')} go={go} onBuyNowToast={setToast} onToggleCompare={toggleCompare} compareIds={compareIds} products={products} />
      </PageWrap>
    );
  }
  if (path === '/cart') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><CartPage go={go} /></PageWrap>;
  if (path === '/checkout') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><CheckoutPage go={go} /></PageWrap>;
  if (path === '/success') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><SuccessPage go={go} /></PageWrap>;
  if (path === '/orders') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><OrdersPage go={go} /></PageWrap>;
  if (path === '/favorites') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><FavoritesPage go={go} products={products} /></PageWrap>;
  if (path === '/addresses') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><AddressesPage go={go} /></PageWrap>;
  if (path === '/notifications') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><NotificationsPage go={go} /></PageWrap>;
  if (path === '/footprints') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><FootprintsPage go={go} products={products} /></PageWrap>;
  if (path === '/me') return <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}><MePage go={go} /></PageWrap>;

  return (
    <PageWrap header={Header} toast={toast} path={path} go={go} unreadCount={unreadCount}>
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

        <Card className="p-4">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">站内快讯</p>
              <p className="mt-1 text-sm font-medium">{quickFeeds[bannerIndex % quickFeeds.length]}</p>
              <p className="mt-2 text-xs text-slate-500">今日下单转化率 +12.8% · 客单价 ¥268</p>
            </div>
            {(home?.newcomer || []).slice(0, 1).map((x) => (
              <div key={x.id} className="rounded-2xl bg-[var(--color-brand-soft)] p-3">
                <p className="text-xs text-slate-500">新人权益</p>
                <p className="mt-1 text-sm font-semibold">{x.title}</p>
                <p className="text-xs text-slate-500">{x.perk}</p>
              </div>
            ))}
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <p className="text-xs text-slate-300">会员专享</p>
              <p className="mt-1 text-sm font-semibold">PLUS 会员 95 折 + 极速退款</p>
              <Button size="sm" className="mt-2">立即开通</Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Card className="p-4">
            <SectionTitle>活动专区</SectionTitle>
            <div className="grid gap-2 md:grid-cols-3">
              {(home?.activities || []).map((x) => (
                <ActivityCard key={x.id} id={x.id} title={x.title} desc={x.desc} badge={x.badge} />
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
              <div key={x} className="rounded-2xl bg-slate-50 py-3 text-center text-xs transition hover:bg-slate-100 md:text-sm">{x}</div>
            ))}
          </div>
        </Card>

        <div>
          <Card className="p-4">
            <SectionTitle extra={<Tag tone="success">新人专区</Tag>}>精选商品</SectionTitle>
          <div className="mb-3 space-y-2">
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  className={`rounded-xl px-3 py-1 text-sm transition ${category === option.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => setCategory(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">排序</span>
              <select
                aria-label="智能排序"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as (typeof sortOptions)[number]['value'])}
                className="h-9 flex-1 rounded-xl border border-slate-200 px-3 py-1 text-sm md:ml-auto md:max-w-[220px]"
              >
                {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          {productsLoading || productListLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64" />)}</div>
          ) : isError ? (
            <EmptyState title="商品加载失败" desc="请稍后重试" tone="error" />
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">分类：{categoryOptions.find((x) => x.value === category)?.label}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">排序：{sortOptions.find((x) => x.value === sortBy)?.label}</span>
                {keyword ? <span className="rounded-full bg-orange-50 px-2 py-1 text-orange-700">关键词：{keyword}</span> : null}
                <span className="ml-auto text-slate-500">共 {paginatedProducts.total} 件，当前已展示 {paginatedProducts.showing} 件</span>
              </div>
              {hasActiveProductFilters ? (
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700">
                  <span className="font-semibold">当前筛选已生效</span>
                  <span>· 结果 {filteredProducts.length} / 全部 {products.length}</span>
                  <Button size="sm" variant="ghost" className="ml-auto border border-orange-200 bg-white text-orange-700 hover:bg-orange-100" onClick={resetProductFilters}>
                    一键清空筛选
                  </Button>
                </div>
              ) : null}
              {isSingleProductResult ? (
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-700">
                  <span className="font-semibold">当前仅展示 1 件商品</span>
                  <span>可一键恢复默认筛选并查看全部。</span>
                  <Button size="sm" variant="ghost" className="ml-auto border border-sky-200 bg-white text-sky-700 hover:bg-sky-100" onClick={resetProductFilters}>
                    显示全部商品
                  </Button>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {paginatedProducts.visible.map((p) => (
                  <div key={p.id} className="rounded-3xl border border-transparent p-1 transition hover:border-slate-200">
                    <button className="w-full text-left" onClick={() => go(`/product/${p.id}`)}>
                      <ProductCard
                        title={p.title}
                        price={p.price}
                        originPrice={p.originPrice}
                        image={p.image}
                        tags={[...(p.tags || []), ...((p as any).promoTags || [])]}
                        rating={p.rating}
                        soldCount={p.soldCount}
                      />
                    </button>
                    <div className="mt-2 flex gap-2">
                      <Button className="flex-1" onClick={() => onAddCart(p)}>加入购物车</Button>
                      <Button variant="secondary" className="w-10 px-0" onClick={() => toggleFavorite(p.id)}>
                        <span className="text-base leading-none">{favorites.includes(p.id) ? '♥' : '♡'}</span>
                      </Button>
                    </div>
                    <button className="mt-2 w-full rounded-xl bg-slate-100 py-1 text-xs text-slate-600 hover:bg-slate-200" onClick={() => toggleCompare(p.id)}>
                      {compareIds.includes(p.id) ? '取消对比' : '加入对比'}
                    </button>
                  </div>
                ))}
              </div>
              {paginatedProducts.hasMore ? (
                <div className="mt-4 text-center">
                  <Button variant="secondary" onClick={loadMoreProducts} disabled={loadingMore}>{loadingMore ? '加载中...' : `加载更多（剩余 ${paginatedProducts.total - paginatedProducts.showing}）`}</Button>
                </div>
              ) : null}
            </>
          )}
          </Card>
        </div>

        {compareProducts.length ? (
          <>
            <button
              className="fixed bottom-24 right-4 z-30 rounded-full border border-[var(--color-brand)] bg-white px-3 py-2 text-xs text-[var(--color-brand)] shadow-[var(--shadow-sm)] md:bottom-24"
              onClick={() => setShowComparePanel((v) => !v)}
            >
              {showComparePanel ? '收起对比' : `商品对比 (${compareProducts.length})`}
            </button>
            {showComparePanel ? (
              <div className="fixed inset-x-2 bottom-36 z-20 max-h-[42vh] overflow-auto rounded-3xl bg-white shadow-[var(--shadow-md)] md:inset-x-auto md:bottom-24 md:right-4 md:w-[680px]">
                <ComparePanel products={compareProducts} onToggleCompare={toggleCompare} />
              </div>
            ) : null}
          </>
        ) : null}

        <button
          className="fixed bottom-14 right-4 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs shadow-[var(--shadow-sm)] md:bottom-8"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          回到顶部 ↑
        </button>
      </main>
    </PageWrap>
  );
}

function PageWrap({
  header,
  toast,
  children,
  path,
  go,
  unreadCount
}: {
  header: React.ReactNode;
  toast: string;
  children: React.ReactNode;
  path: string;
  go: (x: string) => void;
  unreadCount: number;
}) {
  return (
    <div>
      {header}
      <div className="pb-20 md:pb-0">{children}</div>
      <BottomTabBar path={path} go={go} unreadCount={unreadCount} />
      {toast ? <div className="fixed bottom-36 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs text-white md:bottom-8">{toast}</div> : null}
    </div>
  );
}

function BottomTabBar({ path, go, unreadCount }: { path: string; go: (x: string) => void; unreadCount: number }) {
  const activeKey = path.startsWith('/cart') || path.startsWith('/checkout')
    ? 'cart'
    : path.startsWith('/notifications')
      ? 'notifications'
      : path.startsWith('/orders')
        ? 'orders'
        : path.startsWith('/me') || path.startsWith('/favorites') || path.startsWith('/addresses') || path.startsWith('/footprints')
          ? 'me'
          : 'home';

  const items = [
    { key: 'home', label: '首页', icon: '🏠', to: '/' },
    { key: 'notifications', label: '消息', icon: '🔔', to: '/notifications' },
    { key: 'cart', label: '购物车', icon: '🛒', to: '/cart' },
    { key: 'orders', label: '订单', icon: '📦', to: '/orders' },
    { key: 'me', label: '我的', icon: '👤', to: '/me' }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-1 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-5 gap-1">
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <button
              key={item.key}
              className={`relative rounded-xl px-1 py-2 text-center text-xs ${active ? 'bg-[var(--color-brand-soft)] font-semibold text-[var(--color-brand)]' : 'text-slate-500'}`}
              onClick={() => go(item.to)}
            >
              <div>{item.icon}</div>
              <div className="mt-0.5">{item.label}</div>
              {item.key === 'notifications' && unreadCount > 0 ? <span className="absolute right-3 top-1 rounded-full bg-rose-500 px-1 text-[10px] text-white">{unreadCount}</span> : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ActivityCard({ id, title, desc, badge }: { id: string; title: string; desc: string; badge: string }) {
  const { data, isLoading } = useCampaignDetailQuery(id);
  return (
    <details className="group rounded-2xl bg-[var(--color-brand-soft)] p-3 transition open:bg-orange-50">
      <summary className="cursor-pointer list-none">
        <Tag tone="hot">{badge}</Tag>
        <p className="mt-2 text-sm font-semibold">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </summary>
      <div className="mt-3 rounded-xl bg-white/80 p-3 text-xs text-slate-600">
        {isLoading ? <Skeleton className="h-14" /> : (
          <>
            <p className="font-medium text-slate-800">活动时间：{data?.period}</p>
            <p className="mt-1">{data?.desc}</p>
            <ul className="mt-2 list-disc pl-5">
              {(data?.rules || []).slice(0, 2).map((r) => <li key={r}>{r}</li>)}
            </ul>
          </>
        )}
      </div>
    </details>
  );
}

function ComparePanel({ products, onToggleCompare }: { products: any[]; onToggleCompare: (id: string) => void }) {
  return (
    <Card className="p-4">
      <SectionTitle extra={<Tag tone="default">已选 {products.length} 件</Tag>}>商品对比</SectionTitle>
      <div className="overflow-x-auto">
        <table className="min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="min-w-[92px] p-2">维度</th>
              {products.map((p) => <th key={p.id} className="min-w-[180px] p-2">{p.title}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-2 text-slate-500">价格</td>{products.map((p) => <td key={p.id} className="p-2 font-semibold text-[var(--color-brand)]">¥{p.price}</td>)}</tr>
            <tr className="border-b border-slate-100"><td className="p-2 text-slate-500">评分</td>{products.map((p) => <td key={p.id} className="p-2">{p.rating || '-'}</td>)}</tr>
            <tr className="border-b border-slate-100"><td className="p-2 text-slate-500">销量</td>{products.map((p) => <td key={p.id} className="p-2">{p.soldCount || '-'}</td>)}</tr>
            <tr><td className="p-2 text-slate-500">操作</td>{products.map((p) => <td key={p.id} className="p-2"><Button size="sm" variant="ghost" onClick={() => onToggleCompare(p.id)}>移除</Button></td>)}</tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ProductDetailPage({
  id,
  go,
  onBuyNowToast,
  onToggleCompare,
  compareIds,
  products
}: {
  id: string;
  go: (path: string) => void;
  onBuyNowToast: (x: string) => void;
  onToggleCompare: (id: string) => void;
  compareIds: string[];
  products: any[];
}) {
  const { data: product } = useProductDetailQuery(id);
  const { data: reviews = [] } = useReviewsQuery(id);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState('');
  const [reviewTab, setReviewTab] = useState<'all' | 'withPic' | 'low'>('all');
  const [reviewPage, setReviewPage] = useState(1);

  if (!product) return <div className="mx-auto max-w-6xl p-4"><Skeleton className="h-96" /></div>;

  const skuText = Object.entries(selected).map(([k, v]) => `${k}:${v}`).join(' / ');
  const allSpecSelected = (product.specs || []).every((spec) => selected[spec.name]);
  const images = product.images?.length ? product.images : [product.image];
  const activeImage = previewImage || images[0];
  const reviewData = buildReviewChunks(reviews, reviewTab, 12);
  const reviewStats = getReviewStats(reviews);
  const filteredReviews = reviewData.chunk(reviewPage);
  const recommendProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3 md:p-4">
      <Button size="sm" variant="ghost" className="border border-slate-200 bg-white" onClick={() => window.history.length > 1 ? window.history.back() : go('/')}>← 返回</Button>
      <Card className="grid gap-4 p-4 md:grid-cols-2">
        <div>
          <img src={activeImage} alt={product.title} className="h-72 w-full rounded-2xl object-cover md:h-[420px]" />
          <div className="mt-2 flex gap-2 overflow-auto">
            {images.map((img) => (
              <button key={img} onClick={() => setPreviewImage(img)} className={`overflow-hidden rounded-xl border ${activeImage === img ? 'border-[var(--color-brand)]' : 'border-slate-200'}`}>
                <img src={img} alt="预览图" className="h-14 w-14 object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{product.subtitle}</p>
          <p className="mt-1 text-xs text-slate-400">品牌：{product.brand || 'Mall Select'} · 评价 {product.reviewCount || reviews.length}</p>
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
          {(product.specs || []).length > 0 && !allSpecSelected ? <p className="mt-2 text-xs text-rose-500">请先选择完整规格后再下单</p> : null}
          <div className="mt-3">
            <Button size="sm" variant="secondary" onClick={() => onToggleCompare(product.id)}>
              {compareIds.includes(product.id) ? '取消对比' : '加入对比'}
            </Button>
          </div>
          <div className="mt-6 flex gap-2">
            <Button
              className="flex-1"
              disabled={(product.specs || []).length > 0 && !allSpecSelected}
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
              disabled={(product.specs || []).length > 0 && !allSpecSelected}
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
        <SectionTitle extra={<p className="text-sm text-amber-600">好评率 {reviewStats.total ? Math.round((reviewStats.positive / reviewStats.total) * 100) : 0}%</p>}>评价预览</SectionTitle>
        <div className="mb-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">好评 {reviewStats.positive}</div>
          <div className="rounded-xl bg-amber-50 p-2 text-amber-700">中评 {reviewStats.neutral}</div>
          <div className="rounded-xl bg-rose-50 p-2 text-rose-700">差评 {reviewStats.negative}</div>
          <div className="rounded-xl bg-sky-50 p-2 text-sky-700">有图/追评占比 {reviewStats.mediaRatio}%</div>
        </div>
        <div className="mb-3 flex gap-2">
          <Button size="sm" variant={reviewTab === 'all' ? 'primary' : 'secondary'} onClick={() => { setReviewTab('all'); setReviewPage(1); }}>全部({reviewData.filtered.length})</Button>
          <Button size="sm" variant={reviewTab === 'withPic' ? 'primary' : 'secondary'} onClick={() => { setReviewTab('withPic'); setReviewPage(1); }}>有图/追评</Button>
          <Button size="sm" variant={reviewTab === 'low' ? 'primary' : 'secondary'} onClick={() => { setReviewTab('low'); setReviewPage(1); }}>低分评价</Button>
        </div>
        <div className="space-y-3">
          {filteredReviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
              <p className="font-medium">{r.user} · ⭐ {r.rating}</p>
              <p className="mt-1 text-slate-600">{r.content}</p>
              {r.images?.length ? <p className="mt-1 text-xs text-slate-500">📷 晒图 {r.images.length} 张</p> : null}
              {r.appendComment ? <p className="mt-1 rounded-xl bg-white p-2 text-xs text-slate-500">追评：{r.appendComment}</p> : null}
            </div>
          ))}
          {!filteredReviews.length ? <EmptyState title="暂无匹配评价" desc="换个筛选试试" /> : null}
          <p className="text-center text-xs text-slate-500">已显示 {reviewData.showing(reviewPage)} / {reviewData.filtered.length} 条</p>
          {reviewData.hasMore(reviewPage) ? <div className="text-center"><Button size="sm" variant="secondary" onClick={() => setReviewPage((p) => p + 1)}>加载更多评价</Button></div> : null}
          {reviewPage > 1 && !reviewData.hasMore(reviewPage) ? <div className="text-center"><Button size="sm" variant="ghost" onClick={() => setReviewPage(1)}>收起到首屏</Button></div> : null}
        </div>
      </Card>
      <Card className="p-4">
        <SectionTitle>为你推荐</SectionTitle>
        {!recommendProducts.length ? <EmptyState title="推荐生成中" desc="继续浏览获取更精准推荐" /> : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {recommendProducts.map((p) => (
              <button key={p.id} className="text-left" onClick={() => go(`/product/${p.id}`)}>
                <ProductCard title={p.title} price={p.price} image={p.image} tags={p.tags} rating={p.rating} soldCount={p.soldCount} originPrice={p.originPrice} />
              </button>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}

function CartPage({ go }: { go: (x: string) => void }) {
  const { items, toggleSelect, toggleSelectAll, updateCount, removeItem, removeSelected } = useCartStore();
  const validItems = items.filter((x) => !x.invalid);
  const invalidItems = items.filter((x) => x.invalid);
  const checkedItems = validItems.filter((x) => x.selected);
  const subtotal = checkedItems.reduce((s, i) => s + i.price * i.count, 0);
  const allChecked = !!validItems.length && checkedItems.length === validItems.length;

  return (
    <main className="mx-auto max-w-6xl p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle extra={<Button size="sm" variant="ghost" onClick={() => go('/me')}>返回</Button>}>购物车</SectionTitle>
        {!items.length ? <EmptyState title="购物车空空如也" desc="去首页逛逛吧" /> : null}
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className={`rounded-2xl p-3 ${i.invalid ? 'bg-slate-100 opacity-60' : 'bg-slate-50'}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" checked={i.selected} disabled={i.invalid} onChange={() => toggleSelect(i.id)} />
                <img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-slate-500">{i.skuText || '默认规格'} {i.invalid ? '（已失效）' : ''}</p>
                  <p className="text-sm text-[var(--color-brand)]">¥{i.price}</p>
                  {i.count >= 99 ? <p className="text-xs text-amber-600">单品最多购买 99 件</p> : null}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => updateCount(i.id, i.count - 1)}>-</Button>
                  <span className="w-6 text-center text-sm">{i.count}</span>
                  <Button size="sm" variant="secondary" disabled={i.count >= 99} onClick={() => updateCount(i.id, i.count + 1)}>+</Button>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeItem(i.id)}>删除</Button>
              </div>
            </div>
          ))}
        </div>
        {items.length ? (
          <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allChecked} onChange={(e) => toggleSelectAll(e.target.checked)} /> 全选</label>
              <p className="text-sm">合计：<span className="text-lg font-bold text-[var(--color-brand)]">¥{subtotal.toFixed(2)}</span></p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" onClick={removeSelected}>删除选中</Button>
              {invalidItems.length ? <Button variant="ghost" onClick={() => invalidItems.forEach((x) => removeItem(x.id))}>清理失效商品</Button> : null}
              <Button className="ml-auto" onClick={() => go('/checkout')} disabled={!checkedItems.length}>去结算</Button>
            </div>
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
  const [localAddresses, setLocalAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', city: '', detail: '', tag: '家' });
  const [showCheckoutAddressForm, setShowCheckoutAddressForm] = useState(false);
  const [remark, setRemark] = useState('');
  const [needInvoice, setNeedInvoice] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'personal' | 'company'>('personal');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [invoiceTaxNo, setInvoiceTaxNo] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!addresses.length) return;
    setLocalAddresses((prev) => (prev.length ? prev : addresses));
    setSelectedAddress((prev) => {
      if (prev && addresses.some((x) => x.id === prev)) return prev;
      return addresses.find((x) => x.isDefault)?.id || addresses[0]?.id || '';
    });
  }, [addresses]);

  const activeAddresses = localAddresses.length ? localAddresses : addresses;
  const selectedAddressInfo = activeAddresses.find((x) => x.id === selectedAddress);

  const saveAddress = () => {
    if (!addressForm.name.trim() || !addressForm.phone.trim() || !addressForm.city.trim() || !addressForm.detail.trim()) {
      setSubmitError('请完善收货人、手机号、城市和详细地址');
      return;
    }
    const next: Address = {
      id: `local-${Date.now()}`,
      name: `${addressForm.name.trim()} · ${addressForm.tag}`,
      phone: addressForm.phone.trim(),
      city: addressForm.city.trim(),
      detail: addressForm.detail.trim(),
      isDefault: !activeAddresses.length
    };
    setLocalAddresses((prev) => {
      const merged = [next, ...prev.map((x) => ({ ...x, isDefault: false }))];
      return merged;
    });
    setSelectedAddress(next.id);
    setAddressForm({ name: '', phone: '', city: '', detail: '', tag: '家' });
    setShowCheckoutAddressForm(false);
    setSubmitError('');
  };

  const shipping = sourceItems.length ? 8 : 0;
  const subtotal = sourceItems.reduce((s, i) => s + i.price * i.count, 0);
  const couponAmount = coupons.find((x) => x.id === selectedCoupon && subtotal >= x.minSpend)?.discount ?? 0;
  const total = Math.max(subtotal - couponAmount + shipping, 0);

  const submit = async () => {
    if (!selectedAddress) return setSubmitError('请选择收货地址');
    if (needInvoice && !invoiceTitle.trim()) return setSubmitError('请完善发票抬头');
    if (needInvoice && invoiceType === 'company' && !invoiceTaxNo.trim()) return setSubmitError('请填写企业税号');
    if (!acceptedTerms) return setSubmitError('请先勾选并同意《交易条款》');

    setSubmitError('');
    await checkout.mutateAsync({
      itemIds: sourceItems.map((x) => x.id),
      couponId: selectedCoupon || undefined,
      addressId: selectedAddress,
      paymentMethod,
      remark,
      shippingFee: shipping,
      invoice: {
        needInvoice,
        type: needInvoice ? invoiceType : undefined,
        title: needInvoice ? invoiceTitle : undefined,
        taxNo: needInvoice && invoiceType === 'company' ? invoiceTaxNo : undefined
      }
    });
    useCartStore.getState().setBuyNowItem(undefined);
    useCartStore.getState().clear();
    go('/success');
  };

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle extra={<Button size="sm" variant="ghost" onClick={() => go('/addresses')}>地址管理</Button>}>收货地址</SectionTitle>
        {!activeAddresses.length ? <EmptyState title="暂无地址" desc="请先新增收货地址" /> : null}
        <div className="space-y-2">
          {activeAddresses.map((a) => (
            <button
              key={a.id}
              className={`w-full rounded-2xl border p-3 text-left transition ${selectedAddress === a.id ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)]' : 'border-slate-100 bg-slate-50'}`}
              onClick={() => setSelectedAddress(a.id)}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-800">{a.name}</p>
                {a.isDefault ? <Tag tone="success">默认</Tag> : null}
              </div>
              <p className="mt-1 text-sm text-slate-600">{a.phone}</p>
              <p className="mt-1 text-xs text-slate-500">{a.city} {a.detail}</p>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <Button size="sm" variant="secondary" onClick={() => setShowCheckoutAddressForm(true)}>+ 新增收货地址</Button>
        </div>
        {selectedAddressInfo ? <p className="mt-2 text-xs text-slate-500">当前配送：{selectedAddressInfo.city} {selectedAddressInfo.detail}</p> : null}
        {!selectedAddress ? <p className="mt-2 text-xs text-rose-500">未选择地址将无法提交订单</p> : null}
      </Card>

      {showCheckoutAddressForm ? (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40 md:items-center md:justify-center">
          <div className="w-full rounded-t-3xl bg-white p-4 md:max-w-2xl md:rounded-3xl">
            <SectionTitle extra={<Button size="sm" variant="ghost" onClick={() => setShowCheckoutAddressForm(false)}>关闭</Button>}>新增收货地址</SectionTitle>
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <input className="rounded-xl border border-slate-200 bg-white px-3 py-2" placeholder="收货人" value={addressForm.name} onChange={(e) => setAddressForm((p) => ({ ...p, name: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 bg-white px-3 py-2" placeholder="手机号" value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 bg-white px-3 py-2" placeholder="城市（如 上海 浦东）" value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 bg-white px-3 py-2" placeholder="详细地址（门牌号）" value={addressForm.detail} onChange={(e) => setAddressForm((p) => ({ ...p, detail: e.target.value }))} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['家', '公司', '学校'].map((tag) => (
                <Button key={tag} size="sm" variant={addressForm.tag === tag ? 'primary' : 'secondary'} onClick={() => setAddressForm((p) => ({ ...p, tag }))}>{tag}</Button>
              ))}
              <Button size="sm" className="ml-auto" onClick={saveAddress}>保存地址</Button>
            </div>
          </div>
        </div>
      ) : null}

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
        <SectionTitle>发票信息</SectionTitle>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={needInvoice} onChange={(e) => setNeedInvoice(e.target.checked)} /> 需要发票</label>
        {needInvoice ? (
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex gap-2">
              <Button size="sm" variant={invoiceType === 'personal' ? 'primary' : 'secondary'} onClick={() => setInvoiceType('personal')}>个人</Button>
              <Button size="sm" variant={invoiceType === 'company' ? 'primary' : 'secondary'} onClick={() => setInvoiceType('company')}>企业</Button>
            </div>
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder={invoiceType === 'company' ? '公司抬头' : '个人姓名'} value={invoiceTitle} onChange={(e) => setInvoiceTitle(e.target.value)} />
            {invoiceType === 'company' ? <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="税号" value={invoiceTaxNo} onChange={(e) => setInvoiceTaxNo(e.target.value)} /> : null}
          </div>
        ) : null}
      </Card>

      <Card className="p-4">
        <SectionTitle>支付方式</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
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
        <label className="mt-3 flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} /> 我已阅读并同意《交易条款》与《隐私政策》</label>
        {submitError ? <p className="mt-2 text-xs text-rose-500">{submitError}</p> : null}
        <Button className="mt-4 w-full" disabled={!sourceItems.length || checkout.isPending} onClick={submit}>{checkout.isPending ? '下单中...' : '提交订单'}</Button>
      </Card>
    </main>
  );
}

function SuccessPage({ go }: { go: (x: string) => void }) {
  return <main className="mx-auto max-w-6xl p-4"><Card className="p-8 text-center"><h2 className="text-2xl font-bold text-emerald-600">下单成功</h2><p className="mt-2 text-slate-500">订单已提交，商家正在处理。</p><div className="mt-6 flex justify-center gap-2"><Button onClick={() => go('/orders')}>查看订单</Button><Button variant="secondary" onClick={() => go('/')}>继续购物</Button></div></Card></main>;
}

function MePage({ go }: { go: (x: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ nickname: '张三', phone: '138****8888', bio: '热爱品质生活与数码好物' });
  const { data: orders = [] } = useOrdersQuery();

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3 md:p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><img src="https://picsum.photos/seed/avatar/120/120" className="h-14 w-14 rounded-full" /><div><p className="font-semibold">{profile.nickname}</p><p className="text-xs text-slate-500">{profile.phone} · PLUS 会员 · 成长值 3820</p></div></div>
          <Button size="sm" variant={editing ? 'primary' : 'ghost'} className={editing ? '' : 'border border-slate-200 bg-white'} onClick={() => setEditing((x) => !x)}>{editing ? '完成编辑' : '编辑资料'}</Button>
        </div>
        {editing ? <div className="mt-3 grid gap-2 text-sm md:grid-cols-2"><input className="rounded-xl border border-slate-200 px-3 py-2" value={profile.nickname} onChange={(e) => setProfile((p) => ({ ...p, nickname: e.target.value }))} /><input className="rounded-xl border border-slate-200 px-3 py-2" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} /><input className="rounded-xl border border-slate-200 px-3 py-2 md:col-span-2" value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} /></div> : <p className="mt-2 text-xs text-slate-500">{profile.bio}</p>}
      </Card>
      <Card className="p-4">
        <SectionTitle extra={<div className="flex items-center gap-2"><span className="text-xs text-slate-500">最近 {orders.length} 条</span><Button size="sm" variant="ghost" className="border border-slate-200 bg-white" onClick={() => go('/orders')}>查看全部</Button></div>}>我的订单</SectionTitle>
        <div className="grid grid-cols-2 gap-2 text-center text-sm md:grid-cols-4">
          {orderTabs.slice(1).map((t) => {
            const count = orders.filter((o) => t.key === 'all' || o.status === t.key).length;
            return <button key={t.key} className="rounded-xl bg-slate-50 py-3" onClick={() => go('/orders')}>{t.label}<span className="ml-1 text-xs text-slate-500">{count}</span></button>;
          })}
        </div>
      </Card>
      <Card className="p-4">
        <SectionTitle>服务中心</SectionTitle>
        <div className="grid grid-cols-3 gap-2 text-center text-sm md:grid-cols-6">{serviceEntries.map((name) => <button key={name} className="rounded-xl bg-slate-50 py-3">{name}</button>)}</div>
      </Card>
      <Card className="grid grid-cols-2 gap-2 p-4 md:grid-cols-4">{[
        ['我的收藏', '/favorites'],
        ['收货地址', '/addresses'],
        ['消息中心', '/notifications'],
        ['浏览足迹', '/footprints'],
        ['购物车', '/cart'],
        ['首页', '/']
      ].map(([name, url]) => <button key={name} className="rounded-xl bg-slate-50 py-3 text-sm" onClick={() => go(url)}>{name}</button>)}</Card>
    </main>
  );
}

function OrdersPage({ go }: { go: (x: string) => void }) {
  const [tab, setTab] = useState('all');
  const [keyword, setKeyword] = useState('');
  const { data: orders = [], isError } = useOrdersQuery();
  const [serviceApplyId, setServiceApplyId] = useState('');
  const [serviceReason, setServiceReason] = useState('');
  const list = filterOrderList(orders, keyword, tab);

  return (
    <main className="mx-auto max-w-6xl p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle extra={<Button variant="ghost" onClick={() => go('/me')}>返回个人中心</Button>}>我的订单</SectionTitle>
        <input aria-label="搜索订单" className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="搜索订单号/状态" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <div className="mb-3 flex flex-wrap gap-2">{orderTabs.map((t) => <button key={t.key} className={`rounded-xl px-3 py-1 text-sm ${tab === t.key ? 'bg-slate-900 text-white' : 'bg-slate-100'}`} onClick={() => setTab(t.key)}>{t.label}</button>)}</div>
        <p className="mb-3 text-xs text-slate-500">筛选结果：{list.length} / 全部 {orders.length} 条</p>
        {isError ? <EmptyState title="订单加载失败" desc="请刷新重试" tone="error" /> : null}
        {!isError && !list.length ? <EmptyState title="暂无匹配订单" desc="请修改筛选条件" /> : null}
        <div className="space-y-3">{list.map((o) => {
          const meta = getOrderStatusMeta(o.status);
          return <div key={o.id} className="rounded-2xl border border-slate-100 p-3 text-sm"><div className="flex justify-between"><span>订单号 {o.id}</span><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.chip}`}>{meta.label}</span></div><div className="mt-1 flex justify-between text-slate-500"><span>{o.createdAt}</span><span>{o.itemCount} 件 · ¥{o.amount}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${meta.progress}%` }} /></div><div className="mt-2 flex gap-2"><Button size="sm" variant="secondary" onClick={() => setServiceApplyId(o.id)}>申请售后</Button><Button size="sm" variant="ghost">查看详情</Button></div></div>;
        })}</div>
      </Card>
      {serviceApplyId ? (
        <Card className="mt-4 p-4">
          <SectionTitle>售后申请（{serviceApplyId}）</SectionTitle>
          <textarea className="w-full rounded-xl border border-slate-200 p-2 text-sm" rows={3} placeholder="请填写售后原因，例如：尺码不合适" value={serviceReason} onChange={(e) => setServiceReason(e.target.value)} />
          <div className="mt-3 flex gap-2">
            <Button onClick={() => { setServiceApplyId(''); setServiceReason(''); }}>提交申请</Button>
            <Button variant="ghost" onClick={() => setServiceApplyId('')}>取消</Button>
          </div>
        </Card>
      ) : null}
    </main>
  );
}

function FavoritesPage({ go, products }: { go: (x: string) => void; products: any[] }) {
  const { favorites } = useCartStore();
  const list = products.filter((p) => favorites.includes(p.id));
  return <main className="mx-auto max-w-6xl p-3 md:p-4"><Card className="p-4"><SectionTitle extra={<Button variant="ghost" onClick={() => go('/me')}>返回</Button>}>我的收藏</SectionTitle>{!list.length ? <EmptyState title="暂无收藏商品" /> : <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{list.map((p) => <button key={p.id} onClick={() => go(`/product/${p.id}`)}><ProductCard title={p.title} price={p.price} image={p.image} tags={p.tags} rating={p.rating} soldCount={p.soldCount} originPrice={p.originPrice} /></button>)}</div>}</Card></main>;
}

function AddressesPage({ go }: { go: (x: string) => void }) {
  const { data: addresses = [] } = useAddressesQuery();
  const [tab, setTab] = useState<'all' | 'default'>('all');
  const [keyword, setKeyword] = useState('');
  const [draft, setDraft] = useState({ name: '', phone: '', city: '', detail: '', tag: '家', setDefault: false });
  const [localAdds, setLocalAdds] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (!addresses.length) return;
    setLocalAdds((prev) => (prev.length ? prev : addresses));
  }, [addresses]);

  const merged = localAdds.length ? localAdds : addresses;
  const list = merged.filter((a) => {
    const hitTab = tab === 'all' || a.isDefault;
    const hitKeyword = !keyword.trim() || `${a.name} ${a.phone} ${a.city} ${a.detail}`.includes(keyword.trim());
    return hitTab && hitKeyword;
  });

  const saveAddress = () => {
    if (!draft.name.trim() || !draft.phone.trim() || !draft.city.trim() || !draft.detail.trim()) return;
    if (editingId) {
      setLocalAdds((prev) => prev.map((a) => (a.id === editingId ? { ...a, name: `${draft.name.trim()} · ${draft.tag}`, phone: draft.phone.trim(), city: draft.city.trim(), detail: draft.detail.trim(), isDefault: draft.setDefault || a.isDefault } : (draft.setDefault ? { ...a, isDefault: false } : a))));
      setEditingId('');
    } else {
      const next: Address = {
        id: `addr-${Date.now()}`,
        name: `${draft.name.trim()} · ${draft.tag}`,
        phone: draft.phone.trim(),
        city: draft.city.trim(),
        detail: draft.detail.trim(),
        isDefault: draft.setDefault || merged.length === 0
      };
      setLocalAdds((prev) => [next, ...prev]);
    }
    setDraft({ name: '', phone: '', city: '', detail: '', tag: '家', setDefault: false });
    setShowAddressForm(false);
  };

  const startEdit = (a: Address) => {
    setEditingId(a.id);
    setShowAddressForm(true);
    setDraft({ name: a.name.replace(/ · (家|公司|学校)$/, ''), phone: a.phone, city: a.city, detail: a.detail, tag: / · (家|公司|学校)$/.test(a.name) ? (a.name.match(/ · (家|公司|学校)$/)?.[1] || '家') : '家', setDefault: a.isDefault });
  };

  const removeAddress = (id: string) => {
    setLocalAdds((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length && !next.some((a) => a.isDefault)) next[0].isDefault = true;
      return [...next];
    });
    if (editingId === id) {
      setEditingId('');
      setDraft({ name: '', phone: '', city: '', detail: '', tag: '家', setDefault: false });
    }
  };

  const setAsDefault = (id: string) => {
    setLocalAdds((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle extra={<div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => go('/me')}>返回我的</Button><Button size="sm" variant="ghost" onClick={() => go('/checkout')}>返回结算</Button></div>}>收货地址管理</SectionTitle>
        <input aria-label="搜索地址" className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="搜索收货人/手机号/地址" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <div className="mb-3 flex gap-2">
          <Button size="sm" variant={tab === 'all' ? 'primary' : 'secondary'} onClick={() => setTab('all')}>全部地址</Button>
          <Button size="sm" variant={tab === 'default' ? 'primary' : 'secondary'} onClick={() => setTab('default')}>仅看默认</Button>
        </div>
        {!list.length ? <EmptyState title="暂无匹配地址" desc="可新增地址或调整筛选条件" /> : null}
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-800">{a.name}</p>
                <p className="text-slate-500">{a.phone}</p>
                {a.isDefault ? <Tag tone="success">默认</Tag> : null}
                {!a.isDefault ? <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setAsDefault(a.id)}>设为默认</Button> : null}
              </div>
              <p className="mt-2 text-xs text-slate-500">{a.city} {a.detail}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => startEdit(a)}>编辑</Button>
                <Button size="sm" variant="ghost" onClick={() => removeAddress(a.id)}>删除</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <SectionTitle extra={!showAddressForm ? <Button size="sm" onClick={() => { setShowAddressForm(true); setEditingId(''); }}>新增地址</Button> : null}>{editingId ? '编辑收货地址' : '新增收货地址'}</SectionTitle>
        {showAddressForm ? (
          <>
            <div className="grid gap-2 md:grid-cols-2">
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="收货人" value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="手机号" value={draft.phone} onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="省市区" value={draft.city} onChange={(e) => setDraft((p) => ({ ...p, city: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="街道门牌" value={draft.detail} onChange={(e) => setDraft((p) => ({ ...p, detail: e.target.value }))} />
              <div className="md:col-span-2 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-2">
                <span className="text-xs text-slate-500">地址标签</span>
                {['家', '公司', '学校'].map((tag) => <Button key={tag} size="sm" variant={draft.tag === tag ? 'primary' : 'secondary'} onClick={() => setDraft((p) => ({ ...p, tag }))}>{tag}</Button>)}
                <label className="ml-auto flex items-center gap-1 text-xs text-slate-500"><input type="checkbox" checked={draft.setDefault} onChange={(e) => setDraft((p) => ({ ...p, setDefault: e.target.checked }))} /> 设为默认</label>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button onClick={saveAddress}>{editingId ? '保存修改' : '保存地址'}</Button>
              <Button variant="secondary" onClick={() => { setEditingId(''); setDraft({ name: '', phone: '', city: '', detail: '', tag: '家', setDefault: false }); setShowAddressForm(false); }}>取消</Button>
            </div>
          </>
        ) : <p className="text-sm text-slate-500">点击右上角“新增地址”开始填写。</p>}
      </Card>
    </main>
  );
}

function NotificationsPage({ go }: { go: (x: string) => void }) {
  const { data: notifications = [], isError } = useNotificationsQuery();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<'all' | 'logistics' | 'promo' | 'price_drop' | 'service'>('all');
  const typeOptions = [
    { key: 'all', label: '全部类型' },
    { key: 'logistics', label: '物流' },
    { key: 'promo', label: '促销' },
    { key: 'price_drop', label: '降价' },
    { key: 'service', label: '服务' }
  ] as const;
  const list = filterNotificationsList(notifications, tab, keyword, type);

  return (
    <main className="mx-auto max-w-6xl p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle extra={<Button size="sm" variant="ghost" onClick={() => go('/me')}>返回</Button>}>消息通知中心</SectionTitle>
        <input aria-label="搜索消息" className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="搜索标题或内容" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <div className="mb-2 flex flex-wrap gap-2">
          <Button size="sm" variant={tab === 'all' ? 'primary' : 'secondary'} onClick={() => setTab('all')}>全部</Button>
          <Button size="sm" variant={tab === 'unread' ? 'primary' : 'secondary'} onClick={() => setTab('unread')}>未读</Button>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {typeOptions.map((x) => (
            <button key={x.key} className={`rounded-full px-3 py-1 text-xs ${type === x.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`} onClick={() => setType(x.key as typeof type)}>{x.label}</button>
          ))}
        </div>
        {isError ? <EmptyState title="消息加载失败" desc="请稍后重试" tone="error" /> : null}
        {!isError && !list.length ? <EmptyState title="暂无匹配消息" desc="可尝试切换筛选项" /> : null}
        {!isError && list.length ? (
          <div className="space-y-2">
            {list.map((n) => (
              <div key={n.id} className={`rounded-2xl border p-3 text-sm ${n.read ? 'border-slate-100 bg-white' : 'border-orange-300 bg-orange-50 shadow-[var(--shadow-sm)]'}`}>
                <div className="flex items-center justify-between"><p className="font-medium">{n.title}</p><span className="text-xs text-slate-400">{n.createdAt}</span></div>
                <p className="mt-1 text-slate-600">{n.content}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </main>
  );
}

function FootprintsPage({ go, products }: { go: (x: string) => void; products: any[] }) {
  const { data: footprints = [] } = useFootprintsQuery();
  const list = footprints
    .map((f) => ({ ...f, product: products.find((p) => p.id === f.id) }))
    .filter((x) => x.product);

  return (
    <main className="mx-auto max-w-6xl p-3 md:p-4">
      <Card className="p-4">
        <SectionTitle extra={<Button size="sm" variant="ghost" onClick={() => go('/me')}>返回</Button>}>浏览足迹</SectionTitle>
        {!list.length ? <EmptyState title="暂无足迹" /> : (
          <div className="space-y-2">
            {list.map((x) => (
              <button key={`${x.id}-${x.viewedAt}`} className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left" onClick={() => go(`/product/${x.id}`)}>
                <img src={x.product.image} alt={x.product.title} className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{x.product.title}</p>
                  <p className="text-xs text-slate-500">来源：{x.source} · {x.viewedAt}</p>
                </div>
                <p className="text-sm font-semibold text-[var(--color-brand)]">¥{x.product.price}</p>
              </button>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}
