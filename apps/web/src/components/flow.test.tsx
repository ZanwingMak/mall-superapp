import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../pages/App';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const baseProduct = {
  id: 'p1',
  title: '测试商品',
  subtitle: '描述',
  price: 100,
  originPrice: 120,
  image: 'https://x.y/1.png',
  images: ['https://x.y/1.png'],
  category: 'fashion',
  tags: ['新品'],
  stock: 20,
  soldCount: 10,
  rating: 4.5,
  specs: [{ name: '颜色', values: ['白色'] }]
};

const server = setupServer(
  http.get('/api/home', () => HttpResponse.json({ banners: [], activities: [], hotRank: [], newcomer: [] })),
  http.get('/api/products', () => HttpResponse.json([baseProduct])),
  http.get('/api/products/:id', () => HttpResponse.json(baseProduct)),
  http.get('/api/reviews', () => HttpResponse.json([{ id: 'r1', user: 'A', rating: 5, content: '好', createdAt: '2026-01-01' }])),
  http.get('/api/coupons', () => HttpResponse.json([])),
  http.get('/api/addresses', () => HttpResponse.json([{ id: 'a1', name: '张三', phone: '138', city: '上海', detail: '测试路', isDefault: true }])),
  http.get('/api/orders', () => HttpResponse.json([])),
  http.post('/api/checkout', () => HttpResponse.json({ orderId: 'o1', status: 'success' }))
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('can open detail page and show review', async () => {
  window.history.pushState({}, '', '/product/p1');
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  );

  expect(await screen.findByText('图文详情')).toBeInTheDocument();
  expect(screen.getByText('评价预览')).toBeInTheDocument();
});

test('checkout submit button visible in cart flow', async () => {
  window.history.pushState({}, '', '/');
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  );

  const addBtn = await screen.findByRole('button', { name: '加入购物车' });
  fireEvent.click(addBtn);
  fireEvent.click(screen.getByRole('button', { name: '购物车' }));
  expect(await screen.findByRole('button', { name: '去结算' })).toBeInTheDocument();
});
