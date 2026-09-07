'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';
import type { FormEvent } from 'react';

type ValidationErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
};

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('team_member');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) errors.fullName = 'Full name is required';
    else if (fullName.trim().length < 2) errors.fullName = 'Full name must be at least 2 characters';

    if (!email.trim()) errors.email = 'Email is required';
    else if (!emailPattern.test(email)) errors.email = 'Invalid email format';

    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (role !== 'team_member' && role !== 'manager') errors.role = 'Invalid role selected';

    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0] as string);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/register', {
        email,
        password,
        fullName: fullName.trim(),
        role,
      });
      setToken(response.data.token);
      setUser(response.data.user);
      router.push('/report-history');
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Registration failed';
      setError(message);
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <header className="mb-12">
          <h1 className="mb-6 text-center text-5xl font-bold text-white sm:text-6xl lg:text-7xl">Create Account</h1>
          <p className="text-center text-lg text-gray-400 sm:text-xl">Set up your account to get started</p>
        </header>

        {error && (
          <div className="mb-8 rounded-lg border border-red-700/50 bg-red-900/20 p-4">
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        )}

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-white">Full Name</label>
              <input id="fullName" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="John Doe" disabled={loading} required autoComplete="name" className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-base text-white placeholder-neutral-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50" />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-white">Email Address</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={loading} required autoComplete="email" className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-base text-white placeholder-neutral-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50" />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-white">Password</label>
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" disabled={loading} required autoComplete="new-password" className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-base text-white placeholder-neutral-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-white">Confirm Password</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="••••••••" disabled={loading} required autoComplete="new-password" className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-base text-white placeholder-neutral-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50" />
            </div>
            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-white">Role</label>
              <select id="role" value={role} onChange={(event) => setRole(event.target.value)} disabled={loading} className="w-full cursor-pointer rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-base text-white transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50">
                <option value="team_member" className="bg-neutral-900 text-white">Team Member</option>
                <option value="manager" className="bg-neutral-900 text-white">Manager</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="mt-8 w-full rounded-lg bg-white py-3 text-lg font-bold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <footer className="mt-10 space-y-4 text-center">
            <p className="text-base text-gray-400">Already have an account? <Link href="/login" className="font-bold text-white transition hover:text-gray-200">Sign in</Link></p>
            <p className="text-sm text-gray-500"><Link href="/" className="text-gray-500 transition hover:text-gray-300">← Back to home</Link></p>
          </footer>
        </div>
      </div>
    </main>
  );
}
