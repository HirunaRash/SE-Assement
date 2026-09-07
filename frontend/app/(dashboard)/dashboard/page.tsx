'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

type TeamStatus = { userId: number; name: string; submitted?: number; approved?: number; needsCorrection?: number; draft?: number; totalReports?: number; approvedReports?: number; pendingReports?: number };
type Activity = { type: string; reportId: number; teamMember: string; weekStartDate: string; timestamp: string };
type Trend = { week: string; count?: number; total?: number; completed?: number; planned?: number };
type Workload = { name: string; value?: number; hours?: number };

const chartStyle = { backgroundColor: '#1a1a1a', border: '1px solid #444' };
const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function getCurrentWeek() {
	const date = new Date();
	const day = date.getDay();
	date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
	return date.toISOString().slice(0, 10);
}

function getWeekRange(weekStart: string) {
	const start = new Date(weekStart);
	const end = new Date(start);
	end.setDate(start.getDate() + 6);
	return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export default function ManagerDashboardPage() {
	const router = useRouter();
	const { user, token } = useAuthStore();
	const [totalSubmitted, setTotalSubmitted] = useState(0);
	const [complianceRate, setComplianceRate] = useState(0);
	const [needsCorrectionCount, setNeedsCorrectionCount] = useState(0);
	const [openBlockersCount, setOpenBlockersCount] = useState(0);
	const [tasksCompletedTrend, setTasksCompletedTrend] = useState<Trend[]>([]);
	const [submissionStatusByMember, setSubmissionStatusByMember] = useState<TeamStatus[]>([]);
	const [workloadByProject, setWorkloadByProject] = useState<Workload[]>([]);
	const [timeByTaskType, setTimeByTaskType] = useState<{ type: string; hours: number }[]>([]);
	const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
	const [selectedWeek, setSelectedWeek] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const isManager = user?.roles?.some((role) => role === 'manager' || role === 'admin') ?? false;

	useEffect(() => {
		if (!token || !user) return;
		if (!isManager) {
			router.push('/report-history');
			return;
		}
		const week = selectedWeek || getCurrentWeek();
		if (!selectedWeek) setSelectedWeek(week);

		const fetchDashboardData = async () => {
			setLoading(true);
			setError(null);
			try {
				const [summary, trends, teamStatus, workload, activity] = await Promise.all([
					api.get('/analytics/summary'),
					api.get('/analytics/trends'),
					api.get('/analytics/team-status'),
					api.get('/analytics/workload'),
					api.get('/analytics/activity'),
				]);
				const summaryData = summary;
				setTotalSubmitted(summaryData.submittedReports ?? summaryData.submittedCount ?? summaryData.totalSubmitted ?? 0);
				setComplianceRate(summaryData.complianceRate ?? 0);
				setNeedsCorrectionCount(summaryData.needsCorrection ?? summaryData.needsCorrectionCount ?? 0);
				setOpenBlockersCount(summaryData.openBlockers ?? 0);
				setTasksCompletedTrend((trends || []).map((item: Trend) => ({ ...item, planned: item.planned ?? item.count ?? item.total ?? 0 })));
				setSubmissionStatusByMember(teamStatus || []);
				setWorkloadByProject(workload || []);
				setTimeByTaskType((workload || []).map((item: Workload) => ({ type: item.name, hours: item.hours ?? item.value ?? 0 })));
				setRecentActivity((activity || []).slice(0, 10));
			} catch (requestError: any) {
				setError(requestError.response?.data?.error || 'Unable to load dashboard data');
			} finally {
				setLoading(false);
			}
		};
		fetchDashboardData();
	}, [isManager, router, selectedWeek, token, user]);

	const formatDate = (date: string) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	const formatRelativeTime = (date: string) => {
		const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
		if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))} minutes ago`;
		if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
		return `${Math.floor(seconds / 86400)} days ago`;
	};

	if (!isManager) {
		return <main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8"><div className="rounded-lg border border-red-700/50 bg-red-900/20 p-8 text-center"><h2 className="mb-4 text-2xl font-bold text-red-400">Access Denied</h2><p className="mb-6 text-red-300">Only managers can access this dashboard.</p><Link href="/report-history" className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">Go to My Reports</Link></div></main>;
	}

	const metricCards = [
		['Reports Submitted', totalSubmitted, 'text-white', '📊'],
		['Compliance Rate', `${complianceRate}%`, 'text-green-400', '✅'],
		['Needs Correction', needsCorrectionCount, 'text-yellow-400', '⚠️'],
		['Open Blockers', openBlockersCount, 'text-red-400', '🚫'],
	];

	return (
		<main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
			<header className="mb-8"><h1 className="text-4xl font-bold text-white sm:text-5xl">Manager Dashboard</h1></header>
			<div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><label htmlFor="week" className="text-sm text-gray-400">Select Week</label><input id="week" type="date" value={selectedWeek} onChange={(event) => setSelectedWeek(event.target.value)} className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white transition focus:border-blue-500" /><button type="button" onClick={() => setSelectedWeek(getCurrentWeek())} className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white transition hover:bg-gray-600">This Week</button><span className="text-sm text-gray-500">{selectedWeek && `${formatDate(getWeekRange(selectedWeek).start)} - ${formatDate(getWeekRange(selectedWeek).end)}`}</span></div>
			{error && <div className="mb-8 rounded-lg border border-red-700/50 bg-red-900/20 p-6"><p className="text-red-400">{error}</p></div>}
			{loading ? <div className="py-12 text-center"><p className="text-gray-400">Loading dashboard...</p></div> : <>
				<div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">{metricCards.map(([label, value, color, icon]) => <div key={String(label)} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-gray-400">{label}</p><h3 className={`mt-2 text-4xl font-bold ${color}`}>{value}</h3></div><span className="text-4xl">{icon}</span></div></div>)}</div>
				<div className="space-y-8">
					<ChartCard title="📈 Tasks Completed Trend"><DataMessage visible={tasksCompletedTrend.length > 0}><ResponsiveContainer width="100%" height={300}><LineChart data={tasksCompletedTrend}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="week" stroke="#999" /><YAxis stroke="#999" /><Tooltip contentStyle={chartStyle} /><Legend /><Line type="monotone" dataKey="planned" stroke="#f59e0b" strokeWidth={2} /><Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} /></LineChart></ResponsiveContainer></DataMessage></ChartCard>
					<ChartCard title="👥 Submission Status by Team Member"><DataMessage visible={submissionStatusByMember.length > 0}><ResponsiveContainer width="100%" height={300}><BarChart data={submissionStatusByMember}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="name" stroke="#999" /><YAxis stroke="#999" /><Tooltip contentStyle={chartStyle} /><Legend /><Bar dataKey="submitted" stackId="status" fill="#10b981" name="Submitted" /><Bar dataKey="approved" stackId="status" fill="#3b82f6" name="Approved" /><Bar dataKey="needsCorrection" stackId="status" fill="#f59e0b" name="Needs Correction" /><Bar dataKey="draft" stackId="status" fill="#6b7280" name="Draft" /></BarChart></ResponsiveContainer></DataMessage></ChartCard>
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2"><ChartCard title="📁 Workload by Project"><DataMessage visible={workloadByProject.length > 0}><ResponsiveContainer width="100%" height={300}><BarChart data={workloadByProject} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis type="number" stroke="#999" /><YAxis dataKey="name" type="category" stroke="#999" width={100} /><Tooltip contentStyle={chartStyle} /><Bar dataKey="value" fill="#3b82f6" name="Reports" /></BarChart></ResponsiveContainer></DataMessage></ChartCard><ChartCard title="⏱️ Time Spent by Task Type"><DataMessage visible={timeByTaskType.length > 0}><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={timeByTaskType} dataKey="hours" nameKey="type" cx="50%" cy="50%" outerRadius={100} label>{timeByTaskType.map((entry, index) => <Cell key={entry.type} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip contentStyle={chartStyle} /></PieChart></ResponsiveContainer></DataMessage></ChartCard></div>
				</div>

				<section className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8"><h3 className="mb-8 text-2xl font-bold text-white">🎯 Recent Activity</h3>{recentActivity.length ? <div className="space-y-4">{recentActivity.map((activity) => <div key={`${activity.reportId}-${activity.timestamp}`} className="flex items-start gap-4 border-b border-neutral-800 pb-4 last:border-b-0"><span className="text-2xl">{activity.type?.toLowerCase() === 'approved' ? '✅' : activity.type?.toLowerCase().includes('correction') ? '⚠️' : '📝'}</span><div className="flex-1"><p className="font-semibold text-white">{activity.type || 'Report activity'}</p><p className="mt-1 text-sm text-gray-400">{activity.teamMember} - Week of {formatDate(activity.weekStartDate)}</p><p className="mt-2 text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p></div><Link href={`/reports/${activity.reportId}`} className="rounded bg-blue-900/20 px-4 py-2 text-sm text-blue-400 transition hover:bg-blue-900/40">View</Link></div>)}</div> : <p className="text-sm italic text-gray-400">No activity recorded for this week.</p>}</section>

				<section className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8"><h3 className="mb-8 text-2xl font-bold text-white">👨‍💼 Team Member Status</h3>{submissionStatusByMember.length ? <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm text-gray-300"><thead className="bg-neutral-800"><tr>{['Name', 'Submitted', 'Approved', 'Needs Correction', 'Draft'].map((heading) => <th key={heading} className="px-4 py-4 font-semibold">{heading}</th>)}</tr></thead><tbody>{submissionStatusByMember.map((member) => <tr key={member.userId} className="border-b border-neutral-800 hover:bg-neutral-900/30"><td className="px-4 py-4 font-medium text-white">{member.name}</td><td className="px-4 py-4 text-green-400">{member.submitted ?? member.pendingReports ?? 0}</td><td className="px-4 py-4 text-blue-400">{member.approved ?? member.approvedReports ?? 0}</td><td className="px-4 py-4 text-yellow-400">{member.needsCorrection ?? 0}</td><td className="px-4 py-4 text-gray-500">{member.draft ?? 0}</td></tr>)}</tbody></table></div> : <p className="text-sm italic text-gray-400">No team data available.</p>}</section>
			</>}
		</main>
	);
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
	return <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h3 className="mb-8 text-2xl font-bold text-white">{title}</h3>{children}</section>;
}

function DataMessage({ visible, children }: { visible: boolean; children: React.ReactNode }) {
	return visible ? <>{children}</> : <p className="text-sm italic text-gray-400">No data available for this period.</p>;
}
