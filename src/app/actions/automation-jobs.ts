"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export type AutomationJob = {
  id: string;
  type: string;
  status: string;
  payload_json: Record<string, unknown> | null;
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
};

// List all automation jobs, sorted by created_at desc
export async function listAutomationJobs(): Promise<AutomationJob[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("automation_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching automation jobs:", error);
    throw new Error("Failed to fetch automation jobs");
  }

  return data ?? [];
}

// Get a single automation job by ID
export async function getAutomationJob(
  jobId: string
): Promise<AutomationJob | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("automation_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) {
    console.error("Error fetching automation job:", error);
    throw new Error("Failed to fetch automation job");
  }

  return data;
}

// Create a new e-automate sales order job from a quote
export async function createEautomateSalesOrderJob(
  quoteId: string
): Promise<AutomationJob> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supabase = createServerClient();

  // Fetch the quote
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single();

  if (quoteError || !quote) {
    console.error("Error fetching quote:", quoteError);
    throw new Error("Quote not found");
  }

  // Fetch the customer (if any)
  let customerData: Record<string, unknown> | null = null;
  if (quote.customer_id) {
    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("id", quote.customer_id)
      .single();
    customerData = customer;
  }

  // Fetch line items
  const { data: lineItems, error: lineItemsError } = await supabase
    .from("quote_line_items")
    .select("*")
    .eq("quote_id", quoteId)
    .order("id", { ascending: true });

  if (lineItemsError) {
    console.error("Error fetching line items:", lineItemsError);
    throw new Error("Failed to fetch quote line items");
  }

  // Build the payload — includes all context needed for e-automate import
  const payload = {
    quoteId: quote.id,
    userId: userId,
    customerId: quote.customer_id,
    customerName: customerData?.name ?? null,
    customerCompany: customerData?.company_name ?? null,
    externalEaCustomerNumber:
      customerData?.external_ea_customer_number ?? null,
    lines: (lineItems ?? []).map(
      (li: Record<string, unknown>) => ({
        lineItemId: li.id,
        itemCode: li.item_code ?? "",
        description: li.description ?? "",
        quantity: li.quantity ?? 0,
        unitPrice: li.unit_price ?? 0,
        extendedPrice: li.total_price ?? 0,
      })
    ),
    totalAmount: quote.total_amount,
    freightAmount: (quote as Record<string, unknown>).freight_amount ?? 0,
    branchCode: (quote as Record<string, unknown>).branch_code ?? "",
    departmentCode:
      (quote as Record<string, unknown>).department_code ?? "",
    dealNumber: (quote as Record<string, unknown>).deal_number ?? "",
  };

  // Insert the automation job using only columns that exist in the current schema
  const { data: job, error: jobError } = await supabase
    .from("automation_jobs")
    .insert({
      type: "ea_create_sales_order",
      status: "pending",
      payload_json: payload,
    })
    .select("*")
    .single();

  if (jobError) {
    console.error("Error creating automation job:", jobError);
    throw new Error("Failed to create automation job");
  }

  return job;
}
