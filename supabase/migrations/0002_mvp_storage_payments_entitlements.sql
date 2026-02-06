-- Storage bucket + policies
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

do $$
begin
  create policy "storage.submissions.select.own_or_admin"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'submissions' and (owner = auth.uid() or public.is_admin()));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "storage.submissions.insert.own"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'submissions' and owner = auth.uid());
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "storage.submissions.update.own_or_admin"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'submissions' and (owner = auth.uid() or public.is_admin()))
  with check (bucket_id = 'submissions' and (owner = auth.uid() or public.is_admin()));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "storage.submissions.delete.own_or_admin"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'submissions' and (owner = auth.uid() or public.is_admin()));
exception
  when duplicate_object then null;
end $$;

-- Tighten status fields with check constraints (safe no-op if already exists)
do $$
begin
  alter table public.submissions
    add constraint submissions_status_check
    check (status in ('submitted', 'under_review', 'accepted', 'rejected', 'camera_ready'));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.orders
    add constraint orders_status_check
    check (status in ('created', 'pending', 'paid', 'failed', 'canceled'));
exception
  when duplicate_object then null;
end $$;

-- Stripe webhook idempotency
create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  type text not null,
  stripe_session_id text,
  stripe_payment_intent_id text,
  order_id uuid references public.orders (id) on delete set null,
  processed_ok boolean not null default true,
  error text,
  raw jsonb,
  processed_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

do $$
begin
  create policy "stripe_webhook_events.admin.select"
  on public.stripe_webhook_events
  for select
  to authenticated
  using (public.is_admin());
exception
  when duplicate_object then null;
end $$;

-- Payments records (optional but useful for reconciliation)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null default 'stripe',
  status text not null default 'succeeded',
  amount integer not null,
  currency text not null,
  stripe_session_id text,
  stripe_payment_intent_id text,
  stripe_event_id text,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create unique index if not exists payments_stripe_event_id_key
on public.payments (stripe_event_id)
where stripe_event_id is not null;

create unique index if not exists payments_stripe_payment_intent_id_key
on public.payments (stripe_payment_intent_id)
where stripe_payment_intent_id is not null;

do $$
begin
  create policy "payments.select.own"
  on public.payments
  for select
  to authenticated
  using (user_id = auth.uid());
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "payments.admin.select"
  on public.payments
  for select
  to authenticated
  using (public.is_admin());
exception
  when duplicate_object then null;
end $$;

-- Entitlements bound to orders (minimal)
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  order_id uuid references public.orders (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_entitlements_updated_at on public.entitlements;
create trigger trg_entitlements_updated_at
before update on public.entitlements
for each row execute function public.set_updated_at();

create unique index if not exists entitlements_one_active_per_kind
on public.entitlements (user_id, kind)
where active;

alter table public.entitlements enable row level security;

do $$
begin
  create policy "entitlements.select.own"
  on public.entitlements
  for select
  to authenticated
  using (user_id = auth.uid());
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "entitlements.admin.select"
  on public.entitlements
  for select
  to authenticated
  using (public.is_admin());
exception
  when duplicate_object then null;
end $$;

-- Content tables for运营（可选，但与计划书范围一致）
create table if not exists public.important_dates (
  id uuid primary key default gen_random_uuid(),
  title_zh text not null,
  title_en text not null,
  date timestamptz not null,
  timezone text not null default 'AOE',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_important_dates_updated_at on public.important_dates;
create trigger trg_important_dates_updated_at
before update on public.important_dates
for each row execute function public.set_updated_at();

alter table public.important_dates enable row level security;

do $$
begin
  create policy "important_dates.public.select"
  on public.important_dates
  for select
  to anon, authenticated
  using (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "important_dates.admin.write"
  on public.important_dates
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
exception
  when duplicate_object then null;
end $$;

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title_zh text not null,
  title_en text not null,
  body_zh text not null default '',
  body_en text not null default '',
  published_at timestamptz,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_news_updated_at on public.news;
create trigger trg_news_updated_at
before update on public.news
for each row execute function public.set_updated_at();

alter table public.news enable row level security;

do $$
begin
  create policy "news.public.select"
  on public.news
  for select
  to anon, authenticated
  using (published_at is not null and published_at <= now());
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "news.admin.select"
  on public.news
  for select
  to authenticated
  using (public.is_admin());
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "news.admin.write"
  on public.news
  for insert, update, delete
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
exception
  when duplicate_object then null;
end $$;

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null default 'partner',
  logo_url text,
  website_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_sponsors_updated_at on public.sponsors;
create trigger trg_sponsors_updated_at
before update on public.sponsors
for each row execute function public.set_updated_at();

alter table public.sponsors enable row level security;

do $$
begin
  create policy "sponsors.public.select"
  on public.sponsors
  for select
  to anon, authenticated
  using (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "sponsors.admin.write"
  on public.sponsors
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
exception
  when duplicate_object then null;
end $$;
