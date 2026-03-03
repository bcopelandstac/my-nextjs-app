"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export type Quote = {
  id: string;
  customer_id: string | null;
  user_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type QuoteLineItem = {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

// List the current user's quotes
export async function listQuotes(): Promise<Quote[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quotes:", error);
    throw new Error("Failed to fetch quotes");
  }

  return data ?? [];
}

// Create a new sample quote with line items
export async function createSampleQuote(): Promise<Quote> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supabase = createServerClient();

  // First, create or get a sample customer
  let customerId: string | null = null;

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", userId)
    .eq("name", "Sample Customer")
    .limit(1)
    .single();

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from("customers")
      .insert({
        user_id: userId,
        name: "Sample Customer",
        email: "sample@example.com",
        phone: "555-0100",
        company_name: "Acme Corp",
      })
      .select("id")
      .single();

    if (customerError) {
      console.error("Error creating customer:", customerError);
      throw new Error("Failed to create customer");
    }
    customerId = newCustomer.id;
  }

  // Sample line items
  const lineItems = [
    { description: "IT Consultation (1 hr)", quantity: 2, unit_price: 150 },
    { description: "Network Setup", quantity: 1, unit_price: 500 },
    { description: "Security Audit", quantity: 1, unit_price: 350 },
  ];

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  // Create the quote
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      user_id: userId,
      customer_id: customerId,
      status: "draft",
      total_amount: totalAmount,
    })
    .select("*")
    .single();

  if (quoteError) {
    console.error("Error creating quote:", quoteError);
    throw new Error("Failed to create quote");
  }

  // Create line items
  const { error: lineItemsError } = await supabase
    .from("quote_line_items")
    .insert(
      lineItems.map((item) => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }))
    );

  if (lineItemsError) {
    console.error("Error creating line items:", lineItemsError);
    throw new Error("Failed to create line items");
  }

  return quote;
}
