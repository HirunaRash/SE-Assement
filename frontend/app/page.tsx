'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LandingPage() {
	const router = useRouter();
	const token = useAuthStore((state) => state.token);

	useEffect(() => {
		if (token) {
			router.push('/report-history');
		}
	}, [router, token]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 sm:p-6 lg:p-8">
			<div className="max-w-3xl text-center">
				<h1 className="mb-8 text-6xl font-bold leading-tight text-white sm:text-7xl lg:text-8xl">
					Weekly Report System
				</h1>
				<p className="mb-16 text-xl leading-relaxed text-gray-400 sm:text-2xl">
					Streamline your team reporting process
				</p>
				<p className="mx-auto mb-20 max-w-2xl text-lg leading-relaxed text-gray-500">
					Manage weekly reports, track team progress, and enable seamless collaboration between team members and managers. Built for transparency and accountability.
				</p>

				<div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
					<Link
						href="/login"
						className="rounded-lg bg-white px-10 py-4 text-lg font-bold text-black transition hover:bg-gray-100 sm:px-12 sm:py-5 sm:text-xl"
					>
						Login
					</Link>
					<Link
						href="/register"
						className="rounded-lg border-2 border-white px-10 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-black sm:px-12 sm:py-5 sm:text-xl"
					>
						Register
					</Link>
				</div>

				<div className="mx-auto mt-24 grid max-w-3xl grid-cols-1 gap-8 border-t border-gray-800 pt-12 text-left md:grid-cols-3">
					<div>
						<h2 className="mb-2 text-lg font-semibold text-white">📋 Report Management</h2>
						<p className="text-sm text-gray-400">Create and manage weekly reports with consistent structure</p>
					</div>
					<div>
						<h2 className="mb-2 text-lg font-semibold text-white">👥 Team Collaboration</h2>
						<p className="text-sm text-gray-400">Managers can review and provide feedback on team reports</p>
					</div>
					<div>
						<h2 className="mb-2 text-lg font-semibold text-white">📊 Analytics &amp; Insights</h2>
						<p className="text-sm text-gray-400">View team progress, blockers, and achievements at a glance</p>
					</div>
				</div>
			</div>
		</main>
	);
}
