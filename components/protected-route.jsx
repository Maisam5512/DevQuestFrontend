'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children, requiredRole = null }) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && isMounted) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, loading, user, requiredRole, router, isMounted]);

  if (loading || !isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg animate-spin"></div>
          </div>
          <p className="text-white mt-4">Loading your quest...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && (!requiredRole || user?.role === requiredRole)) {
    return children;
  }

  return null;
}

