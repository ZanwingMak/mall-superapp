import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
};

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-2xl font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';
  const variantMap = {
    primary: 'bg-[var(--color-brand)] text-white hover:brightness-110 shadow-[var(--shadow-sm)]',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600'
  };
  const sizeMap = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm' };
  return <button className={`${base} ${variantMap[variant]} ${sizeMap[size]} ${className}`} {...props} />;
}

export function Tag({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'hot' | 'success' }) {
  const tones = {
    default: 'bg-slate-100 text-slate-600',
    hot: 'bg-orange-100 text-orange-700',
    success: 'bg-emerald-100 text-emerald-700'
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${tones[tone]}`}>{children}</span>;
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-slate-100 bg-white shadow-[var(--shadow-md)] ${className}`}>{children}</div>;
}

export function ProductCard({
  title,
  price,
  image,
  rating,
  soldCount,
  tags,
  originPrice
}: {
  title: string;
  price: number;
  image: string;
  rating?: number;
  soldCount?: number;
  tags?: string[];
  originPrice?: number;
}) {
  return (
    <div className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-3 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        <img src={image} alt={title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
        {originPrice && originPrice > price ? (
          <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
            {Math.round((price / originPrice) * 10)}折
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex min-h-10 flex-wrap content-start gap-2">
        {(tags || []).slice(0, 2).map((tag) => (
          <span
            key={tag}
            title={tag}
            className="inline-flex h-6 max-w-[46%] items-center rounded-full bg-orange-100 px-2.5 text-xs text-orange-700"
          >
            <span className="block w-full truncate leading-none">{tag}</span>
          </span>
        ))}
      </div>
      <h3 className="mt-2 min-h-[2.5rem] line-clamp-2 text-sm font-medium text-slate-800">{title}</h3>
      <div className="mt-1 min-h-4 flex items-center gap-2 text-xs text-slate-500">
        {rating ? <span>⭐ {rating.toFixed(1)}</span> : <span className="opacity-0">占位</span>}
        {soldCount ? <span>已售 {soldCount}</span> : null}
      </div>
      <div className="mt-auto pt-2 space-y-1">
        <div className="flex items-end gap-2">
          <p className="text-lg font-bold text-[var(--color-brand)]">¥{price.toFixed(2)}</p>
          {originPrice && originPrice > price ? <p className="text-xs text-slate-400 line-through">¥{originPrice.toFixed(2)}</p> : null}
        </div>
        <p className="text-xs text-rose-600">券后价可再减 ¥{Math.max(1, Math.round(price * 0.06))}</p>
      </div>
    </div>
  );
}

export function SectionTitle({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900 md:text-xl">{children}</h2>
      {extra}
    </div>
  );
}

export function EmptyState({
  title,
  desc,
  tone = 'default'
}: {
  title: string;
  desc?: string;
  tone?: 'default' | 'error';
}) {
  const toneCls = tone === 'error' ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-slate-50';
  return (
    <div className={`rounded-3xl border border-dashed p-8 text-center ${toneCls}`}>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {desc ? <p className="mt-1 text-xs text-slate-500">{desc}</p> : null}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}
