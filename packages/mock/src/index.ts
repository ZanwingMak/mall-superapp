import { http, HttpResponse } from 'msw';
import products from '../mock/products.json';
import coupons from '../mock/coupons.json';
import addresses from '../mock/addresses.json';
import orders from '../mock/orders.json';

export const handlers = [
  http.get('/api/products', () => HttpResponse.json(products)),
  http.get('/api/coupons', () => HttpResponse.json(coupons)),
  http.get('/api/addresses', () => HttpResponse.json(addresses)),
  http.get('/api/orders', () => HttpResponse.json(orders)),
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
