import { http, HttpResponse } from 'msw';
import products from '../mock/products.json';
import coupons from '../mock/coupons.json';
import addresses from '../mock/addresses.json';
import orders from '../mock/orders.json';
import home from '../mock/home.json';
import reviews from '../mock/reviews.json';
import notifications from '../mock/notifications.json';
import footprints from '../mock/footprints.json';
import campaigns from '../mock/campaigns.json';

export const handlers = [
  http.get('/api/home', () => HttpResponse.json(home)),
  http.get('/api/products', () => HttpResponse.json(products)),
  http.get('/api/products/:id', ({ params }) => {
    const product = products.find((x) => x.id === params.id);
    if (!product) return new HttpResponse(JSON.stringify({ message: 'Not found' }), { status: 404 });
    return HttpResponse.json(product);
  }),
  http.get('/api/reviews', ({ request }) => {
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    const data = productId ? reviews.filter((x) => x.productId === productId) : reviews;
    return HttpResponse.json(data);
  }),
  http.get('/api/coupons', () => HttpResponse.json(coupons)),
  http.get('/api/addresses', () => HttpResponse.json(addresses)),
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    if (!status || status === 'all') return HttpResponse.json(orders);
    return HttpResponse.json(orders.filter((x) => x.status === status));
  }),
  http.get('/api/notifications', () => HttpResponse.json(notifications)),
  http.get('/api/footprints', () => HttpResponse.json(footprints)),
  http.get('/api/campaigns/:id', ({ params }) => {
    const campaign = campaigns.find((x) => x.id === params.id);
    if (!campaign) return new HttpResponse(JSON.stringify({ message: 'Not found' }), { status: 404 });
    return HttpResponse.json(campaign);
  }),
  http.post('/api/checkout', async ({ request }) => {
    const body = (await request.json()) as {
      addressId?: string;
      paymentMethod?: 'alipay' | 'wechat' | 'card';
      itemIds?: string[];
    };

    if (!body.addressId || !body.paymentMethod || !body.itemIds?.length) {
      return new HttpResponse(JSON.stringify({ message: 'Invalid payload' }), { status: 400 });
    }

    return HttpResponse.json({ orderId: `o${Date.now()}`, status: 'success' as const });
  })
];
