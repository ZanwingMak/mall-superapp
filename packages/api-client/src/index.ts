import { useQuery } from '@tanstack/react-query';

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Failed to load products');
  return response.json();
}

export function useProductsQuery() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts });
}
