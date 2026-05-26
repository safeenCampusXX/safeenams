-- CampusXX Supabase schema
-- Create tables: books, notes, devices
-- Storage bucket: campusxx (set to public)

-- Run in Supabase SQL editor.

-- BOOKS
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null,
  image_url text,
  seller_name text not null,
  contact text not null,
  created_at timestamptz not null default now()
);

-- NOTES
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null,
  image_url text,
  seller_name text not null,
  contact text not null,
  created_at timestamptz not null default now(),

  subject_name text not null,
  notes_type text not null,
  semester text not null
);

-- DEVICES
create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null,
  image_url text,
  seller_name text not null,
  contact text not null,
  created_at timestamptz not null default now(),

  device_type text not null,
  condition text not null
);

-- Optional: RLS policies are recommended.
-- For dev convenience, you may temporarily disable RLS.

-- Storage bucket
-- Create bucket named: campusxx
-- Make it PUBLIC so image_url can be accessed directly.

