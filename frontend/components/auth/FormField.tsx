import type { ReactNode } from 'react';

export default function FormField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="block text-sm font-semibold text-gray-300"><span>{label}</span>{children}{hint && <span className="mt-2 block text-xs font-normal text-gray-500">{hint}</span>}</label>;
}
