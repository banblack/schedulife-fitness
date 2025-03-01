
-- This SQL script should be run in the Supabase SQL Editor
-- to create the users table if it doesn't exist

-- First check if the table exists
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  height NUMERIC,
  weight NUMERIC,
  fitness_goals TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow admins to view all data
CREATE POLICY "Admins can view all data" ON users
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE is_admin = true
    )
  );

-- Allow users to view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow admins to update all data
CREATE POLICY "Admins can update all data" ON users
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM users WHERE is_admin = true
    )
  );

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own data only
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create public profiles function (optional) for querying public user data
CREATE OR REPLACE FUNCTION public.get_public_profile(user_id UUID)
RETURNS SETOF users
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM users WHERE id = user_id;
$$;

-- Create the first admin user
-- Replace 'your.admin@email.com' with the actual admin email you want to use
INSERT INTO users (id, email, full_name, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@fittrack.com',
  'System Admin',
  TRUE
);

