'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import type { FormEvent } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { setToken, setUser } = useAuthStore();

	const validateForm = () => {
		const errors: { email?: string; password?: string } = {};
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!email.trim()) {
			errors.email = 'Email is required';
		} else if (!emailPattern.test(email)) {
			errors.email = 'Enter a valid email address';
		}

		if (!password) {
			errors.password = 'Password is required';
		} else if (password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
		}

		return errors;
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const validationErrors = validateForm();

		if (Object.keys(validationErrors).length > 0) {
			setError(validationErrors.email || validationErrors.password || 'Please check your details');
			return;
		}

		setError(null);
		setLoading(true);

		try {
			const response = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			console.log('Login response:', data); // Debug log

			if (!response.ok) {
				setError(data.error || data.data?.error || 'Login failed. Please try again.');
				setLoading(false);
				return;
			}

			// Extract from wrapped response (backend returns { data: { user, token } })
			const responseData = data.data || data;
			const token = responseData.token;
			const user = responseData.user;

			// Validate token and user exist
			if (token && user) {
				setToken(token);
				setUser(user);
				localStorage.setItem('token', token);
				localStorage.setItem('user', JSON.stringify(user));

				// Redirect based on role
				const userRoles = Array.isArray(user.roles) ? user.roles : [];
				console.log('User roles:', userRoles); // Debug

				if (userRoles.includes('manager') || userRoles.includes('admin')) {
					router.push('/dashboard');
				} else {
					router.push('/report-history');
				}
			} else {
				console.error('Missing token or user:', { token, user, responseData });
				setError('Invalid response from server. Check console for details.');
			}
		} catch (err: any) {
			console.error('Login error:', err);
			setError(err.message || 'Login failed. Please check your connection.');
		} finally {
			setLoading(false);
		}
	};

	const hasValidationErrors = Object.keys(validateForm()).length > 0;

	return (
		<main className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-950 via-slate-950 to-black p-4 sm:p-6 lg:p-8">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-0 lg:flex-row lg:max-w-5xl">
				<section className="hidden w-full flex-col justify-center rounded-2xl border border-zinc-700 bg-linear-to-b from-zinc-800 to-zinc-950 p-8 text-white lg:flex lg:w-2/5 lg:rounded-l-2xl lg:rounded-r-none lg:border-r-0 lg:p-12">
					<h2 className="mb-5 text-3xl font-bold lg:mb-6 lg:text-4xl">Welcome Back</h2>
					<p className="mb-8 text-base leading-relaxed text-slate-300 lg:mb-12 lg:text-lg">
						Access your weekly reports and team collaboration tools. Stay organized and productive.
					</p>
					<ul className="space-y-5 text-sm text-slate-300">
						<li className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-slate-700/50 text-slate-200">✓</span>
							Create and track reports
						</li>
						<li className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-slate-700/50 text-slate-200">✓</span>
							Collaborate with your team
						</li>
						<li className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-slate-700/50 text-slate-200">✓</span>
							Review progress with confidence
						</li>
					</ul>
				</section>

				<section className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-8 shadow-2xl sm:p-10 lg:w-3/5 lg:rounded-l-none lg:rounded-r-2xl lg:p-12">
					<header className="mb-10 lg:mb-12">
						<h1 className="mb-3 text-3xl font-bold text-white lg:text-4xl">Sign In</h1>
						<p className="text-base text-slate-400">Enter your credentials to continue</p>
					</header>

					{error && (
						<div className="mb-10 rounded-lg border border-red-700/50 bg-red-900/20 p-4">
							<p className="text-sm font-medium text-red-400">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-8">
						<div>
							<label htmlFor="email" className="mb-3 block text-sm font-semibold uppercase tracking-wide text-white">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="your@email.com"
								disabled={loading}
								autoComplete="email"
								className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-white transition focus:outline-none focus:ring-2 focus:ring-slate-400/20 disabled:opacity-50"
								required
							/>
						</div>

						<div>
							<label htmlFor="password" className="mb-3 block text-sm font-semibold uppercase tracking-wide text-white">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="••••••••"
								disabled={loading}
								autoComplete="current-password"
								className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-white transition focus:outline-none focus:ring-2 focus:ring-slate-400/20 disabled:opacity-50"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={loading || hasValidationErrors}
							className="mt-10 w-full rounded-lg border border-slate-600 bg-slate-800 py-3 text-lg font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{loading ? 'Signing in...' : 'Sign In'}
						</button>
					</form>

					<footer className="mt-12 border-t border-zinc-800 pt-8 text-center">
						<p className="text-sm text-slate-400">
							Don&apos;t have an account?{' '}
							<Link href="/register" className="font-semibold text-slate-300 transition hover:text-white">
								Register here
							</Link>
						</p>
						<p className="mt-4 text-sm text-slate-500">
							<Link href="/" className="text-slate-500 transition hover:text-slate-400">
								← Back to home
							</Link>
						</p>
					</footer>
				</section>
			</div>
		</main>
	);
}