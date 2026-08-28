-- Cole isso no SQL Editor do Supabase (dashboard > SQL Editor > New query > Run).

create table if not exists leads (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  email text not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);

-- Uma pessoa que responde o quiz de novo na mesma sessão não vira duas linhas.
create unique index if not exists leads_session_id_idx on leads (session_id);

alter table leads enable row level security;

-- Mesmo padrão de funnel_events e feedback: a anon key só insere. Nada de
-- select para "anon" — a lista só sai pela secret key, server-side.
create policy "anon can insert leads"
  on leads
  for insert
  to anon
  with check (true);
