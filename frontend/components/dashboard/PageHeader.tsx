import type { ReactNode } from 'react';

export default function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div>{eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">{eyebrow}</p>}<h1 className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm text-gray-400 sm:text-base">{description}</p>}</div>{action}</header>;
}
