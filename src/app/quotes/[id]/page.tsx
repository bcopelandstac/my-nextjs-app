"use client";

import { useState, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getQuoteWithLineItems,
  Quote,
  QuoteLineItem,
} from "@/app/actions/quotes";
import { createEautomateSalesOrderJob } from "@/app/actions/automation-jobs";

export default function QuoteDetailPage() {
  const params = useParams();
  const quoteId = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      try {
        const data = await getQuoteWithLineItems(quoteId);
        if (data) {
          setQuote(data.quote);
          setLineItems(data.lineItems);
        } else {
          setError("Quote not found.");
        }
      } catch (err) {
        setError("Failed to load quote.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [quoteId]);

  const handleCreateJob = () => {
    startTransition(async () => {
      try {
        setError(null);
        setSuccess(null);
        const job = await createEautomateSalesOrderJob(quoteId);
        setSuccess(
          `Sales order job created (${job.id.slice(0, 8)}...). View it on the Automation Jobs page.`
        );
      } catch (err) {
        setError("Failed to create automation job. Please try again.");
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="text-gray-500 dark:text-gray-400">
          Loading quote...
        </div>
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div className="max-w-4xl mx-auto p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="mb-4">
          <Link
            href="/quotes"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            &larr; Back to Quotes
          </Link>
        </div>
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="mb-6">
        <Link
          href="/quotes"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          &larr; Back to Quotes
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Quote Detail
          </h1>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
            {quote?.id}
          </p>
        </div>
        <button
          onClick={handleCreateJob}
          disabled={isPending}
          className="rounded-full border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isPending
            ? "Creating..."
            : "Create e-automate Sales Order Job"}
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm flex items-center justify-between">
          <span>{success}</span>
          <Link
            href="/automation-jobs"
            className="ml-4 text-green-800 dark:text-green-200 underline hover:no-underline text-sm shrink-0"
          >
            View Jobs
          </Link>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Quote info */}
      <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg overflow-hidden mb-8">
        <div className="divide-y divide-black/[.05] dark:divide-white/[.08]">
          <div className="flex p-4">
            <span className="w-32 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(
                quote?.status ?? ""
              )}`}
            >
              {quote?.status}
            </span>
          </div>
          <div className="flex p-4">
            <span className="w-32 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              Total
            </span>
            <span className="text-sm font-medium">
              $
              {Number(quote?.total_amount ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex p-4">
            <span className="w-32 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              Created
            </span>
            <span className="text-sm">
              {quote?.created_at
                ? new Date(quote.created_at).toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="flex p-4">
            <span className="w-32 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
              Updated
            </span>
            <span className="text-sm">
              {quote?.updated_at
                ? new Date(quote.updated_at).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <h2 className="text-xl font-semibold tracking-tight mb-4">
        Line Items
      </h2>
      {lineItems.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No line items.
        </p>
      ) : (
        <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[.08] dark:border-white/[.145] bg-gray-50 dark:bg-white/[.04]">
                <th className="text-left p-3 font-medium text-gray-500 dark:text-gray-400">
                  Description
                </th>
                <th className="text-right p-3 font-medium text-gray-500 dark:text-gray-400">
                  Qty
                </th>
                <th className="text-right p-3 font-medium text-gray-500 dark:text-gray-400">
                  Unit Price
                </th>
                <th className="text-right p-3 font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((li) => (
                <tr
                  key={li.id}
                  className="border-b border-black/[.05] dark:border-white/[.08] last:border-0"
                >
                  <td className="p-3">{li.description}</td>
                  <td className="p-3 text-right">{li.quantity}</td>
                  <td className="p-3 text-right">
                    $
                    {Number(li.unit_price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-3 text-right font-medium">
                    $
                    {Number(li.total_price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
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
