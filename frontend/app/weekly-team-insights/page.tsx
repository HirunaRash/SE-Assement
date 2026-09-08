'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

type Insight = { userId: number; name: string; email?: string; reports: Array<{ reportId: number; projectName: string; entries: Array<{ id: number; description: string; isKeyIssue?: boolean; isKeyAchievement?: boolean }> }> };

const currentWeek = () => { const date = new Date(); const day = date.getDay(); date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day)); return date.toISOString().slice(0, 10); };

export default function WeeklyTeamInsightsPage() {
  const { token, user } = useAuthStore();
  const [weekStart, setWeekStart] = useState(currentWeek());
  const [section, setSection] = useState<'blockers' | 'achievements'>('blockers');
  const [members, setMembers] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isManager = user?.roles?.some((role) => role === 'manager' || role === 'admin') ?? false;

  useEffect(() => {
    if (!token || !isManager) return;
    setLoading(true);
    setError('');
    api.get('/analytics/team-section', { params: { weekStart, section } }).then((response: any) => setMembers(Array.isArray(response) ? response : [])).catch((requestError: any) => setError(requestError.message || 'Unable to load weekly insights')).finally(() => setLoading(false));
  }, [isManager, section, token, weekStart]);

  if (!isManager) return <main className="p-8 text-white">Only managers can access Weekly Team Insights.</main>;

  return <main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl"><Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">← Back to dashboard</Link><header className="mb-8 mt-5"><p className="text-sm uppercase tracking-[0.2em] text-blue-400">Manager workspace</p><h1 className="mt-2 text-4xl font-bold text-white">Weekly Team Insights</h1><p className="mt-2 max-w-2xl text-gray-400">Review blockers or achievements across the whole team for one selected week.</p></header><section className="mb-8 flex flex-col gap-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:flex-row sm:items-end"><label className="text-sm font-semibold text-gray-300">Week starting<input type="date" value={weekStart} onChange={(event) => setWeekStart(event.target.value)} className="mt-2 block rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white" /></label><label className="text-sm font-semibold text-gray-300">View across team<select value={section} onChange={(event) => setSection(event.target.value as typeof section)} className="mt-2 block rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white"><option value="blockers">Blockers</option><option value="achievements">Achievements</option></select></label></section>{error && <div className="mb-6 rounded-lg border border-red-700/50 bg-red-900/20 p-4 text-red-300">{error}</div>}{loading ? <p className="text-gray-400">Loading team insights...</p> : <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{members.map((member) => <article key={member.userId} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6"><div className="mb-5 border-b border-neutral-800 pb-4"><h2 className="text-xl font-bold text-white">{member.name}</h2><p className="mt-1 text-sm text-gray-500">{member.email}</p></div>{member.reports.length ? member.reports.map((report) => <div key={report.reportId} className="mb-4 last:mb-0"><p className="mb-2 text-xs uppercase tracking-wide text-blue-400">{report.projectName}</p>{report.entries.length ? <ul className="space-y-2">{report.entries.map((entry) => <li key={entry.id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-sm text-gray-300">{entry.description}</li>)}</ul> : <p className="text-sm italic text-gray-600">No {section} recorded.</p>}</div>) : <p className="text-sm italic text-gray-600">No report submitted for this week.</p>}</article>)}{members.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-neutral-700 p-10 text-center text-gray-500">No team members found.</div>}</div>}</div></main>;
}
