-- Family testimonials shown on the website. Staff add and edit rows in the
-- Supabase dashboard (Table Editor → testimonials); only published rows appear.
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author text not null check (char_length(author) between 1 and 120),
  relation text check (char_length(relation) <= 120),          -- e.g. "Daughter of a resident"
  quote text not null check (char_length(quote) between 10 and 3000),
  highlight text check (char_length(highlight) <= 160),        -- short pull-quote, optional
  published boolean not null default true,
  sort_order integer not null default 100                      -- lower shows first
);

create index if not exists testimonials_published_idx on public.testimonials (published, sort_order, created_at desc);

alter table public.testimonials enable row level security;

-- Anyone may read published testimonials; nobody can write from the browser.
create policy "Public can read published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (published);

insert into public.testimonials (author, relation, quote, highlight, sort_order) values (
  'Carol DeQuoy',
  'Family of a resident',
  'Mom suffers from dementia/Alzheimer’s, and her deterioration has really been painful. We moved Mom to EllaCare in early June, and the improvement has been dramatic. It is really gratifying to see her more like her old self than she has been in some time. One big improvement is that EllaCare embraces new technology. Mom had pretty much stopped talking while on the phone, but once we started Skyping with her she seemed to recognize us and engage in some limited conversations. We now get to see her smile. She seems to really like the people and has taken a shine to Bee. She likes the food and seems to be a lot happier, so we are extremely glad we decided to have her stay there.',
  'We now get to see her smile.',
  10
);
