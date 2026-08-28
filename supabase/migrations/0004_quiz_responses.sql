-- Cole isso no SQL Editor do Supabase (dashboard > SQL Editor > New query > Run).

create table if not exists quiz_responses (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  question_id text not null,
  question_type text not null check (question_type in ('choice', 'open')),
  -- Para 'choice' guarda o id da opção; para 'open', o texto que a pessoa escreveu.
  answer text not null,
  created_at timestamptz not null default now()
);

create index if not exists quiz_responses_session_id_idx on quiz_responses (session_id);
create index if not exists quiz_responses_question_id_idx on quiz_responses (question_id);
create index if not exists quiz_responses_created_at_idx on quiz_responses (created_at desc);

alter table quiz_responses enable row level security;

-- Mesmo padrão das outras tabelas: a anon key só insere, nunca lê nem altera.
-- Por isso não há unique em (session_id, question_id): voltar e trocar a resposta
-- grava uma linha nova, e o painel admin lê só a mais recente de cada par. Sai
-- mais barato que abrir permissão de update para o cliente.
create policy "anon can insert quiz_responses"
  on quiz_responses
  for insert
  to anon
  with check (true);
