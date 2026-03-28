import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../pages/App';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/products', () =>
    HttpResponse.json([{ id: 'p1', title: '测试商品', price: 100, image: 'https://x.y/1.png' }])
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('renders products and cart module', async () => {
  const client = new QueryClient();
  render(<QueryClientProvider client={client}><App /></QueryClientProvider>);
  expect(await screen.findByText('测试商品')).toBeInTheDocument();
  expect(screen.getByText('购物车')).toBeInTheDocument();
});
