import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Weekly Report System</h1>
        
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            Login
          </Link>
          
          <Link
            href="/auth/register"
            className="rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}