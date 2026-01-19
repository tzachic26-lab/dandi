alter table public.api_keys
add column if not exists user_id text;

create index if not exists api_keys_user_id_idx on public.api_keys(user_id);
