'use client';

import LoadingState from '@/components/LoadingState';
import { deleteURL, getURL, updateURL } from '@/utils/urlApi';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LinkDetailPage() {
    const params = useParams();
    const router = useRouter();
    const shortCode = params.shortCode;

    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editUrl, setEditUrl] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchURLDetails();
    }, [shortCode]);

    const fetchURLDetails = async () => {
        setLoading(true);
        try {
            const data = await getURL(shortCode);
            if (data && data.long_url) {
                setUrl(data);
            } else {
                setError(data?.error || data?.detail || 'Failed to fetch URL details');
            }
        } catch (err) {
            setError('Network error. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editUrl.trim()) {
            setError('Please enter a valid URL');
            return;
        }

        setSaving(true);
        try {
            const result = await updateURL(shortCode, editUrl);
            if (result?.success && result?.data) {
                setUrl(result.data);
                setIsEditing(false);
            } else {
                setError(result?.error || 'Failed to update URL');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this URL? This action cannot be undone.')) {
            return;
        }

        setSaving(true);
        try {
            const result = await deleteURL(shortCode);
            if (result?.success) {
                router.push('/link');
            } else {
                setError(result?.error || 'Failed to delete URL');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <LoadingState message="Loading link details..." />
                </div>
            </div>
        );
    }

    if (!url) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Link Not Found
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The link you're looking for doesn't exist or has been deleted.
                        </p>
                        <Link
                            href="/link"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Back to Links
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/link"
                        className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
                    >
                        ← Back to Links
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Link Details
                    </h1>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={() => setError('')}
                                className="text-red-600 dark:text-red-400 hover:text-red-800"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - URL Details */}
                    <div className="md:col-span-2">
                        {/* Short URL Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Short URL
                            </h2>
                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                                <code className="flex-1 text-blue-600 dark:text-blue-400 text-sm break-all">
                                    {`${new URL(window.location.href).origin}/${shortCode}/`}
                                </code>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            `${new URL(window.location.href).origin}/${shortCode}/`
                                        )
                                    }
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm whitespace-nowrap"
                                >
                                    Copy
                                </button>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL}/${shortCode}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap"
                                >
                                    Open
                                </a>
                            </div>
                        </div>

                        {/* Original URL Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Original URL
                            </h2>

                            {isEditing ? (
                                <div className="space-y-3">
                                    <input
                                        type="url"
                                        value={editUrl}
                                        onChange={(e) => setEditUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleEdit}
                                            disabled={saving}
                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                                        >
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            disabled={saving}
                                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                                        <p className="text-gray-800 dark:text-gray-200 break-all text-sm">
                                            {url.long_url}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setEditUrl(url.long_url);
                                        }}
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        Edit URL
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Metadata
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {formatDate(url.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span
                                        className={`font-medium ${url.is_active
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                            }`}
                                    >
                                        {url.is_active ? '✓ Active' : '✗ Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Analytics */}
                    <div className="md:col-span-1">
                        {/* Clicks Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {url.clicks}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    Total Clicks
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                    Track how many times this link was clicked
                                </p>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Actions
                            </h2>
                            <button
                                onClick={handleDelete}
                                disabled={saving}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
                            >
                                {saving ? 'Deleting...' : 'Delete Link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
