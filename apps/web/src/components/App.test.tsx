import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../pages/App';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/home', () =>
    HttpResponse.json({
      banners: [{ id: 'b1', title: '春季焕新节', subtitle: '每满299减50', image: 'https://x.y/banner.png' }],
      activities: [{ id: 'ac1', title: '限时秒杀', desc: '每日10点', badge: 'HOT' }],
      hotRank: [{ id: 'h1', name: '测试榜单', score: '98%' }],
      newcomer: [{ id: 'n1', title: '新人礼包', perk: '88元券包' }]
    })
  ),
  http.get('/api/products', () =>
    HttpResponse.json([
      {
        id: 'p1',
        title: '测试商品',
        price: 100,
        originPrice: 120,
        image: 'https://x.y/1.png',
        category: 'fashion',
        tags: ['新品'],
        stock: 20,
        soldCount: 10,
        rating: 4.5
      }
    ])
  ),
  http.get('/api/coupons', () => HttpResponse.json([])),
  http.get('/api/addresses', () => HttpResponse.json([])),
  http.get('/api/orders', () => HttpResponse.json([])),
  http.get('/api/products/:id', () => HttpResponse.json({ id: 'p1', title: '测试商品', price: 100, image: 'https://x.y/1.png', category: 'fashion', tags: [], stock: 1 })),
  http.get('/api/reviews', () => HttpResponse.json([]))
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('renders upgraded home modules', async () => {
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  );

  expect(await screen.findByText('春季焕新节')).toBeInTheDocument();
  expect(screen.getByText('活动专区')).toBeInTheDocument();
  expect(screen.getByText('分类宫格')).toBeInTheDocument();
  expect(screen.getByText('测试商品')).toBeInTheDocument();
});
