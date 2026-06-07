"use client";
import { FaRegCopy } from "react-icons/fa";

import { getRedirectUrl } from "@/utils/redirectApi";
import { deleteURL, toggleURLStatus, updateURL } from "@/utils/urlApi";
import Link from "next/link";
import { useState } from "react";
import LoadingState from "./LoadingState";

export default function URLTable({ urls, onRefresh }) {
  const [editingCode, setEditingCode] = useState(null);
  const [editUrl, setEditUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const filteredUrls = urls.filter(
    (url) =>
      url.long_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.short_code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (shortCode, currentUrl) => {
    setEditingCode(shortCode);
    setEditUrl(currentUrl);
  };

  const saveEdit = async (shortCode) => {
    setActionLoading(true);
    try {
      const result = await updateURL(shortCode, editUrl);
      if (result.success) {
        setEditingCode(null);
        setEditUrl("");
        if (onRefresh) onRefresh();
      } else {
        alert(result.error || "Update failed");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (shortCode) => {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    setActionLoading(true);
    try {
      const result = await deleteURL(shortCode);
      if (result.success) {
        if (onRefresh) onRefresh();
      } else {
        alert(result.error || "Delete failed");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (shortCode, currentStatus) => {
    setActionLoading(true);
    try {
      const result = await toggleURLStatus(shortCode, !currentStatus);
      if (result.success) {
        if (onRefresh) onRefresh();
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Create your first link above to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      

      {actionLoading && (
        <div className="p-4">
          <LoadingState message="Processing..." />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUrls.map((url) => (
          <div
            key={url.id}
            className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 hover:border-gray-200 dark:hover:border-gray-600 transition"
          >
            {/* Short URL */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Short URL</p>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                <code className="flex-1 text-xs text-gray-700 dark:text-gray-300 break-all font-mono">
                  {getRedirectUrl(url.short_code)}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(getRedirectUrl(url.short_code))
                  }
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                  title="Copy"
                >
                  <FaRegCopy />
                  
                </button>
                <a
                  href={getRedirectUrl(url.short_code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                  title="Open"
                >
                  ↗
                </a>
              </div>
            </div>

            {/* Original URL */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Destination</p>
              {editingCode === url.short_code ? (
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-300"
                  autoFocus
                />
              ) : (
                <a
                  href={url.long_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 break-all"
                  title={url.long_url}
                >
                  {url.long_url?.length > 60
                    ? url.long_url.substring(0, 60) + "..."
                    : url.long_url}
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700/50">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Clicks</p>
                <p className="text-lg font-light text-gray-900 dark:text-white">
                  {url.clicks || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {formatDate(url.created_at)}
                </p>
              </div>
            </div>

            {/* Actions */}
            {editingCode === url.short_code ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => saveEdit(url.short_code)}
                  disabled={actionLoading}
                  className="flex-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 py-1.5 rounded-lg font-medium transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCode(null)}
                  className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 py-1.5 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href={`/link/${url.short_code}/`}
                  className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 py-1.5 rounded-lg text-center transition"
                >
                  Details
                </Link>
                <button
                  onClick={() => handleEdit(url.short_code, url.long_url)}
                  className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 py-1.5 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(url.short_code)}
                  className="flex-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
