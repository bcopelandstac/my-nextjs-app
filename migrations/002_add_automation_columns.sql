-- Migration: Add columns needed for Automation Jobs feature
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/pjameavsilbqmzpfyeux/sql/new

-- Add quote_id and user_id to automation_jobs so we can link jobs to quotes
ALTER TABLE automation_jobs ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES quotes(id);
ALTER TABLE automation_jobs ADD COLUMN IF NOT EXISTS user_id text;

-- Add external_ea_customer_number to customers for e-automate integration
ALTER TABLE customers ADD COLUMN IF NOT EXISTS external_ea_customer_number text;

-- Add e-automate / ConnectWise mapping columns to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS external_cw_company_id text;

-- Add index on automation_jobs.quote_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_automation_jobs_quote_id ON automation_jobs(quote_id);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_user_id ON automation_jobs(user_id);
