alter table public.api_keys
add column if not exists usage_count integer not null default 0;

alter table public.api_keys
add column if not exists usage_limit integer;

update public.api_keys
set usage_limit = 10
where usage_limit is null;

alter table public.api_keys
alter column usage_limit set default 10;

alter table public.api_keys
alter column usage_limit set not null;
