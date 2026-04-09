'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardStudioRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/studio');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 font-medium">Redirecting to Studio...</p>
      </div>
    </div>
  );
}
