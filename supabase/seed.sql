-- ============================================================
-- Ese Connect CRM — Demo Seed Data
-- Run AFTER schema.sql in the Supabase SQL Editor
-- ============================================================

-- Users (passwords are bcrypt of "password123")
insert into users (id, name, email, password, role) values
  ('00000001-0000-0000-0000-000000000001', 'Alex Admin',    'admin@eseconnect.com',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbBNfisIu', 'admin'),
  ('00000001-0000-0000-0000-000000000002', 'Maria Manager', 'manager@eseconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbBNfisIu', 'manager'),
  ('00000001-0000-0000-0000-000000000003', 'Sam Agent',     'agent@eseconnect.com',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbBNfisIu', 'agent')
on conflict (id) do nothing;

-- Companies
insert into companies (id, name, website, industry, size, revenue, description) values
  ('00000002-0000-0000-0000-000000000001', 'Acme Corporation',  'https://acme.com',          'Technology',   '500-1000', 50000000,  'Leading tech solutions provider'),
  ('00000002-0000-0000-0000-000000000002', 'TechStart Inc',     'https://techstart.io',      'SaaS',         '50-100',   5000000,   'Fast-growing startup'),
  ('00000002-0000-0000-0000-000000000003', 'Global Finance Ltd','https://globalfinance.com', 'Finance',      '1000+',    200000000, 'International financial services'),
  ('00000002-0000-0000-0000-000000000004', 'HealthPlus',        'https://healthplus.com',    'Healthcare',   '100-500',  25000000,  'Digital health solutions'),
  ('00000002-0000-0000-0000-000000000005', 'RetailMax',         'https://retailmax.com',     'Retail',       '500-1000', 80000000,  'E-commerce and retail platform'),
  ('00000002-0000-0000-0000-000000000006', 'BuildRight Co',     'https://buildright.com',    'Construction', '100-500',  30000000,  null),
  ('00000002-0000-0000-0000-000000000007', 'EduLearn',          'https://edulearn.com',      'Education',    '50-100',   8000000,   null),
  ('00000002-0000-0000-0000-000000000008', 'CloudSystems',      'https://cloudsystems.io',   'Technology',   '100-500',  15000000,  null),
  ('00000002-0000-0000-0000-000000000009', 'GreenEnergy Co',    'https://greenenergy.com',   'Energy',       '100-500',  40000000,  null),
  ('00000002-0000-0000-0000-000000000010', 'MediaPro',          'https://mediapro.com',      'Media',        '50-100',   12000000,  null)
on conflict (id) do nothing;

-- Contacts
insert into contacts (id, first_name, last_name, email, phone, title, status, lead_score, company_id, owner_id, tags) values
  ('00000003-0000-0000-0000-000000000001', 'Sarah',    'Johnson',  'sarah.j@acme.com',          '+1-555-0101', 'CTO',        'customer', 92, '00000002-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', '["customer"]'),
  ('00000003-0000-0000-0000-000000000002', 'Mike',     'Chen',     'mike.c@techstart.io',       '+1-555-0102', 'CEO',        'prospect', 78, '00000002-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000001', '["prospect"]'),
  ('00000003-0000-0000-0000-000000000003', 'Emma',     'Williams', 'emma.w@globalfinance.com',  '+1-555-0103', 'CFO',        'lead',     65, '00000002-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000002', '["lead"]'),
  ('00000003-0000-0000-0000-000000000004', 'David',    'Brown',    'david.b@healthplus.com',    '+1-555-0104', 'Director',   'customer', 88, '00000002-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000002', '["customer"]'),
  ('00000003-0000-0000-0000-000000000005', 'Lisa',     'Davis',    'lisa.d@retailmax.com',      '+1-555-0105', 'VP Sales',   'prospect', 71, '00000002-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000003', '["prospect"]'),
  ('00000003-0000-0000-0000-000000000006', 'James',    'Wilson',   'james.w@buildright.com',    '+1-555-0106', 'PM',         'lead',     45, '00000002-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000003', '["lead"]'),
  ('00000003-0000-0000-0000-000000000007', 'Jennifer', 'Taylor',   'jen.t@edulearn.com',        '+1-555-0107', 'Head of IT', 'prospect', 82, '00000002-0000-0000-0000-000000000007', '00000001-0000-0000-0000-000000000001', '["prospect"]'),
  ('00000003-0000-0000-0000-000000000008', 'Robert',   'Anderson', 'robert.a@cloudsystems.io',  '+1-555-0108', 'Architect',  'customer', 95, '00000002-0000-0000-0000-000000000008', '00000001-0000-0000-0000-000000000002', '["customer"]'),
  ('00000003-0000-0000-0000-000000000009', 'Linda',    'Martinez', 'linda.m@greenenergy.com',   '+1-555-0109', 'CEO',        'lead',     58, '00000002-0000-0000-0000-000000000009', '00000001-0000-0000-0000-000000000003', '["lead"]'),
  ('00000003-0000-0000-0000-000000000010', 'William',  'Garcia',   'william.g@mediapro.com',    '+1-555-0110', 'CMO',        'prospect', 74, '00000002-0000-0000-0000-000000000010', '00000001-0000-0000-0000-000000000001', '["prospect"]'),
  ('00000003-0000-0000-0000-000000000011', 'Patricia', 'Lee',      'patricia.l@acme.com',       '+1-555-0111', 'Analyst',    'lead',     38, '00000002-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000002', '["lead"]'),
  ('00000003-0000-0000-0000-000000000012', 'Charles',  'White',    'charles.w@techstart.io',    '+1-555-0112', 'CTO',        'prospect', 69, '00000002-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000003', '["prospect"]'),
  ('00000003-0000-0000-0000-000000000013', 'Barbara',  'Harris',   'barbara.h@globalfinance.com','+1-555-0113','Director',  'customer', 91, '00000002-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000001', '["customer"]'),
  ('00000003-0000-0000-0000-000000000014', 'Thomas',   'Clark',    'thomas.c@healthplus.com',   '+1-555-0114', 'COO',        'lead',     52, '00000002-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000002', '["lead"]'),
  ('00000003-0000-0000-0000-000000000015', 'Margaret', 'Lewis',    'margaret.l@retailmax.com',  '+1-555-0115', 'CFO',        'prospect', 77, '00000002-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000003', '["prospect"]'),
  ('00000003-0000-0000-0000-000000000016', 'Daniel',   'Robinson', 'daniel.r@buildright.com',   '+1-555-0116', 'VP Ops',     'customer', 86, '00000002-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000001', '["customer"]'),
  ('00000003-0000-0000-0000-000000000017', 'Nancy',    'Walker',   'nancy.w@edulearn.com',       '+1-555-0117', 'Principal',  'lead',     43, '00000002-0000-0000-0000-000000000007', '00000001-0000-0000-0000-000000000002', '["lead"]'),
  ('00000003-0000-0000-0000-000000000018', 'Paul',     'Hall',     'paul.h@cloudsystems.io',    '+1-555-0118', 'DevOps',     'prospect', 67, '00000002-0000-0000-0000-000000000008', '00000001-0000-0000-0000-000000000003', '["prospect"]'),
  ('00000003-0000-0000-0000-000000000019', 'Donna',    'Allen',    'donna.a@greenenergy.com',   '+1-555-0119', 'Head of Dev','customer', 89, '00000002-0000-0000-0000-000000000009', '00000001-0000-0000-0000-000000000001', '["customer"]'),
  ('00000003-0000-0000-0000-000000000020', 'Mark',     'Young',    'mark.y@mediapro.com',       '+1-555-0120', 'Content Dir','lead',     56, '00000002-0000-0000-0000-000000000010', '00000001-0000-0000-0000-000000000002', '["lead"]')
on conflict (id) do nothing;

-- Deals
insert into deals (id, title, value, stage, probability, contact_id, company_id, owner_id, health_score, last_activity_at, close_date) values
  ('00000004-0000-0000-0000-000000000001', 'Enterprise License Deal',      125000, 'negotiation', 75, '00000003-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', 82, now() - interval '2 days',  now() + interval '30 days'),
  ('00000004-0000-0000-0000-000000000002', 'Cloud Migration Project',       87000, 'proposal',    50, '00000003-0000-0000-0000-000000000002', '00000002-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000002', 65, now() - interval '5 days',  now() + interval '45 days'),
  ('00000004-0000-0000-0000-000000000003', 'Support Contract Renewal',      24000, 'closed won',  100,'00000003-0000-0000-0000-000000000003', '00000002-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000003', 95, now() - interval '1 day',   now() - interval '5 days'),
  ('00000004-0000-0000-0000-000000000004', 'Platform Upgrade',              56000, 'qualified',   30, '00000003-0000-0000-0000-000000000004', '00000002-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000001', 70, now() - interval '3 days',  now() + interval '60 days'),
  ('00000004-0000-0000-0000-000000000005', 'Integration Services',          38000, 'lead',        10, '00000003-0000-0000-0000-000000000005', '00000002-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000002', 45, now() - interval '8 days',  now() + interval '90 days'),
  ('00000004-0000-0000-0000-000000000006', 'Annual Subscription',           18000, 'closed won',  100,'00000003-0000-0000-0000-000000000006', '00000002-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000003', 90, now() - interval '2 days',  now() - interval '10 days'),
  ('00000004-0000-0000-0000-000000000007', 'Custom Development',            145000,'negotiation', 75, '00000003-0000-0000-0000-000000000007', '00000002-0000-0000-0000-000000000007', '00000001-0000-0000-0000-000000000001', 78, now() - interval '1 day',   now() + interval '20 days'),
  ('00000004-0000-0000-0000-000000000008', 'Training Package',              12000, 'proposal',    50, '00000003-0000-0000-0000-000000000008', '00000002-0000-0000-0000-000000000008', '00000001-0000-0000-0000-000000000002', 60, now() - interval '6 days',  now() + interval '35 days'),
  ('00000004-0000-0000-0000-000000000009', 'API License',                   29000, 'qualified',   30, '00000003-0000-0000-0000-000000000009', '00000002-0000-0000-0000-000000000009', '00000001-0000-0000-0000-000000000003', 55, now() - interval '12 days', now() + interval '50 days'),
  ('00000004-0000-0000-0000-000000000010', 'Consulting Retainer',           48000, 'closed lost', 0,  '00000003-0000-0000-0000-000000000010', '00000002-0000-0000-0000-000000000010', '00000001-0000-0000-0000-000000000001', 20, now() - interval '15 days', now() - interval '20 days'),
  ('00000004-0000-0000-0000-000000000011', 'SaaS Implementation',           92000, 'proposal',    50, '00000003-0000-0000-0000-000000000011', '00000002-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000002', 68, now() - interval '4 days',  now() + interval '40 days'),
  ('00000004-0000-0000-0000-000000000012', 'Data Analytics Setup',          67000, 'negotiation', 75, '00000003-0000-0000-0000-000000000012', '00000002-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000003', 85, now() - interval '1 day',   now() + interval '15 days'),
  ('00000004-0000-0000-0000-000000000013', 'Security Audit',                35000, 'lead',        10, '00000003-0000-0000-0000-000000000013', '00000002-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000001', 42, now() - interval '9 days',  now() + interval '75 days'),
  ('00000004-0000-0000-0000-000000000014', 'Mobile App Development',        178000,'negotiation', 75, '00000003-0000-0000-0000-000000000014', '00000002-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000002', 88, now() - interval '1 day',   now() + interval '25 days'),
  ('00000004-0000-0000-0000-000000000015', 'E-commerce Platform',           134000,'proposal',    50, '00000003-0000-0000-0000-000000000015', '00000002-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000003', 72, now() - interval '3 days',  now() + interval '55 days'),
  ('00000004-0000-0000-0000-000000000016', 'CRM Integration',               41000, 'qualified',   30, '00000003-0000-0000-0000-000000000016', '00000002-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000001', 58, now() - interval '7 days',  now() + interval '65 days'),
  ('00000004-0000-0000-0000-000000000017', 'HR System Upgrade',             76000, 'closed won',  100,'00000003-0000-0000-0000-000000000017', '00000002-0000-0000-0000-000000000007', '00000001-0000-0000-0000-000000000002', 93, now() - interval '2 days',  now() - interval '3 days'),
  ('00000004-0000-0000-0000-000000000018', 'Financial Software Suite',      215000,'negotiation', 75, '00000003-0000-0000-0000-000000000018', '00000002-0000-0000-0000-000000000008', '00000001-0000-0000-0000-000000000003', 80, now() - interval '1 day',   now() + interval '10 days'),
  ('00000004-0000-0000-0000-000000000019', 'Marketing Automation',          53000, 'lead',        10, '00000003-0000-0000-0000-000000000019', '00000002-0000-0000-0000-000000000009', '00000001-0000-0000-0000-000000000001', 40, now() - interval '14 days', now() + interval '80 days'),
  ('00000004-0000-0000-0000-000000000020', 'Supply Chain Optimization',     98000, 'qualified',   30, '00000003-0000-0000-0000-000000000020', '00000002-0000-0000-0000-000000000010', '00000001-0000-0000-0000-000000000002', 62, now() - interval '6 days',  now() + interval '70 days')
on conflict (id) do nothing;

-- Tasks
insert into tasks (id, title, priority, status, due_date, assignee_id, contact_id, deal_id) values
  ('00000005-0000-0000-0000-000000000001', 'Follow up with Sarah Johnson',      'high',   'pending',     now() + interval '1 day',   '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000001', '00000004-0000-0000-0000-000000000001'),
  ('00000005-0000-0000-0000-000000000002', 'Prepare demo for Acme Corp',        'urgent', 'pending',     now() + interval '2 days',  '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000002', '00000004-0000-0000-0000-000000000002'),
  ('00000005-0000-0000-0000-000000000003', 'Send proposal to TechStart',        'high',   'pending',     now() + interval '3 days',  '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000003', '00000004-0000-0000-0000-000000000003'),
  ('00000005-0000-0000-0000-000000000004', 'Contract review call',              'medium', 'pending',     now() + interval '5 days',  '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000004', '00000004-0000-0000-0000-000000000004'),
  ('00000005-0000-0000-0000-000000000005', 'Onboarding session setup',          'medium', 'completed',   now() - interval '1 day',   '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000005', '00000004-0000-0000-0000-000000000005'),
  ('00000005-0000-0000-0000-000000000006', 'Q4 pipeline review',                'low',    'pending',     now() + interval '7 days',  '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000006', '00000004-0000-0000-0000-000000000006'),
  ('00000005-0000-0000-0000-000000000007', 'Send case studies to Global Finance','high',  'in_progress', now(),                       '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000007', '00000004-0000-0000-0000-000000000007'),
  ('00000005-0000-0000-0000-000000000008', 'Update deal stage - HealthPlus',    'medium', 'pending',     now() + interval '4 days',  '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000008', '00000004-0000-0000-0000-000000000008'),
  ('00000005-0000-0000-0000-000000000009', 'Monthly report preparation',        'low',    'pending',     now() + interval '14 days', '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000009', '00000004-0000-0000-0000-000000000009'),
  ('00000005-0000-0000-0000-000000000010', 'Call with RetailMax stakeholders',  'urgent', 'pending',     now() + interval '1 day',   '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000010', '00000004-0000-0000-0000-000000000010'),
  ('00000005-0000-0000-0000-000000000011', 'Invoice follow-up',                 'high',   'pending',     now() - interval '1 day',   '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000011', '00000004-0000-0000-0000-000000000011'),
  ('00000005-0000-0000-0000-000000000012', 'Close CloudSystems deal',           'urgent', 'pending',     now() + interval '2 days',  '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000012', '00000004-0000-0000-0000-000000000012'),
  ('00000005-0000-0000-0000-000000000013', 'Review NDA - GreenEnergy',          'high',   'pending',     now() + interval '1 day',   '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000013', '00000004-0000-0000-0000-000000000013'),
  ('00000005-0000-0000-0000-000000000014', 'Pipeline forecast update',          'medium', 'pending',     now() + interval '7 days',  '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000014', '00000004-0000-0000-0000-000000000014'),
  ('00000005-0000-0000-0000-000000000015', 'Competitive analysis update',       'low',    'pending',     now() + interval '21 days', '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000015', '00000004-0000-0000-0000-000000000015')
on conflict (id) do nothing;

-- Activities
insert into activities (type, title, description, user_id, contact_id, deal_id, created_at) values
  ('call',    'Discovery call',       'Initial discovery with Sarah',         '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000001', '00000004-0000-0000-0000-000000000001', now() - interval '2 days'),
  ('email',   'Proposal sent',        'Sent full proposal document',          '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000002', '00000004-0000-0000-0000-000000000002', now() - interval '5 days'),
  ('meeting', 'Product demo',         'Live demo of platform features',       '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000003', '00000004-0000-0000-0000-000000000003', now() - interval '1 day'),
  ('note',    'Meeting notes',        'Key requirements noted from call',     '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000004', '00000004-0000-0000-0000-000000000004', now() - interval '3 days'),
  ('call',    'Follow-up call',       'Discussed pricing and timeline',       '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000005', '00000004-0000-0000-0000-000000000005', now() - interval '8 days'),
  ('email',   'Follow-up email',      'Sent additional case studies',         '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000006', '00000004-0000-0000-0000-000000000006', now() - interval '4 days'),
  ('meeting', 'Strategy meeting',     'Aligned on implementation approach',   '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000007', '00000004-0000-0000-0000-000000000007', now() - interval '1 day'),
  ('call',    'Demo call',            'Walked through core features',         '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000008', '00000004-0000-0000-0000-000000000008', now() - interval '6 days'),
  ('email',   'Introduction email',   'Initial outreach to Linda',            '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000009', '00000004-0000-0000-0000-000000000009', now() - interval '12 days'),
  ('note',    'Deal notes',           'Budget confirmed at 50k range',        '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000010', '00000004-0000-0000-0000-000000000010', now() - interval '15 days'),
  ('meeting', 'Contract review',      'Legal team reviewed all clauses',      '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000011', '00000004-0000-0000-0000-000000000011', now() - interval '4 days'),
  ('call',    'Closing call',         'Final negotiation on terms',           '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000012', '00000004-0000-0000-0000-000000000012', now() - interval '1 day'),
  ('email',   'Contract sent',        'Final contract sent for signature',    '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000013', '00000004-0000-0000-0000-000000000013', now() - interval '9 days'),
  ('call',    'Check-in call',        'Quarterly check-in with Thomas',       '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000014', '00000004-0000-0000-0000-000000000014', now() - interval '1 day'),
  ('meeting', 'Kickoff meeting',      'Project kickoff with Margaret',        '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000015', '00000004-0000-0000-0000-000000000015', now() - interval '3 days'),
  ('email',   'Thank you email',      'Post-close thank you note',            '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000016', '00000004-0000-0000-0000-000000000016', now() - interval '2 days'),
  ('call',    'Discovery call',       'Explored Nancy''s requirements',       '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000017', '00000004-0000-0000-0000-000000000017', now() - interval '7 days'),
  ('note',    'Important update',     'Paul requested custom integration',    '00000001-0000-0000-0000-000000000003', '00000003-0000-0000-0000-000000000018', '00000004-0000-0000-0000-000000000018', now() - interval '1 day'),
  ('email',   'Proposal sent',        'Sent detailed SOW to Donna',           '00000001-0000-0000-0000-000000000001', '00000003-0000-0000-0000-000000000019', '00000004-0000-0000-0000-000000000019', now() - interval '14 days'),
  ('meeting', 'Quarterly review',     'Q1 review with Mark and team',         '00000001-0000-0000-0000-000000000002', '00000003-0000-0000-0000-000000000020', '00000004-0000-0000-0000-000000000020', now() - interval '6 days');

-- Email templates
insert into email_templates (name, subject, body, category) values
  ('Introduction Email',  'Introduction - {{sender_name}} from {{company}}',          'Hi {{contact_name}},\n\nI hope this email finds you well. My name is {{sender_name}} from {{company}}.\n\nI''d love to schedule a brief call to explore how we might help {{contact_company}} achieve its goals.\n\nWould you be available for a 15-minute call this week?\n\nBest,\n{{sender_name}}', 'outreach'),
  ('Follow-up Template',  'Following up on our conversation',                          'Hi {{contact_name}},\n\nI wanted to follow up on our recent conversation about our proposal.\n\nI''m confident our solution can help {{contact_company}} achieve measurable results.\n\nLooking forward to hearing from you.\n\nBest,\n{{sender_name}}', 'follow-up'),
  ('Proposal Email',      'Proposal for {{contact_company}} - {{deal_name}}',          'Dear {{contact_name}},\n\nThank you for your time. Please find attached our proposal for {{deal_name}}.\n\nHighlights:\n- Investment: {{deal_value}}\n- Implementation: 8-12 weeks\n- ROI Expected: 3-6 months\n\nBest regards,\n{{sender_name}}', 'proposal'),
  ('Thank You Email',     'Thank you for your business!',                              'Hi {{contact_name}},\n\nThank you for choosing {{company}}! We''re thrilled to partner with {{contact_company}}.\n\nYour account manager will be in touch within 24 hours.\n\nWarmly,\n{{sender_name}}', 'post-sale')
on conflict do nothing;

-- Default pipeline
insert into pipelines (name, stages, is_default) values
  ('Default Pipeline', '["lead","qualified","proposal","negotiation","closed won","closed lost"]', true)
on conflict do nothing;
