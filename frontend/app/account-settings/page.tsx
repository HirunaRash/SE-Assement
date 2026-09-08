'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import PageHeader from '@/components/dashboard/PageHeader';
import Surface from '@/components/dashboard/Surface';
import FormField from '@/components/auth/FormField';

const inputClass = 'mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

export default function AccountSettingsPage() {
  const { user, token, setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setEmail(user.email);
    setFirstName(user.firstName);
    setLastName(user.lastName);
  }, [user]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (password && password !== confirmPassword) { setError('Passwords do not match'); return; }
    setSaving(true);
    try {
      const response: any = await api.put('/auth/me', { email, firstName, lastName, ...(password ? { password } : {}) });
      setUser(response);
      setPassword('');
      setConfirmPassword('');
      setMessage('Account settings saved successfully');
    } catch (requestError: any) {
      setError(requestError.message || 'Unable to save account settings');
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;

  return (
    <main className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back</Link>
        <div className="mt-5"><PageHeader title="Account Settings" description="Update your profile details and password." /></div>
        {message && <div className="mb-6 rounded-lg border border-green-700/50 bg-green-900/20 p-4 text-green-300">{message}</div>}
        {error && <div className="mb-6 rounded-lg border border-red-700/50 bg-red-900/20 p-4 text-red-300">{error}</div>}
        <form onSubmit={save} className="space-y-8">
          <Surface><h2 className="mb-6 text-2xl font-bold text-white">Profile Details</h2><div className="grid gap-5 sm:grid-cols-2"><FormField label="First Name"><input value={firstName} onChange={(event) => setFirstName(event.target.value)} className={inputClass} required /></FormField><FormField label="Last Name"><input value={lastName} onChange={(event) => setLastName(event.target.value)} className={inputClass} required /></FormField></div><FormField label="Email"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} required /></FormField></Surface>
          <Surface><h2 className="mb-2 text-2xl font-bold text-white">Change Password</h2><p className="mb-5 text-sm text-gray-400">Leave blank to keep your current password.</p><div className="grid gap-5 sm:grid-cols-2"><FormField label="New Password"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} autoComplete="new-password" /></FormField><FormField label="Confirm Password"><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} autoComplete="new-password" /></FormField></div></Surface>
          <div className="flex justify-end"><button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button></div>
        </form>
      </div>
    </main>
  );
}
