-- Tour requests and contact messages submitted from the website.
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null default 'tour' check (type in ('tour', 'question')),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (char_length(phone) <= 40),
  relationship text check (char_length(relationship) <= 100),
  preferred_date date,
  care_needs text check (char_length(care_needs) <= 2000),
  message text check (char_length(message) <= 5000),
  status text not null default 'new' check (status in ('new', 'contacted', 'toured', 'closed'))
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- RLS on with no policies: the public anon key can neither read nor write.
-- The website inserts through a server action using the secret key, and staff
-- review submissions in the Supabase dashboard (Table Editor → inquiries).
alter table public.inquiries enable row level security;
