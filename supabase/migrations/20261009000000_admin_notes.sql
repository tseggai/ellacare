-- Staff notes on inquiries, edited from the website's admin area (/admin).
alter table public.inquiries add column if not exists notes text check (char_length(notes) <= 5000);
alter table public.inquiries add column if not exists updated_at timestamptz not null default now();
