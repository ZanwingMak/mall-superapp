import { http, HttpResponse } from 'msw';
import products from '../mock/products.json';

export const handlers = [
  http.get('/api/products', () => HttpResponse.json(products))
];
