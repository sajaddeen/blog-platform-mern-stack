'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Blog
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
                Dashboard
              </Link>
              <Link href="/editor" className="text-gray-600 hover:text-gray-800">
                Create Post
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-800">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}