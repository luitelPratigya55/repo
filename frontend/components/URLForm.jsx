// components/URLForm.jsx
"use client";

import { getRedirectUrl } from "@/utils/redirectApi";
import { createURL } from "@/utils/urlApi";
import { useState } from "react";

export default function URLForm({ onSuccess }) {
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const result = await createURL(longUrl);

      if (result.success) {
        setSuccess({
          short_code: result.data.short_code,
          short_url: getRedirectUrl(result.data.short_code),
        });
        setLongUrl("");
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || "Failed to create short URL");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700/50 p-8 mb-12">
      <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">
        Shorten a link
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste your long URL here"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mt-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mt-4">
            <p className="text-green-600 dark:text-green-400 text-sm mb-3 font-medium">
              ✅ Done!
            </p>
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
              <code className="text-gray-600 dark:text-gray-300 text-sm break-all">
                {success.short_url}
              </code>
              <button
                onClick={() => copyToClipboard(success.short_url)}
                className="ml-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-xs whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium mt-6"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
