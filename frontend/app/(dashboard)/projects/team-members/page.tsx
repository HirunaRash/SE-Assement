'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

type Member = { id: number; firstName: string; lastName: string; email: string; status?: string; roles?: string[] };
type Report = { id: number; weekStartDate: string; weekEndDate: string; status: string; updatedAt?: string; projects?: { name: string } | null; project?: { name: string } | null };

const statusLabel = (status: string) => status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function TeamMembersPage() {
  const searchParams = useSearchParams();
  const selectedId = Number(searchParams.get('member') || 0);
  const { token, user } = useAuthStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState('');

  const isManager = user?.roles?.some((role) => role === 'manager' || role === 'admin') ?? false;

  useEffect(() => {
    if (!token || !isManager) return;
    const loadMembers = async () => {
      try {
        const response: any = await api.get('/users?role=team_member&skip=0&take=100');
        const items: Member[] = response.items || response;
        setMembers(items || []);
        const active = (items || []).find((member) => member.id === selectedId) || null;
        setSelectedMember(active);
      } catch (requestError: any) {
        setError(requestError.message || 'Unable to load team members');
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, [isManager, selectedId, token]);

  useEffect(() => {
    if (!selectedMember || !token) {
      setReports([]);
      return;
    }
    const loadReports = async () => {
      setReportsLoading(true);
      try {
        const response: any = await api.get(`/reports/manager/all?userId=${selectedMember.id}&take=100`);
        setReports(response.items || response || []);
      } catch (requestError: any) {
        setError(requestError.message || 'Unable to load member reports');
      } finally {
        setReportsLoading(false);
      }
    };
    loadReports();
  }, [selectedMember, token]);

  if (!isManager) return <main className="p-8 text-white">Only managers can access Team Members.</main>;

  return (
    <main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><Link href="/projects" className="text-sm text-gray-400 hover:text-white">← Back to Projects</Link><h1 className="mt-4 text-4xl font-bold text-white">Team Members</h1><p className="mt-2 text-gray-400">Select a team member to view their complete report history.</p></div>
      </header>
      {error && <div className="mb-6 rounded-lg border border-red-700/50 bg-red-900/20 p-4 text-red-300">{error}</div>}
      {loading ? <p className="text-gray-400">Loading team members...</p> : <div className="grid grid-cols-1 gap-8 xl:grid-cols-[320px_1fr]">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5"><h2 className="mb-4 text-xl font-bold text-white">Team Member Profiles</h2><div className="space-y-3">{members.map((member) => <Link key={member.id} href={`/projects/team-members?member=${member.id}`} className={`block rounded-lg border p-4 transition ${selectedMember?.id === member.id ? 'border-blue-500 bg-blue-950/40' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-600'}`}><p className="font-semibold text-white">{member.firstName} {member.lastName}</p><p className="mt-1 text-sm text-gray-400">{member.email}</p><p className="mt-2 text-xs capitalize text-gray-500">{member.status || 'active'}</p></Link>)}{members.length === 0 && <p className="text-sm text-gray-500">No team members found.</p>}</div></section>
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-7">{selectedMember ? <><div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm uppercase tracking-wide text-blue-400">Full Report History</p><h2 className="mt-1 text-3xl font-bold text-white">{selectedMember.firstName} {selectedMember.lastName}</h2><p className="text-gray-400">{selectedMember.email}</p></div><span className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-gray-300">{reports.length} reports</span></div>{reportsLoading ? <p className="text-gray-400">Loading reports...</p> : reports.length ? <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm text-gray-300"><thead className="bg-neutral-800 text-xs uppercase text-gray-400"><tr><th className="px-4 py-3">Week</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-neutral-800">{reports.map((report) => <tr key={report.id}><td className="px-4 py-4 font-medium text-white">{new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}</td><td className="px-4 py-4">{report.project?.name || report.projects?.name || 'No project'}</td><td className="px-4 py-4"><span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-gray-200">{statusLabel(report.status)}</span></td><td className="px-4 py-4 text-right"><Link href={`/reports/${report.id}`} className="rounded bg-blue-900/30 px-3 py-2 text-xs text-blue-300 hover:bg-blue-900/50">View</Link></td></tr>)}</tbody></table></div> : <p className="text-gray-500">This team member has no submitted report history yet.</p>}</> : <div className="flex min-h-64 items-center justify-center text-center text-gray-500">Choose a team member to view their reports.</div>}</section>
      </div>}
    </main>
  );
}
