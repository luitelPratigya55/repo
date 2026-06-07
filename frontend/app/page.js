"use client"

import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/link");
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Redirecting to your links...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}