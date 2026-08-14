-- Cole isso no SQL Editor do Supabase (dashboard > SQL Editor > New query > Run).

create table if not exists payments (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  cakto_order_id text,
  amount_cents integer,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists payments_session_id_idx on payments (session_id);
create index if not exists payments_status_idx on payments (status);

alter table payments enable row level security;

-- Sem policy nenhuma: só a secret key (que ignora RLS) lê/escreve essa tabela,
-- usada nas rotas /api/webhooks/cakto e /api/payments/status.
