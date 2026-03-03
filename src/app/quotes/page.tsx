"use client";

import { useState, useEffect, useTransition } from "react";
import { listQuotes, createSampleQuote, Quote } from "@/app/actions/quotes";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      setError(null);
      const data = await listQuotes();
      setQuotes(data);
    } catch (err) {
      setError("Failed to load quotes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleCreateQuote = () => {
    startTransition(async () => {
      try {
        setError(null);
        await createSampleQuote();
        await fetchQuotes();
      } catch (err) {
        setError("Failed to create quote. Please try again.");
        console.error(err);
      }
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      case "sent":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
        <button
          onClick={handleCreateQuote}
          disabled={isPending}
          className="rounded-full border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "+ New Sample Quote"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">
          Loading quotes...
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No quotes yet</p>
          <p className="text-sm">
            Click &quot;+ New Sample Quote&quot; to create your first one.
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
                  Status
                </th>
                <th className="text-right p-3 font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="text-left p-3 font-medium text-gray-500 dark:text-gray-400">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="border-b border-black/[.05] dark:border-white/[.08] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[.02] transition-colors"
                >
                  <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {quote.id.slice(0, 8)}...
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(
                        quote.status
                      )}`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium">
                    ${Number(quote.total_amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {new Date(quote.created_at).toLocaleDateString()}
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
