import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../pages/App';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/products', () =>
    HttpResponse.json([
      {
        id: 'p1',
        title: '测试商品',
        price: 100,
        image: 'https://x.y/1.png',
        category: 'fashion',
        tags: ['新品'],
        stock: 20
      }
    ])
  ),
  http.get('/api/coupons', () => HttpResponse.json([{ id: 'c1', title: '满100减10', discount: 10, minSpend: 100, expireAt: '2026-12-31' }])),
  http.get('/api/addresses', () => HttpResponse.json([{ id: 'a1', name: '张三', phone: '138', city: '上海', detail: '张江路', isDefault: true }])),
  http.get('/api/orders', () => HttpResponse.json([{ id: 'o1', amount: 100, status: 'paid', createdAt: '2026-01-01', itemCount: 1 }]))
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('renders product search, cart and order modules', async () => {
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  );

  expect(await screen.findByText('测试商品')).toBeInTheDocument();
  expect(screen.getByLabelText('搜索商品')).toBeInTheDocument();
  expect(screen.getByText('购物车与支付')).toBeInTheDocument();
  expect(screen.getByText('订单列表')).toBeInTheDocument();
});
