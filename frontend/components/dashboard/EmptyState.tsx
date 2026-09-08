import type { ReactNode } from 'react';

export default function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-neutral-700 px-6 py-12 text-center"><p className="font-semibold text-gray-300">{title}</p>{description && <p className="mt-2 text-sm text-gray-500">{description}</p>}{action && <div className="mt-6">{action}</div>}</div>;
}
