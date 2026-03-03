"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  listAutomationJobs,
  AutomationJob,
} from "@/app/actions/automation-jobs";

export default function AutomationJobsPage() {
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listAutomationJobs();
        setJobs(data);
      } catch (err) {
        setError("Failed to load automation jobs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  return (
    <div className="max-w-5xl mx-auto p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Automation Jobs</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No automation jobs yet</p>
          <p className="text-sm">
            Go to a quote and click &quot;Create e-automate Sales Order
            Job&quot; to create one.
          </p>
        </div>
      ) : (
        <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[.08] dark:border-white/[.145] bg-gray-50 dark:bg-white/[.04]">
                <th className="text-left p-3 font-medium text-gray-500 dark:text-gray-400">
                  ID
                </th>
                <th className="text-left p-3 font-medium text-gray-500 dark:text-gray-400">
                  Type
                </th>
                <th className="text-left p-3 font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left p-3 font-medium text-gray-500 dark:text-gray-400">
                  Created
                </th>
                <th className="text-left p-3 font-medium text-gray-500 dark:text-gray-400">
                  Processed
                </th>
                <th className="text-left p-3 font-medium text-gray-500 dark:text-gray-400">
                  Error
                </th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-black/[.05] dark:border-white/[.08] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[.02] transition-colors"
                >
                  <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {job.id.slice(0, 8)}...
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-xs">
                      {job.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {new Date(job.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {job.processed_at
                      ? new Date(job.processed_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-3 text-red-600 dark:text-red-400 text-xs max-w-[200px] truncate">
                    {job.error_message || "—"}
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/automation-jobs/${job.id}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
