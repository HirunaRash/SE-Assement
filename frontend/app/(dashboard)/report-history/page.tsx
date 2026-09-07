'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';

type Report = {
	id: number;
	userId: number;
	weekStartDate: string;
	status: string;
	updatedAt: string;
	project?: { name: string } | null;
	user?: { id: number; fullName: string; email: string } | null;
};

type TeamMember = {
	id: number;
	fullName: string;
};

const statusLabels: Record<string, string> = {
	draft: 'Draft',
	submitted: 'Submitted',
	needs_correction: 'Needs Correction',
	approved: 'Approved',
};

const statusValues: Record<string, string> = {
	draft: 'Draft',
	submitted: 'Submitted',
	needs_correction: 'Needs Correction',
	approved: 'Approved',
};

const statusStyles: Record<string, string> = {
	Draft: 'bg-gray-700 text-gray-300',
	Submitted: 'bg-blue-700 text-blue-200',
	'Needs Correction': 'bg-yellow-700 text-yellow-200',
	Approved: 'bg-green-700 text-green-200',
};

export default function ReportHistoryPage() {
	const router = useRouter();
	const { user, token } = useAuthStore();
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState('all');
	const [teamMemberFilter, setTeamMemberFilter] = useState('all');
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	useEffect(() => {
		if (!token) return;

		const fetchReports = async () => {
			setLoading(true);
			setError(null);

			try {
				const isManager = user?.role === 'manager' || user?.role === 'admin';
				const params: Record<string, string> = {};
				if (statusFilter !== 'all') params.status = statusValues[statusFilter];
				if (startDate) params.startDate = startDate;
				if (endDate) params.endDate = endDate;
				if (isManager && teamMemberFilter !== 'all') params.userId = teamMemberFilter;

				const response = isManager
					? await api.get('/reports/manager/all', { params })
					: await api.get('/reports', { params });
				const nextReports: Report[] = Array.isArray(response.data) ? response.data : response.data.reports || [];
				setReports(nextReports);

				if (isManager) {
					const members: TeamMember[] = [];
					for (const report of nextReports) {
						if (report.user && !members.some((member) => member.id === report.user?.id)) {
							members.push({ id: report.user.id, fullName: report.user.fullName });
						}
					}
					setTeamMembers(members);
				}
			} catch (requestError: any) {
				setError(requestError.response?.data?.error || 'Unable to load reports');
			} finally {
				setLoading(false);
			}
		};

		fetchReports();
	}, [endDate, startDate, statusFilter, teamMemberFilter, token, user]);

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

	const formatWeek = (date: string) => {
		const start = new Date(date);
		const end = new Date(start);
		end.setDate(start.getDate() + 6);
		return `${formatDate(start.toISOString())} - ${formatDate(end.toISOString())}`;
	};

	const getStatusBadge = (status: string) => ({
		text: statusLabels[status.toLowerCase().replaceAll(' ', '_')] || status,
		className: statusStyles[status] || 'bg-gray-700 text-gray-300',
	});

	const isManager = user?.role === 'manager' || user?.role === 'admin';

	return (
		<main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
			<header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-4xl font-bold text-white sm:text-5xl">{isManager ? 'Team Reports' : 'My Reports'}</h1>
				<Link href="/reports" className="w-fit rounded-lg bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-gray-100 sm:text-base">
					+ Create New Report
				</Link>
			</header>

			<section className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
				<div>
					<label htmlFor="status" className="mb-2 block text-sm text-gray-400">Filter by Status</label>
					<select id="status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full cursor-pointer rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white transition focus:border-blue-500 sm:w-48">
						<option value="all">All Status</option>
						{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
					</select>
				</div>
				{isManager && (
					<div>
						<label htmlFor="teamMember" className="mb-2 block text-sm text-gray-400">Filter by Team Member</label>
						<select id="teamMember" value={teamMemberFilter} onChange={(event) => setTeamMemberFilter(event.target.value)} className="w-full cursor-pointer rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white transition focus:border-blue-500 sm:w-48">
							<option value="all">All Members</option>
							{teamMembers.map((member) => <option key={member.id} value={member.id}>{member.fullName}</option>)}
						</select>
					</div>
				)}
				<div>
					<label htmlFor="startDate" className="mb-2 block text-sm text-gray-400">From Date</label>
					<input id="startDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white transition focus:border-blue-500" />
				</div>
				<div>
					<label htmlFor="endDate" className="mb-2 block text-sm text-gray-400">To Date</label>
					<input id="endDate" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white transition focus:border-blue-500" />
				</div>
			</section>

			{error && <div className="mb-8 rounded-lg border border-red-700/50 bg-red-900/20 p-6"><p className="text-red-400">{error}</p></div>}

			{loading ? (
				<div className="py-12 text-center"><p className="text-gray-400">Loading reports...</p></div>
			) : reports.length === 0 ? (
				<div className="rounded-lg border border-dashed border-neutral-700 py-12 text-center">
					<p className="mb-4 text-gray-400">No reports found</p>
					<p className="mb-6 text-sm text-gray-500">Start by creating your first weekly report</p>
					<Link href="/reports" className="inline-block rounded-lg bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-100">Create Report</Link>
				</div>
			) : (
				<div className="overflow-x-auto rounded-lg border border-neutral-800">
					<table className="w-full min-w-[760px] text-left text-sm text-gray-300">
						<thead className="border-b border-neutral-800 bg-neutral-900 text-xs uppercase text-gray-400">
							<tr><th className="px-4 py-4 font-bold">Week / Date</th><th className="px-4 py-4 font-bold">Project</th><th className="px-4 py-4 font-bold">Status</th><th className="px-4 py-4 font-bold">Last Updated</th><th className="px-4 py-4 text-right font-bold">Actions</th></tr>
						</thead>
						<tbody className="divide-y divide-neutral-800">
							{reports.map((report) => {
								const badge = getStatusBadge(report.status);
								const editable = report.status === 'Draft' || report.status === 'Needs Correction' || report.status.toLowerCase() === 'draft' || report.status.toLowerCase() === 'needs_correction';
								return <tr key={report.id} className="transition hover:bg-neutral-900/50"><td className="px-4 py-4 font-medium text-white">{formatWeek(report.weekStartDate)}</td><td className="px-4 py-4 text-gray-400">{report.project?.name || 'No project'}</td><td className="px-4 py-4"><span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}>{badge.text}</span></td><td className="px-4 py-4 text-xs text-gray-500">{formatDate(report.updatedAt)}</td><td className="space-x-2 px-4 py-4 text-right"><Link href={`/reports/${report.id}`} className="inline-block rounded bg-blue-900/20 px-3 py-2 text-xs text-blue-400 transition hover:bg-blue-900/40">View</Link>{editable && <Link href={`/reports/${report.id}?edit=true`} className="inline-block rounded bg-yellow-900/20 px-3 py-2 text-xs text-yellow-400 transition hover:bg-yellow-900/40">Edit</Link>}</td></tr>;
							})}
						</tbody>
					</table>
				</div>
			)}
		</main>
	);
}
