-- Cole isso no SQL Editor do Supabase (dashboard > SQL Editor > New query > Run).

create table if not exists funnel_events (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  event_name text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists funnel_events_event_name_idx on funnel_events (event_name);
create index if not exists funnel_events_session_id_idx on funnel_events (session_id);
create index if not exists funnel_events_created_at_idx on funnel_events (created_at desc);

alter table funnel_events enable row level security;

-- Cliente (anon key) só grava evento. Ninguém lê por essa chave, nem o dono das
-- próprias linhas: sem policy de select para "anon", só leitura via secret key
-- (que ignora RLS), usada apenas no dashboard admin server-side.
create policy "anon can insert funnel_events"
  on funnel_events
  for insert
  to anon
  with check (true);

create table if not exists feedback (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  rating smallint check (rating between 1 and 5),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on feedback (created_at desc);

alter table feedback enable row level security;

create policy "anon can insert feedback"
  on feedback
  for insert
  to anon
  with check (true);
