'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

type Task = {
	id: number;
	taskName: string;
	priority: string;
	plannedPercentage: number;
	actualPercentage: number;
	status: string;
	timePlannedHours: number;
	timeSpentHours: number;
	deliverable?: string;
};

type Review = {
	comment?: string;
	action?: string;
	createdAt: string;
	manager?: { fullName?: string; email?: string };
};

type Report = {
	id: number;
	userId: number;
	weekStartDate: string;
	status: string;
	project?: { name: string } | null;
	user?: { fullName: string; email: string } | null;
	tasks?: Task[];
	blockers?: string;
	achievements?: string;
	plannedNextWeek?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
	reviews?: Review[];
};

const statusMap: Record<string, { text: string; className: string }> = {
	draft: { text: 'Draft', className: 'bg-gray-700 text-gray-300' },
	submitted: { text: 'Submitted', className: 'bg-blue-700 text-blue-200' },
	'needs correction': { text: 'Needs Correction', className: 'bg-yellow-700 text-yellow-200' },
	needs_correction: { text: 'Needs Correction', className: 'bg-yellow-700 text-yellow-200' },
	approved: { text: 'Approved', className: 'bg-green-700 text-green-200' },
};

export default function ReportDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const { user, token } = useAuthStore();
	const reportId = params.id;
	const [report, setReport] = useState<Report | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState('');
	const [reviewComment, setReviewComment] = useState('');
	const [reviewLoading, setReviewLoading] = useState(false);
	const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

	useEffect(() => {
		if (!token || !reportId) return;

		const fetchReport = async () => {
			try {
				const response: any = await api.get(`/reports/${reportId}`);
				const nextReport: Report = {
					...response,
					project: response.project || response.projects || null,
					user: response.user || response.users_reports_userIdTousers ? {
						...(response.user || response.users_reports_userIdTousers),
						fullName: (response.user || response.users_reports_userIdTousers)?.fullName || `${(response.user || response.users_reports_userIdTousers)?.firstName || ''} ${(response.user || response.users_reports_userIdTousers)?.lastName || ''}`.trim(),
					} : null,
					tasks: response.tasks || response.report_tasks || [],
					blockers: response.blockers || response.report_blockers?.map((item: any) => item.description).join('\n') || '',
					achievements: response.achievements || response.report_achievements?.map((item: any) => item.description).join('\n') || '',
					plannedNextWeek: response.plannedNextWeek || response.report_next_week_tasks?.map((item: any) => item.taskName).join('\n') || '',
					notes: response.notes || response.report_optional_fields?.[0]?.notes || '',
					reviews: response.reviews || response.report_review_history || [],
				};
				const isManager = user?.roles?.some((role) => role === 'manager' || role === 'admin') ?? false;
				if (!isManager && nextReport.userId !== user?.id) {
					router.push('/report-history');
					return;
				}
				setReport(nextReport);
			} catch (requestError: any) {
				setError(requestError.response?.data?.error || 'Unable to load report');
			} finally {
				setLoading(false);
			}
		};

		fetchReport();
	}, [reportId, router, token, user]);

	const formatDate = (date?: string) => date
		? new Date(date).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
		: 'Not available';

	const getStatusBadge = (status: string) => statusMap[status.toLowerCase()] || { text: status, className: 'bg-gray-700 text-gray-300' };
	const getLines = (value?: string) => (value || '').split('\n').filter(Boolean);
	const latestReview = report?.reviews?.[report.reviews.length - 1];
	const isManager = user?.roles?.some((role) => role === 'manager' || role === 'admin') ?? false;
	const isOwner = report?.userId === user?.id;
	const normalizedStatus = report?.status.toLowerCase().replaceAll(' ', '_');

	const submitReview = async (action: 'approve' | 'reject') => {
		if (action === 'reject' && !reviewComment.trim()) {
			setError('Please provide feedback for changes needed');
			return;
		}

		setReviewLoading(true);
		setActionType(action);
		setError(null);
		try {
			if (action === 'approve') await api.approveReport(Number(reportId));
			else await api.requestChanges(Number(reportId), reviewComment.trim());
			setSuccess(action === 'approve' ? 'Report approved successfully' : 'Changes requested successfully');
			setTimeout(() => router.push('/report-history'), 1000);
		} catch (requestError: any) {
			setError(requestError.response?.data?.error || 'Unable to submit review');
		} finally {
			setReviewLoading(false);
			setActionType(null);
		}
	};

	return (
		<main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
			<header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-4xl font-bold text-white sm:text-5xl">Report Details</h1>
				<Link href="/report-history" className="text-gray-400 transition hover:text-gray-300">← Back to reports</Link>
			</header>

			{loading && <div className="py-12 text-center"><p className="text-gray-400">Loading report...</p></div>}
			{error && !report && <div className="mb-8 rounded-lg border border-red-700/50 bg-red-900/20 p-6"><p className="mb-4 text-red-400">{error}</p><Link href="/report-history" className="text-gray-300 underline">Go back to reports</Link></div>}
			{report && !loading && (
				<div className="space-y-8">
					{(error || success) && <div className={`rounded-lg border p-6 ${error ? 'border-red-700/50 bg-red-900/20' : 'border-green-700/50 bg-green-900/20'}`}><p className={error ? 'text-red-400' : 'text-green-400'}>{error || success}</p></div>}

					<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-3xl font-bold text-white">Week of {formatDate(report.weekStartDate).split(' at ')[0]}</h2><p className="mt-2 text-sm text-gray-400">Submitted by {report.user?.fullName || 'Unknown user'}</p></div><span className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusBadge(report.status).className}`}>{getStatusBadge(report.status).text}</span></div>
						<div className="mt-8 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2"><div><p className="text-gray-500">Week Start</p><p className="mt-1 text-white">{formatDate(report.weekStartDate)}</p></div><div><p className="text-gray-500">Project</p><p className="mt-1 text-white">{report.project?.name || 'No project'}</p></div><div><p className="text-gray-500">Submitted</p><p className="mt-1 text-white">{formatDate(report.createdAt)}</p></div><div><p className="text-gray-500">Last Updated</p><p className="mt-1 text-white">{formatDate(report.updatedAt)}</p></div></div>
					</section>

					{normalizedStatus === 'needs_correction' && latestReview?.comment && <section className="rounded-2xl border border-yellow-700/50 bg-yellow-900/20 p-6 sm:p-8"><h3 className="mb-4 text-xl font-bold text-yellow-300">📝 Feedback from Manager</h3><p className="mb-4 leading-relaxed text-yellow-200">{latestReview.comment}</p><p className="text-sm text-yellow-600">Reviewed by {latestReview.manager?.fullName || latestReview.manager?.email || 'Manager'} on {formatDate(latestReview.createdAt)}</p><p className="mt-2 text-xs text-yellow-600">You can now edit this report and resubmit it for review.</p></section>}

					<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h3 className="mb-8 text-2xl font-bold text-white">Tasks Completed</h3>{report.tasks?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs text-gray-300 sm:text-sm"><thead className="bg-neutral-800"><tr>{['Task Name', 'Priority', 'Planned %', 'Actual %', 'Status', 'Time Planned', 'Time Spent', 'Deliverable'].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>{report.tasks.map((task) => <tr key={task.id} className="border-b border-neutral-800"><td className="px-3 py-3 text-white">{task.taskName}</td><td className="px-3 py-3">{task.priority}</td><td className="px-3 py-3">{task.plannedPercentage}%</td><td className="px-3 py-3">{task.actualPercentage}%</td><td className="px-3 py-3">{task.status}</td><td className="px-3 py-3">{task.timePlannedHours}h</td><td className="px-3 py-3">{task.timeSpentHours}h</td><td className="max-w-xs truncate px-3 py-3">{task.deliverable || '-'}</td></tr>)}</tbody></table></div> : <p className="text-sm italic text-gray-400">No tasks recorded.</p>}</section>

					<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h3 className="mb-8 text-2xl font-bold text-white">Blockers / Challenges</h3>{getLines(report.blockers).length ? <ul className="space-y-3">{getLines(report.blockers).map((blocker, index) => <li key={`${blocker}-${index}`} className="flex items-start gap-3 text-gray-300"><span className="mt-1 font-bold text-red-500">•</span><span className="text-gray-400">{blocker}</span></li>)}</ul> : <p className="text-sm italic text-gray-400">No blockers recorded.</p>}</section>
					<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h3 className="mb-8 text-2xl font-bold text-white">Achievements / Highlights</h3>{getLines(report.achievements).length ? <ul className="space-y-3">{getLines(report.achievements).map((achievement, index) => <li key={`${achievement}-${index}`} className="flex items-start gap-3 text-gray-300"><span className="mt-1 font-bold text-green-500">•</span><span className="text-gray-400">{achievement}</span></li>)}</ul> : <p className="text-sm italic text-gray-400">No achievements recorded.</p>}</section>
					<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h3 className="mb-4 text-2xl font-bold text-white">Tasks Planned for Next Week</h3>{report.plannedNextWeek ? <p className="whitespace-pre-wrap leading-relaxed text-gray-300">{report.plannedNextWeek}</p> : <p className="text-sm italic text-gray-400">No tasks planned.</p>}</section>
					<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h3 className="mb-4 text-2xl font-bold text-white">Additional Notes / Links</h3>{report.notes ? <p className="whitespace-pre-wrap leading-relaxed text-gray-300">{report.notes}</p> : <p className="text-sm italic text-gray-400">No additional notes.</p>}</section>

					{isManager && report.status.toLowerCase() === 'submitted' && <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h3 className="mb-8 text-2xl font-bold text-white">Review &amp; Approval</h3><p className="mb-6 text-gray-400">Provide feedback or approve this report.</p><label className="block text-sm text-gray-300">Feedback (required if requesting changes)<textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="What needs to be changed? Or leave empty to approve." className="mt-2 h-24 w-full resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white transition focus:border-blue-500 focus:outline-none" /></label><div className="mt-6 flex flex-col gap-4 sm:flex-row"><button type="button" onClick={() => submitReview('approve')} disabled={reviewLoading} className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-50">{reviewLoading && actionType === 'approve' ? 'Approving...' : 'Approve Report'}</button><button type="button" onClick={() => submitReview('reject')} disabled={reviewLoading || !reviewComment.trim()} className="flex-1 rounded-lg bg-yellow-600 px-6 py-3 font-bold text-white transition hover:bg-yellow-700 disabled:opacity-50">{reviewLoading && actionType === 'reject' ? 'Sending...' : 'Request Changes'}</button><Link href="/report-history" className="rounded-lg bg-neutral-700 px-6 py-3 text-center font-bold text-white transition hover:bg-neutral-600">Cancel</Link></div></section>}
					{isOwner && normalizedStatus === 'needs_correction' && <div className="sticky bottom-0 flex flex-col gap-4 border-t border-neutral-800 bg-black p-6 sm:flex-row"><Link href={`/reports?id=${report.id}&edit=true`} className="flex-1 rounded-lg bg-blue-600 px-6 py-4 text-center font-bold text-white transition hover:bg-blue-700">Edit Report</Link><Link href="/report-history" className="rounded-lg bg-neutral-700 px-6 py-4 text-center font-bold text-white transition hover:bg-neutral-600">Back</Link></div>}
				</div>
			)}
		</main>
	);
}
