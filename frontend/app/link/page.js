'use client';

import LoadingState from '@/components/LoadingState';
import URLForm from '@/components/URLForm';
import URLStatsCards from '@/components/URLStatsCard';
import URLTable from '@/components/URLTable';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/context/context';
import { getAllURLs } from '@/utils/urlApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LinksPage() {
  const router = useRouter();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total_urls: 0,
    total_clicks: 0,
    average_clicks: 0
  });

  useEffect(() => {
    fetchURLs();
  }, []);

  const fetchURLs = async () => {
    setLoading(true);
    try {
      const data = await getAllURLs();
      
      if (data.success) {
        setUrls(data.urls || []);
        setStats({
          total_urls: data.total_urls || 0,
          total_clicks: data.total_clicks || 0,
          average_clicks: data.total_urls > 0 
            ? (data.total_clicks / data.total_urls).toFixed(1) 
            : 0
        });
      } else {
        setError(data.error || 'Failed to fetch URLs');
      }
    } catch (err) {
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchURLs();
  };

  const Logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    router.push("/login");
  };

  const RegisterAndLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    router.replace('/register');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingState message="Loading your links..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <div className="shrink-0">
              <Link href="/link" className="text-xl font-semibold text-gray-900 dark:text-white">
                URL Shortener
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                href="/link"
                className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 px-3 py-2 text-sm font-medium"
              >
                My Links
              </Link>
              
            </div>

            {/* Right side - User actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={RegisterAndLogout}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Register New Account
              </button>
              <button 
                onClick={Logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white">
            My Links
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Create and manage your shortened URLs
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              <button 
                onClick={() => setError('')}
                className="text-red-600 dark:text-red-400 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Create URL Form */}
        <URLForm onSuccess={handleRefresh} />

        {/* Stats Cards */}
        <URLStatsCards stats={stats} />

        {/* URLs Table */}
        <URLTable 
          urls={urls} 
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}