do $$
begin
  alter table public.profiles
    add column if not exists full_name text,
    add column if not exists affiliation text,
    add column if not exists country_region text,
    add column if not exists contact text,
    add column if not exists updated_at timestamptz not null default now();
exception
  when duplicate_column then null;
end $$;

do $$
begin
  alter table public.profiles
    add constraint profiles_role_check
    check (role in ('user', 'admin'));
exception
  when duplicate_object then null;
end $$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

