-- StackRadar Pro Waitlist Table Setup
-- Run this SQL in your Supabase SQL Editor
-- Project: https://rrnzuefbxnfsrfuictpd.supabase.co

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS stackradar_waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stackradar_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so anyone can join the waitlist)
CREATE POLICY "Allow anonymous inserts" ON stackradar_waitlist 
FOR INSERT WITH CHECK (true);

-- Allow anonymous count/select (so we can show the waitlist count)
CREATE POLICY "Allow anonymous count" ON stackradar_waitlist 
FOR SELECT USING (true);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_stackradar_waitlist_email ON stackradar_waitlist(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_stackradar_waitlist_created_at ON stackradar_waitlist(created_at DESC);
