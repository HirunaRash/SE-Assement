'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

type Project = { id: number; name: string };
type ListItem = { id: string; text: string };
type Task = {
	id: string;
	name: string;
	priority: 'low' | 'medium' | 'high';
	plannedPercent: number;
	actualPercent: number;
	status: 'pending' | 'in_progress' | 'completed';
	timePlanned: number;
	timeSpent: number;
	deliverable: string;
};

const emptyTask: Omit<Task, 'id'> = {
	name: '', priority: 'medium', plannedPercent: 0, actualPercent: 0,
	status: 'pending', timePlanned: 0, timeSpent: 0, deliverable: '',
};

const inputClass = 'w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50';

export default function CreateReportPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { token } = useAuthStore();
	const reportId = searchParams.get('id');
	const [weekStart, setWeekStart] = useState('');
	const [weekEnd, setWeekEnd] = useState('');
	const [projectId, setProjectId] = useState('');
	const [projects, setProjects] = useState<Project[]>([]);
	const [nextWeekTasks, setNextWeekTasks] = useState('');
	const [notes, setNotes] = useState('');
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTask, setNewTask] = useState(emptyTask);
	const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
	const [blockers, setBlockers] = useState<ListItem[]>([]);
	const [newBlocker, setNewBlocker] = useState('');
	const [keyBlockerId, setKeyBlockerId] = useState<string | null>(null);
	const [achievements, setAchievements] = useState<ListItem[]>([]);
	const [newAchievement, setNewAchievement] = useState('');
	const [keyAchievementId, setKeyAchievementId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (!token) return;
		const load = async () => {
			try {
				const projectResponse = await api.get('/projects');
				setProjects(Array.isArray(projectResponse) ? projectResponse : []);
				if (!reportId) return;
				const response = await api.get(`/reports/${reportId}`);
				const report = response;
				setWeekStart(report.weekStartDate?.slice(0, 10) || '');
				if (report.weekStartDate) {
					const end = new Date(report.weekStartDate);
					end.setDate(end.getDate() + 6);
					setWeekEnd(end.toISOString().slice(0, 10));
				}
				setProjectId(report.projectId?.toString() || '');
				const reportNextTasks = report.report_next_week_tasks || report.nextWeekTasks || [];
				const reportOptionalFields = report.report_optional_fields?.[0] || report.optionalFields || {};
				setNextWeekTasks(report.plannedNextWeek || reportNextTasks.map((task: any) => task.taskName).join('\n'));
				setNotes(report.notes || reportOptionalFields.notes || '');
				setBlockers((report.report_blockers || report.blockers || []).map((item: any, index: number) => ({ id: String(item.id || `${index}-${item.description}`), text: item.description || item.text })));
				setAchievements((report.report_achievements || report.achievements || []).map((item: any, index: number) => ({ id: String(item.id || `${index}-${item.description}`), text: item.description || item.text })));
				setTasks((report.report_tasks || report.tasks || []).map((task: any) => { const taskStatus = String(task.status || 'not_started').toLowerCase().replaceAll(' ', '_'); return { id: String(task.id), name: task.taskName, priority: String(task.priority || 'medium').toLowerCase() as Task['priority'], plannedPercent: task.plannedPercentage || 0, actualPercent: task.actualPercentage || 0, status: (taskStatus === 'not_started' ? 'pending' : taskStatus) as Task['status'], timePlanned: Number(task.timePlannedHours || 0), timeSpent: Number(task.timeSpentHours || 0), deliverable: task.deliverable || '' }; }));
			} catch (requestError: any) {
				setError(requestError.response?.data?.error || 'Unable to load report data');
			}
		};
		load();
	}, [reportId, token]);

	const addTask = () => {
		if (!newTask.name.trim()) return;
		if (editingTaskId) setTasks((current) => current.map((task) => task.id === editingTaskId ? { ...newTask, id: editingTaskId } : task));
		else setTasks((current) => [...current, { ...newTask, id: `${Date.now()}` }]);
		setNewTask(emptyTask);
		setEditingTaskId(null);
	};
	const editTask = (id: string) => {
		const task = tasks.find((item) => item.id === id);
		if (task) {
			const { id: _taskId, ...taskDraft } = task;
			setEditingTaskId(id);
			setNewTask(taskDraft);
		}
	};
	const deleteTask = (id: string) => setTasks((current) => current.filter((task) => task.id !== id));
	const addBlocker = () => { if (newBlocker.trim()) { setBlockers((items) => [...items, { id: `${Date.now()}`, text: newBlocker.trim() }]); setNewBlocker(''); } };
	const addAchievement = () => { if (newAchievement.trim()) { setAchievements((items) => [...items, { id: `${Date.now()}`, text: newAchievement.trim() }]); setNewAchievement(''); } };
	const deleteBlocker = (id: string) => setBlockers((items) => items.filter((item) => item.id !== id));
	const deleteAchievement = (id: string) => setAchievements((items) => items.filter((item) => item.id !== id));
	const toggleKeyBlocker = (id: string) => setKeyBlockerId((current) => current === id ? null : id);
	const toggleKeyAchievement = (id: string) => setKeyAchievementId((current) => current === id ? null : id);

	const validateForm = () => {
		if (!weekStart) return 'Week start date is required';
		if (!weekEnd) return 'Week end date is required';
		if (new Date(weekEnd) < new Date(weekStart)) return 'Week end must be after week start';
		if (!projectId) return 'Please select a project';
		return '';
	};

	const save = async (status: 'Draft' | 'Submitted') => {
		const validationError = validateForm();
		if (validationError) { setError(validationError); return; }
		if (status === 'Submitted' && tasks.length === 0) { setError('Add at least one task'); return; }
		setError(null);
		status === 'Draft' ? setLoading(true) : setSubmitLoading(true);
		try {
			const payload = {
				weekStartDate: weekStart,
				weekEndDate: weekEnd,
				projectId: Number(projectId),
				tasks: tasks.map((task) => ({ taskName: task.name, priority: task.priority, plannedPercentage: task.plannedPercent, actualPercentage: task.actualPercent, status: task.status === 'pending' ? 'not_started' : task.status, timePlannedHours: task.timePlanned, timeSpentHours: task.timeSpent, deliverable: task.deliverable })),
				blockers: blockers.map((item) => ({ description: item.text, isKeyIssue: item.id === keyBlockerId })),
				achievements: achievements.map((item) => ({ description: item.text, isKeyAchievement: item.id === keyAchievementId })),
				nextWeekTasks: nextWeekTasks ? [{ taskName: nextWeekTasks, priority: 'medium' }] : [],
				optionalFields: notes ? { notes } : undefined,
			};
			const response = reportId ? await api.patch(`/reports/${reportId}`, payload) : await api.post('/reports', payload);
			const savedId = Number(reportId || response.id);
			if (!savedId) throw new Error('The report was saved without an id');
			if (!reportId) await api.patch(`/reports/${savedId}`, payload);
			if (status === 'Submitted') await api.submitReport(savedId);
			setSuccess(status === 'Draft' ? 'Report saved as draft' : 'Report submitted for review');
			setTimeout(() => router.push('/report-history'), 1000);
		} catch (requestError: any) {
			setError(requestError.response?.data?.error || 'Unable to save report');
		} finally { setLoading(false); setSubmitLoading(false); }
	};

	const renderList = (items: ListItem[], keyId: string | null, toggle: (id: string) => void, remove: (id: string) => void) => items.length ? <div className="space-y-3">{items.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800 p-4"><input type="checkbox" checked={keyId === item.id} onChange={() => toggle(item.id)} className="h-4 w-4 cursor-pointer" title="Mark as key item" /><span className={keyId === item.id ? 'font-semibold text-white' : 'text-gray-400'}>{item.text}</span>{keyId === item.id && <span>⭐</span>}<button type="button" onClick={() => remove(item.id)} className="ml-auto rounded bg-red-900/20 px-3 py-1 text-xs text-red-400 transition hover:bg-red-900/40">Delete</button></div>)}</div> : <p className="text-sm italic text-gray-400">None added yet.</p>;

	return (
		<main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
			<header className="mb-8"><Link href="/report-history" className="text-sm text-gray-400 transition hover:text-gray-300">← Back to reports</Link><h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">{reportId ? 'Edit Report' : 'Create Weekly Report'}</h1></header>
			{error && <div className="mb-8 rounded-lg border border-red-700/50 bg-red-900/20 p-6"><p className="text-red-400">{error}</p></div>}
			{success && <div className="mb-8 rounded-lg border border-green-700/50 bg-green-900/20 p-6"><p className="text-green-400">{success}</p></div>}

			<div className="space-y-8">
				<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h2 className="mb-8 text-2xl font-bold text-white">Report Period &amp; Project</h2><div className="grid grid-cols-1 gap-6 md:grid-cols-2"><label className="text-sm text-gray-400">Week Start Date<input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className={`mt-2 ${inputClass}`} required /></label><label className="text-sm text-gray-400">Week End Date<input type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} className={`mt-2 ${inputClass}`} required /></label></div><label className="mt-6 block text-sm text-gray-400">Project / Category<select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={`mt-2 ${inputClass}`} required><option value="">Select a project...</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label></section>

				<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h2 className="mb-8 text-2xl font-bold text-white">Tasks Completed</h2><div className="space-y-4 rounded-lg border border-dashed border-neutral-700 p-5"><label className="block text-sm text-gray-400">Task Name<input value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} placeholder="Task name" className={`mt-2 ${inputClass}`} /></label><div className="grid grid-cols-1 gap-4 md:grid-cols-3"><label className="text-sm text-gray-400">Priority<select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })} className={`mt-2 ${inputClass}`}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="text-sm text-gray-400">Planned %<input type="number" min="0" max="100" value={newTask.plannedPercent} onChange={(e) => setNewTask({ ...newTask, plannedPercent: Number(e.target.value) })} className={`mt-2 ${inputClass}`} /></label><label className="text-sm text-gray-400">Actual %<input type="number" min="0" max="100" value={newTask.actualPercent} onChange={(e) => setNewTask({ ...newTask, actualPercent: Number(e.target.value) })} className={`mt-2 ${inputClass}`} /></label></div><div className="grid grid-cols-1 gap-4 md:grid-cols-3"><label className="text-sm text-gray-400">Status<select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task['status'] })} className={`mt-2 ${inputClass}`}><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select></label><label className="text-sm text-gray-400">Time Planned (hours)<input type="number" min="0" value={newTask.timePlanned} onChange={(e) => setNewTask({ ...newTask, timePlanned: Number(e.target.value) })} className={`mt-2 ${inputClass}`} /></label><label className="text-sm text-gray-400">Time Spent (hours)<input type="number" min="0" value={newTask.timeSpent} onChange={(e) => setNewTask({ ...newTask, timeSpent: Number(e.target.value) })} className={`mt-2 ${inputClass}`} /></label></div><label className="block text-sm text-gray-400">Deliverable / Output<input value={newTask.deliverable} onChange={(e) => setNewTask({ ...newTask, deliverable: e.target.value })} placeholder="What was produced?" className={`mt-2 ${inputClass}`} /></label><div className="flex gap-3"><button type="button" onClick={addTask} className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">{editingTaskId ? 'Update Task' : 'Add Task'}</button>{editingTaskId && <button type="button" onClick={() => { setEditingTaskId(null); setNewTask(emptyTask); }} className="rounded bg-gray-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-600">Cancel</button>}</div></div>{tasks.length ? <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs text-gray-300"><thead className="bg-neutral-800"><tr>{['Task Name', 'Priority', 'Planned %', 'Actual %', 'Status', 'Time Planned', 'Time Spent', 'Deliverable', 'Actions'].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>{tasks.map((task) => <tr key={task.id} className="border-b border-neutral-800 hover:bg-neutral-900/30"><td className="px-3 py-3 text-white">{task.name}</td><td className="px-3 py-3">{task.priority}</td><td className="px-3 py-3">{task.plannedPercent}%</td><td className="px-3 py-3">{task.actualPercent}%</td><td className="px-3 py-3">{task.status}</td><td className="px-3 py-3">{task.timePlanned}h</td><td className="px-3 py-3">{task.timeSpent}h</td><td className="px-3 py-3">{task.deliverable || '-'}</td><td className="space-x-2 px-3 py-3"><button type="button" onClick={() => editTask(task.id)} className="rounded bg-yellow-900/20 px-3 py-1 text-xs text-yellow-400">Edit</button><button type="button" onClick={() => deleteTask(task.id)} className="rounded bg-red-900/20 px-3 py-1 text-xs text-red-400">Delete</button></td></tr>)}</tbody></table></div> : <p className="mt-6 text-sm italic text-gray-400">No tasks added yet. Add at least one task before submitting.</p>}</section>

				<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h2 className="mb-8 text-2xl font-bold text-white">Blockers / Challenges</h2><div className="mb-8 flex gap-2"><input value={newBlocker} onChange={(e) => setNewBlocker(e.target.value)} placeholder="Add a blocker or challenge..." className={inputClass} /><button type="button" onClick={addBlocker} className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700">Add</button></div>{renderList(blockers, keyBlockerId, toggleKeyBlocker, deleteBlocker)}</section>
				<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h2 className="mb-8 text-2xl font-bold text-white">Achievements / Highlights</h2><div className="mb-8 flex gap-2"><input value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} placeholder="Add an achievement or highlight..." className={inputClass} /><button type="button" onClick={addAchievement} className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700">Add</button></div>{renderList(achievements, keyAchievementId, toggleKeyAchievement, deleteAchievement)}</section>
				<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h2 className="mb-8 text-2xl font-bold text-white">Tasks Planned for Next Week</h2><label className="text-sm text-gray-400">Planned Tasks<textarea value={nextWeekTasks} onChange={(e) => setNextWeekTasks(e.target.value)} placeholder="List the tasks you plan to work on next week..." className={`mt-2 h-24 resize-none ${inputClass}`} /></label></section>
				<section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"><h2 className="mb-8 text-2xl font-bold text-white">Additional Notes / Links (Optional)</h2><label className="text-sm text-gray-400">Notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes, links, or relevant information..." className={`mt-2 h-24 resize-none ${inputClass}`} /></label></section>

				<div className="sticky bottom-0 flex flex-col gap-4 border-t border-neutral-800 bg-black p-6 sm:flex-row"><button type="button" onClick={() => save('Draft')} disabled={loading || submitLoading} className="flex-1 rounded-lg bg-gray-700 px-6 py-4 font-bold text-white transition hover:bg-gray-600 disabled:opacity-50">{loading ? 'Saving...' : 'Save as Draft'}</button><button type="button" onClick={() => save('Submitted')} disabled={loading || submitLoading} className="flex-1 rounded-lg bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">{submitLoading ? 'Submitting...' : 'Submit for Review'}</button><Link href="/report-history" className="rounded-lg bg-neutral-700 px-6 py-4 text-center font-bold text-white transition hover:bg-neutral-600">Cancel</Link></div>
			</div>
		</main>
	);
}
