-- Editable site content, managed from /admin. The website reads these with the
-- server key, so RLS stays on with no public policies.

create table if not exists public.site_settings (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  question text not null check (char_length(question) between 3 and 300),
  answer text not null check (char_length(answer) between 3 and 3000),
  sort_order integer not null default 100,
  published boolean not null default true
);
alter table public.faqs enable row level security;

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null check (char_length(title) between 1 and 120),
  category text not null default 'Living spaces' check (char_length(category) <= 60),
  src text not null,               -- /images/... (bundled) or a Supabase Storage public URL
  storage_path text,               -- set for uploaded files so they can be deleted
  sort_order integer not null default 100,
  published boolean not null default true
);
alter table public.gallery_photos enable row level security;

-- Public bucket for uploaded gallery photos. Anyone can view; only the server key writes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can view gallery photos') then
    create policy "Public can view gallery photos" on storage.objects for select to anon, authenticated using (bucket_id = 'gallery');
  end if;
end $$;

-- Seed the gallery with the photos already on the site.
insert into public.gallery_photos (title, category, src, sort_order) values
  ('Bedroom one', 'Sleeping', '/images/rooms/room-4315.jpg', 10),
  ('Bedroom two', 'Sleeping', '/images/rooms/room-4281.jpg', 20),
  ('Bedroom three', 'Sleeping', '/images/rooms/room-4262.jpg', 30),
  ('Bathroom', 'Bathing', '/images/rooms/room-4266.jpg', 40),
  ('Shower', 'Bathing', '/images/rooms/room-4268.jpg', 50),
  ('Bathroom and shower', 'Bathing', '/images/rooms/room-4289.jpg', 60),
  ('Living room', 'Relaxing', '/images/rooms/room-4271.jpg', 70),
  ('Dining room', 'Eating & cooking', '/images/rooms/room-4308.jpg', 80),
  ('Kitchen', 'Eating & cooking', '/images/rooms/room-4305.jpg', 90),
  ('Sun room', 'Relaxing', '/images/rooms/room-4275.jpg', 100);

-- Seed FAQs with the current questions.
insert into public.faqs (question, answer, sort_order) values
  ('What is an adult family home?', 'An adult family home is a licensed residential home that cares for a small number of adults. Residents get personal care, meals and supervision in a real house rather than an institution, which is why many families choose it as an alternative to a nursing home.', 10),
  ('Who is a good fit for EllaCare?', 'We start with an interactive enrollment process: you and your loved one visit, meet our staff, and we talk through care needs together. That gives everyone a chance to decide whether EllaCare is the right home.', 20),
  ('Do you offer private rooms?', 'Yes. We have both private and shared rooms, assigned based on availability and medical needs. We work closely with each resident to meet their room needs.', 30),
  ('Can families stay in touch?', 'Absolutely. Every room has a private telephone (calls between 7 a.m. and 10 p.m.), and we help residents video call with family and friends. Visitors are always welcome. Please call ahead to set up a time.', 40),
  ('Can you accommodate language, hearing or vision needs?', 'Yes. We assist residents who are hearing or vision impaired or who have limited English proficiency. Let us know your preferred form of communication, and if you need an interpreter we will arrange one.', 50),
  ('Is EllaCare smoke-free?', 'Yes. Smoking is not allowed in or around the home. There is a designated outdoor smoking area.', 60);
