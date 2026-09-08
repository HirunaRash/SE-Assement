'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import type { ReactNode } from 'react';

export default function LayoutClient({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { user, token, logout, initialize } = useAuthStore();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register';

	useEffect(() => {
		initialize();
	}, [initialize]);

	useEffect(() => {
		if (!isPublicPage && !token) {
			router.push('/login');
		}
	}, [token, pathname, router, isPublicPage]);

	if (isPublicPage) {
		return <>{children}</>;
	}

	if (!token) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-neutral-950">
				<p className="text-gray-400">Loading...</p>
			</div>
		);
	}

	const isManager = user?.roles?.some((role) => role === 'manager' || role === 'admin') ?? false;
	const navItems = isManager
		? [
				{ href: '/dashboard', label: '📊 Dashboard' },
				{ href: '/report-history', label: '📋 Reports' },
				{ href: '/projects', label: '📁 Projects' },
				{ href: '/projects/team-members', label: '👥 Team Members' },
				{ href: '/account-settings', label: '⚙️ Account Settings' },
				{ href: '/weekly-team-insights', label: '📌 Weekly Team Insights' },
			]
		: [
				{ href: '/report-history', label: '📋 My Reports' },
				{ href: '/reports', label: '✍️ Create Report' },
				{ href: '/account-settings', label: '⚙️ Account Settings' },
			];

	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
		router.push('/');
	};

	return (
		<div className="flex h-screen bg-neutral-950">
			{/* Responsive navigation drawer. */}
			<aside
				className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-900 p-6 text-white transition-transform duration-300 sm:relative sm:translate-x-0`}
			>
				<div className="mb-12">
					<Link href="/" className="text-2xl font-bold text-white transition hover:text-gray-300">
						Weekly Reports
					</Link>
					<p className="mt-2 text-xs text-gray-500">
						{isManager ? 'Manager' : 'Team Member'}
					</p>
				</div>

				<nav className="flex-1 space-y-2" aria-label="Main navigation">
					{navItems.map((item) => {
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
									isActive ? 'bg-white font-bold text-black' : 'text-gray-300 hover:bg-neutral-800'
								}`}
								onClick={() => setSidebarOpen(false)}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="my-6 border-t border-neutral-800" />

				<div>
					<p className="mb-2 text-xs text-gray-500">Logged in as</p>
					<p className="mb-4 truncate text-sm font-medium text-white">{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</p>
					<button
						type="button"
						onClick={handleLogout}
						className="w-full rounded-lg bg-red-900 px-4 py-3 text-sm font-medium text-red-100 transition hover:bg-red-800"
					>
						Logout
					</button>
				</div>
			</aside>

			{sidebarOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/75 sm:hidden"
					onClick={() => setSidebarOpen(false)}
					aria-hidden="true"
				/>
			)}

			<main className="flex w-full flex-1 flex-col overflow-hidden">
				<header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-4 sm:hidden">
					<h1 className="text-lg font-bold text-white">Weekly Reports</h1>
					<button
						type="button"
						onClick={() => setSidebarOpen((open) => !open)}
						className="rounded-lg bg-neutral-800 p-2 text-xl leading-none text-gray-300 transition hover:text-white"
						aria-label="Toggle navigation menu"
						aria-expanded={sidebarOpen}
					>
						☰
					</button>
				</header>

				<div className="w-full flex-1 overflow-auto p-4 sm:p-6 md:p-8">{children}</div>
			</main>
		</div>
	);
}
