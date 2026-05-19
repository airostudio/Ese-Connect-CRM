-- ============================================================
-- Ese Connect CRM — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  role text not null default 'agent' check (role in ('admin', 'manager', 'agent')),
  created_at timestamptz default now()
);

-- Companies
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

-- Contacts
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

-- Deals
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

-- Tasks
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

-- Activities
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

-- Notes
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  user_id uuid references users(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  deal_id uuid references deals(id) on delete set null,
  company_id uuid references companies(id) on delete set null,
  created_at timestamptz default now()
);

-- Email Templates
create table if not exists email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body text not null,
  category text not null default 'general',
  created_at timestamptz default now()
);

-- Pipelines
create table if not exists pipelines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  stages text not null,
  is_default boolean not null default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Disable Row Level Security on all tables
-- The app uses the service role key server-side (bypasses RLS),
-- but disabling it here avoids surprises if the anon key is
-- ever used accidentally.
-- ============================================================
alter table users disable row level security;
alter table companies disable row level security;
alter table contacts disable row level security;
alter table deals disable row level security;
alter table tasks disable row level security;
alter table activities disable row level security;
alter table notes disable row level security;
alter table email_templates disable row level security;
alter table pipelines disable row level security;

-- ============================================================
-- Indexes for common query patterns
-- ============================================================
create index if not exists idx_contacts_owner_id on contacts(owner_id);
create index if not exists idx_contacts_company_id on contacts(company_id);
create index if not exists idx_contacts_status on contacts(status);
create index if not exists idx_contacts_created_at on contacts(created_at desc);

create index if not exists idx_deals_owner_id on deals(owner_id);
create index if not exists idx_deals_contact_id on deals(contact_id);
create index if not exists idx_deals_company_id on deals(company_id);
create index if not exists idx_deals_stage on deals(stage);
create index if not exists idx_deals_created_at on deals(created_at desc);

create index if not exists idx_tasks_assignee_id on tasks(assignee_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_due_date on tasks(due_date);

create index if not exists idx_activities_contact_id on activities(contact_id);
create index if not exists idx_activities_deal_id on activities(deal_id);
create index if not exists idx_activities_created_at on activities(created_at desc);

create index if not exists idx_notes_contact_id on notes(contact_id);
create index if not exists idx_notes_deal_id on notes(deal_id);
