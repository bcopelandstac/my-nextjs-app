"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAutomationJob, AutomationJob } from "@/app/actions/automation-jobs";

export default function AutomationJobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<AutomationJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAutomationJob(jobId);
        setJob(data);
      } catch (err) {
        setError("Failed to load job details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="text-gray-500 dark:text-gray-400">Loading job...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="mb-4">
          <Link
            href="/automation-jobs"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            &larr; Back to Automation Jobs
          </Link>
        </div>
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error || "Job not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="mb-6">
        <Link
          href="/automation-jobs"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          &larr; Back to Automation Jobs
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Job Detail</h1>

      <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg overflow-hidden">
        <div className="divide-y divide-black/[.05] dark:divide-white/[.08]">
          {/* ID */}
          <div className="flex p-4">
            <span className="w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              ID
            </span>
            <span className="text-sm font-mono">{job.id}</span>
          </div>

          {/* Type */}
          <div className="flex p-4">
            <span className="w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              Type
            </span>
            <span className="text-sm font-mono">{job.type}</span>
          </div>

          {/* Status */}
          <div className="flex p-4">
            <span className="w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(
                job.status
              )}`}
            >
              {job.status}
            </span>
          </div>

          {/* Created At */}
          <div className="flex p-4">
            <span className="w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              Created At
            </span>
            <span className="text-sm">
              {new Date(job.created_at).toLocaleString()}
            </span>
          </div>

          {/* Processed At */}
          <div className="flex p-4">
            <span className="w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              Processed At
            </span>
            <span className="text-sm">
              {job.processed_at
                ? new Date(job.processed_at).toLocaleString()
                : "Not yet processed"}
            </span>
          </div>

          {/* Error Message */}
          {job.error_message && (
            <div className="flex p-4">
              <span className="w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
                Error
              </span>
              <span className="text-sm text-red-600 dark:text-red-400">
                {job.error_message}
              </span>
            </div>
          )}

          {/* Payload JSON */}
          <div className="p-4">
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Payload JSON
            </span>
            <pre className="bg-gray-50 dark:bg-white/[.04] border border-black/[.05] dark:border-white/[.08] rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
              {job.payload_json
                ? JSON.stringify(job.payload_json, null, 2)
                : "null"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
