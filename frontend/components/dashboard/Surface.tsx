import type { ReactNode } from 'react';

export default function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 ${className}`}>{children}</section>;
}
