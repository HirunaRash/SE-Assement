const styles: Record<string, string> = { draft: 'bg-gray-700 text-gray-300', submitted: 'bg-blue-700 text-blue-200', needs_correction: 'bg-yellow-700 text-yellow-200', approved: 'bg-green-700 text-green-200' };
const labels: Record<string, string> = { draft: 'Draft', submitted: 'Submitted', needs_correction: 'Needs Correction', approved: 'Approved' };

export default function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replaceAll(' ', '_');
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[normalized] || 'bg-neutral-700 text-gray-300'}`}>{labels[normalized] || status}</span>;
}
