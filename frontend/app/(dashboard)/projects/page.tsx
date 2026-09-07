'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';

type Project = {
	id: number;
	name: string;
	description?: string;
	createdAt: string;
	memberCount: number;
};

type ProjectResponse = Project & { _count?: { reports?: number } };

const emptyForm = { name: '', description: '' };
const inputClass = 'w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50';

export default function ProjectsPage() {
	const router = useRouter();
	const { user, token } = useAuthStore();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
	const [formData, setFormData] = useState(emptyForm);
	const [formLoading, setFormLoading] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const isManager = user?.role === 'manager' || user?.role === 'admin';

	const fetchProjects = async () => {
		setLoading(true);
		try {
			const response = await api.get('/projects');
			const data: ProjectResponse[] = Array.isArray(response.data) ? response.data : [];
			setProjects(data.map((project) => ({ ...project, memberCount: project.memberCount ?? project._count?.reports ?? 0 })));
		} catch (requestError: any) {
			setError(requestError.response?.data?.error || 'Unable to load projects');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!token) return;
		if (!isManager) {
			router.push('/report-history');
			return;
		}
		fetchProjects();
	}, [isManager, router, token]);

	const openCreateModal = () => {
		setIsEditing(false);
		setSelectedProjectId(null);
		setFormData(emptyForm);
		setError(null);
		setShowModal(true);
	};

	const openEditModal = (project: Project) => {
		setIsEditing(true);
		setSelectedProjectId(project.id);
		setFormData({ name: project.name, description: project.description || '' });
		setError(null);
		setShowModal(true);
	};

	const closeModal = () => {
		if (formLoading) return;
		setShowModal(false);
		setIsEditing(false);
		setSelectedProjectId(null);
		setFormData(emptyForm);
		setError(null);
	};

	const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const name = formData.name.trim();
		if (name.length < 2) { setError('Project name must be at least 2 characters'); return; }
		if (name.length > 50) { setError('Project name must be 50 characters or fewer'); return; }

		setFormLoading(true);
		setError(null);
		try {
			if (isEditing && selectedProjectId !== null) {
				await api.patch(`/projects/${selectedProjectId}`, { name, description: formData.description.trim() });
				setSuccessMessage('Project updated successfully');
			} else {
				await api.post('/projects', { name, description: formData.description.trim() });
				setSuccessMessage('Project created successfully');
			}
			await fetchProjects();
			setShowModal(false);
			setFormData(emptyForm);
		} catch (requestError: any) {
			setError(requestError.response?.data?.error || 'Unable to save project');
		} finally {
			setFormLoading(false);
		}
	};

	const handleDelete = async (projectId: number) => {
		setDeleteLoading(true);
		setError(null);
		try {
			await api.delete(`/projects/${projectId}`);
			setSuccessMessage('Project deleted successfully');
			setDeleteConfirm(null);
			await fetchProjects();
		} catch (requestError: any) {
			setError(requestError.response?.data?.error || 'Unable to delete project');
		} finally {
			setDeleteLoading(false);
		}
	};

	if (!isManager) {
		return <main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8"><div className="rounded-lg border border-red-700/50 bg-red-900/20 p-8 text-center"><h2 className="mb-4 text-2xl font-bold text-red-400">Access Denied</h2><p className="mb-6 text-red-300">Only managers can manage projects.</p><Link href="/report-history" className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">Go to My Reports</Link></div></main>;
	}

	const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
			<header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><h1 className="text-4xl font-bold text-white sm:text-5xl">Projects / Categories</h1><button type="button" onClick={openCreateModal} className="w-fit rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:text-base">+ Create Project</button></header>
			{successMessage && <div className="mb-8 flex items-center justify-between rounded-lg border border-green-700/50 bg-green-900/20 p-4"><p className="text-green-400">{successMessage}</p><button type="button" onClick={() => setSuccessMessage(null)} className="text-green-400 hover:text-green-300">×</button></div>}
			{error && !showModal && <div className="mb-8 flex items-center justify-between rounded-lg border border-red-700/50 bg-red-900/20 p-4"><p className="text-red-400">{error}</p><button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-300">×</button></div>}
			<div className="mb-8"><input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search projects by name..." className={`${inputClass} text-sm`} /></div>

			{loading ? <div className="py-12 text-center"><p className="text-gray-400">Loading projects...</p></div> : <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50">{filteredProjects.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm text-gray-300"><thead className="border-b border-neutral-700 bg-neutral-800"><tr>{['Name', 'Description', 'Members', 'Created', 'Actions'].map((heading) => <th key={heading} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white">{heading}</th>)}</tr></thead><tbody className="divide-y divide-neutral-800">{filteredProjects.map((project) => <tr key={project.id} className="transition hover:bg-neutral-900/50"><td className="px-6 py-4"><h3 className="font-semibold text-white">{project.name}</h3></td><td className="max-w-xs truncate px-6 py-4 text-xs text-gray-400">{project.description || 'No description'}</td><td className="px-6 py-4 text-center"><span className="rounded bg-blue-900/30 px-3 py-1 text-xs text-blue-300">{project.memberCount} members</span></td><td className="px-6 py-4 text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td><td className="space-x-2 px-6 py-4 text-right"><button type="button" onClick={() => openEditModal(project)} className="rounded bg-yellow-900/20 px-4 py-2 text-xs font-medium text-yellow-400 transition hover:bg-yellow-900/40">Edit</button><button type="button" onClick={() => setDeleteConfirm(project.id)} className="rounded bg-red-900/20 px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-900/40">Delete</button></td></tr>)}</tbody></table></div> : <div className="py-12 text-center"><p className="mb-6 text-gray-400">No projects found.</p><button type="button" onClick={openCreateModal} className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">Create Your First Project</button></div>}</div>}

			{deleteConfirm !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><button type="button" aria-label="Close delete confirmation" className="fixed inset-0 cursor-default" onClick={() => setDeleteConfirm(null)} /><div className="relative z-[51] w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-8"><h2 className="mb-4 text-2xl font-bold text-white">Delete Project?</h2><p className="mb-8 text-gray-400">This action cannot be undone. The project will be deleted, but reports associated with it will remain.</p><div className="flex gap-4"><button type="button" onClick={() => setDeleteConfirm(null)} disabled={deleteLoading} className="flex-1 rounded-lg bg-neutral-800 px-4 py-3 text-white transition hover:bg-neutral-700 disabled:opacity-50">Cancel</button><button type="button" onClick={() => handleDelete(deleteConfirm)} disabled={deleteLoading} className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50">{deleteLoading ? 'Deleting...' : 'Delete Project'}</button></div></div></div>}

			{showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><button type="button" aria-label="Close project form" className="fixed inset-0 cursor-default" onClick={closeModal} /><div className="relative z-[51] w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8"><h2 className="mb-8 text-2xl font-bold text-white">{isEditing ? 'Edit Project' : 'Create New Project'}</h2>{error && <div className="mb-6 rounded-lg border border-red-700/50 bg-red-900/20 p-4"><p className="text-sm text-red-400">{error}</p></div>}<form onSubmit={handleFormSubmit} className="space-y-6"><label className="block text-sm font-semibold uppercase tracking-wide text-white">Project Name<input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="e.g., Client A, Internal Tooling, R&D" disabled={formLoading} required className={`mt-2 ${inputClass}`} /></label><label className="block text-sm font-semibold uppercase tracking-wide text-white">Description (Optional)<textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} placeholder="Describe this project or category..." disabled={formLoading} className={`mt-2 h-24 resize-none ${inputClass}`} /></label><div className="mt-8 flex gap-4"><button type="button" onClick={closeModal} disabled={formLoading} className="flex-1 rounded-lg bg-neutral-800 px-4 py-3 text-white transition hover:bg-neutral-700 disabled:opacity-50">Cancel</button><button type="submit" disabled={formLoading || !formData.name.trim()} className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">{formLoading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Project')}</button></div></form></div></div>}
		</main>
	);
}
