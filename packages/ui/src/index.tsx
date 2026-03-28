import React from 'react';

export function ProductCard({ title, price, image }: { title: string; price: number; image: string }) {
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm hover:shadow-md transition">
      <img src={image} alt={title} className="h-40 w-full rounded-xl object-cover" />
      <h3 className="mt-3 line-clamp-2 text-sm font-medium">{title}</h3>
      <p className="mt-2 text-lg font-bold text-orange-600">¥{price.toFixed(2)}</p>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-xl font-semibold">{children}</h2>;
}
