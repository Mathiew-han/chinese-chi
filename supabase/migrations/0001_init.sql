create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles.select.own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles.insert.own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles.update.own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  abstract text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_submissions_updated_at on public.submissions;
create trigger trg_submissions_updated_at
before update on public.submissions
for each row execute function public.set_updated_at();

alter table public.submissions enable row level security;

create policy "submissions.select.own"
on public.submissions
for select
to authenticated
using (user_id = auth.uid());

create policy "submissions.insert.own"
on public.submissions
for insert
to authenticated
with check (user_id = auth.uid());

create policy "submissions.update.own"
on public.submissions
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "submissions.delete.own"
on public.submissions
for delete
to authenticated
using (user_id = auth.uid());

create policy "submissions.admin.select"
on public.submissions
for select
to authenticated
using (public.is_admin());

create policy "submissions.admin.update"
on public.submissions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table if not exists public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null default 'paper',
  path text not null,
  created_at timestamptz not null default now()
);

alter table public.submission_files enable row level security;

create policy "submission_files.select.own"
on public.submission_files
for select
to authenticated
using (user_id = auth.uid());

create policy "submission_files.insert.own"
on public.submission_files
for insert
to authenticated
with check (user_id = auth.uid());

create policy "submission_files.admin.select"
on public.submission_files
for select
to authenticated
using (public.is_admin());

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  amount integer not null,
  currency text not null,
  status text not null default 'created',
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

create policy "orders.select.own"
on public.orders
for select
to authenticated
using (user_id = auth.uid());

create policy "orders.insert.own"
on public.orders
for insert
to authenticated
with check (user_id = auth.uid());

create policy "orders.update.own"
on public.orders
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "orders.admin.select"
on public.orders
for select
to authenticated
using (public.is_admin());

create policy "orders.admin.update"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  meta jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

create policy "audit_logs.admin.select"
on public.audit_logs
for select
to authenticated
using (public.is_admin());

create policy "audit_logs.admin.insert"
on public.audit_logs
for insert
to authenticated
with check (public.is_admin());

