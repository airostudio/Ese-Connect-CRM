-- Run this in your Supabase SQL Editor to set up the CRM schema

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  role text not null default 'agent' check (role in ('admin', 'manager', 'agent')),
  created_at timestamptz default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  industry text,
  size text,
  revenue bigint,
  description text,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  title text,
  company text,
  status text not null default 'lead',
  lead_score int not null default 0,
  tags text default '[]',
  address text,
  company_id uuid references companies(id) on delete set null,
  owner_id uuid references users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  value numeric not null default 0,
  stage text not null default 'lead',
  probability int not null default 10,
  close_date timestamptz,
  contact_id uuid references contacts(id) on delete set null,
  company_id uuid references companies(id) on delete set null,
  owner_id uuid references users(id) on delete set null,
  pipeline text not null default 'default',
  health_score int not null default 50,
  last_activity_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  due_date timestamptz,
  priority text not null default 'medium',
  status text not null default 'pending',
  assignee_id uuid references users(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  deal_id uuid references deals(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  description text,
  user_id uuid references users(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  deal_id uuid references deals(id) on delete set null,
  company_id uuid references companies(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  user_id uuid references users(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  deal_id uuid references deals(id) on delete set null,
  company_id uuid references companies(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body text not null,
  category text not null default 'general',
  created_at timestamptz default now()
);

create table if not exists pipelines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  stages text not null,
  is_default boolean not null default false,
  created_at timestamptz default now()
);
