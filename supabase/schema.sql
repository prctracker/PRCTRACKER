-- =====================================================================
-- Atlas Médico do Brasil (PRC Tracker) · banco de dados no Supabase
-- Rode este arquivo inteiro uma vez no SQL Editor do projeto.
-- Pode rodar de novo sem perder dados: tudo usa "if not exists"
-- ou recria só funções e regras.
-- =====================================================================

-- 0. Quem vira administrador ao se cadastrar --------------------------
-- O e-mail abaixo recebe papel de administrador já aprovado no primeiro
-- cadastro (o login só funciona depois de confirmar o e-mail, então
-- ninguém consegue se passar por ele). Troque ou acrescente e-mails aqui.
create table if not exists public.administradores_iniciais (
  email text primary key
);
insert into public.administradores_iniciais (email) values ('manhaesmed@gmail.com')
on conflict do nothing;

-- 1. Perfis: cadastro, aprovação e papel ------------------------------
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nome text not null default '',
  papel text not null default 'leitura' check (papel in ('admin', 'equipe', 'leitura')),
  status text not null default 'pendente' check (status in ('pendente', 'aprovado', 'bloqueado')),
  aceite_privacidade_em timestamptz,
  criado_em timestamptz not null default now(),
  decidido_por uuid references auth.users (id),
  decidido_em timestamptz
);

-- Funções de apoio às regras (security definer evita recursão nas regras).
create or replace function public.meu_perfil_status() returns text
language sql stable security definer set search_path = public as $$
  select status from public.perfis where id = auth.uid()
$$;
create or replace function public.sou_aprovado() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfis where id = auth.uid() and status = 'aprovado')
$$;
create or replace function public.sou_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfis where id = auth.uid() and status = 'aprovado' and papel = 'admin')
$$;
create or replace function public.posso_registrar() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfis where id = auth.uid() and status = 'aprovado' and papel in ('admin', 'equipe'))
$$;

-- Todo cadastro novo gera um perfil pendente (ou admin aprovado, se o e-mail estiver na lista acima).
create or replace function public.criar_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  eh_admin boolean := exists (select 1 from public.administradores_iniciais a where lower(a.email) = lower(new.email));
begin
  insert into public.perfis (id, email, nome, papel, status, aceite_privacidade_em, decidido_em)
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nome'), ''), split_part(new.email, '@', 1)),
    case when eh_admin then 'admin' else 'leitura' end,
    case when eh_admin then 'aprovado' else 'pendente' end,
    nullif(new.raw_user_meta_data ->> 'aceite_privacidade', '')::timestamptz,
    case when eh_admin then now() end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario after insert on auth.users
for each row execute function public.criar_perfil();

-- O papel e o status só mudam pelo administrador, e ele não pode se rebaixar sozinho.
create or replace function public.proteger_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.id <> old.id or new.email <> old.email or new.criado_em <> old.criado_em then
    raise exception 'Campos de identificação do perfil não podem ser alterados';
  end if;
  if (new.papel, new.status) is distinct from (old.papel, old.status) then
    if auth.uid() is not null and not public.sou_admin() then
      raise exception 'Só um administrador muda papel ou situação';
    end if;
    if auth.uid() = old.id and (new.papel <> 'admin' or new.status <> 'aprovado') then
      raise exception 'Você não pode remover o seu próprio acesso de administrador';
    end if;
    new.decidido_por := coalesce(auth.uid(), old.decidido_por);
    new.decidido_em := now();
  end if;
  return new;
end;
$$;
drop trigger if exists antes_de_alterar_perfil on public.perfis;
create trigger antes_de_alterar_perfil before update on public.perfis
for each row execute function public.proteger_perfil();

alter table public.perfis enable row level security;
drop policy if exists "perfil: ver o próprio ou todos se admin" on public.perfis;
create policy "perfil: ver o próprio ou todos se admin" on public.perfis
  for select to authenticated using (id = auth.uid() or public.sou_admin());
drop policy if exists "perfil: admin altera" on public.perfis;
create policy "perfil: admin altera" on public.perfis
  for update to authenticated using (public.sou_admin()) with check (public.sou_admin());

-- 2. Registro de acessos ---------------------------------------------
-- Só a função registrar-acesso (com a chave de serviço) grava aqui.
-- Ninguém edita nem apaga pelo site; só o administrador lê.
create table if not exists public.acessos (
  id bigserial primary key,
  usuario uuid references auth.users (id) on delete set null,
  email text,
  nome text,
  evento text not null check (evento in ('login', 'sessao', 'logout', 'aguardando', 'bloqueado')),
  em timestamptz not null default now(),
  ip text,
  cidade text,
  regiao text,
  pais text,
  provedor text,
  navegador text,
  sistema text,
  aparelho text,
  user_agent text,
  fuso text,
  idioma text,
  tela text,
  pagina text
);
create index if not exists acessos_em_idx on public.acessos (em desc);
create index if not exists acessos_usuario_idx on public.acessos (usuario, em desc);
alter table public.acessos enable row level security;
drop policy if exists "acessos: só admin lê" on public.acessos;
create policy "acessos: só admin lê" on public.acessos
  for select to authenticated using (public.sou_admin());

-- 3. Valores informados pela equipe ----------------------------------
create table if not exists public.valores_equipe (
  id uuid primary key default gen_random_uuid(),
  uf text not null check (uf ~ '^[a-z]{2}$'),
  uf_nome text,
  municipio text not null check (length(trim(municipio)) > 0),
  contratante text not null check (length(trim(contratante)) > 0),
  esfera text,
  especialidade text not null check (length(trim(especialidade)) > 0),
  forma text not null check (forma in ('Plantão 6h', 'Plantão 12h', 'Plantão 24h', 'Hora', 'Mensal', 'Por consulta')),
  carga numeric check (carga is null or (carga >= 1 and carga <= 80)),
  valor numeric not null check (valor > 0 and valor < 200000),
  -- horas e valor por hora são calculados pelo banco, não pelo navegador
  horas numeric generated always as (
    case forma when 'Plantão 6h' then 6 when 'Plantão 12h' then 12 when 'Plantão 24h' then 24
      when 'Hora' then 1 when 'Mensal' then round(carga * 4.345, 2) end
  ) stored,
  valor_hora numeric generated always as (
    case forma when 'Plantão 6h' then round(valor / 6, 2) when 'Plantão 12h' then round(valor / 12, 2)
      when 'Plantão 24h' then round(valor / 24, 2) when 'Hora' then valor
      when 'Mensal' then round(valor / (carga * 4.345), 2) end
  ) stored,
  bruto text,
  vinculo text,
  mes text not null check (mes ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  origem text not null,
  detalhe text,
  obs text,
  status text not null default 'ativo' check (status in ('ativo', 'arquivado')),
  autor uuid not null default auth.uid() references auth.users (id),
  autor_nome text,
  criado_em timestamptz not null default now(),
  arquivado_por uuid references auth.users (id),
  arquivado_em timestamptz,
  restaurado_por uuid references auth.users (id),
  restaurado_em timestamptz,
  constraint mensal_tem_carga check (forma <> 'Mensal' or carga is not null)
);
create index if not exists valores_equipe_uf_idx on public.valores_equipe (uf, status);

create or replace function public.preparar_valor_equipe() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.autor := auth.uid();
    new.autor_nome := (select nome from public.perfis where id = auth.uid());
    new.criado_em := now();
    new.status := 'ativo';
    new.arquivado_por := null; new.arquivado_em := null; new.restaurado_por := null; new.restaurado_em := null;
    return new;
  end if;
  -- Depois de gravado, o valor não muda: só arquivar ou restaurar.
  if (new.uf, new.municipio, new.contratante, new.esfera, new.especialidade, new.forma, new.carga, new.valor,
      new.bruto, new.vinculo, new.mes, new.origem, new.detalhe, new.obs, new.autor, new.autor_nome, new.criado_em)
     is distinct from
     (old.uf, old.municipio, old.contratante, old.esfera, old.especialidade, old.forma, old.carga, old.valor,
      old.bruto, old.vinculo, old.mes, old.origem, old.detalhe, old.obs, old.autor, old.autor_nome, old.criado_em) then
    raise exception 'Um valor registrado não pode ser editado; arquive e registre de novo';
  end if;
  if new.status = 'arquivado' and old.status <> 'arquivado' then
    new.arquivado_por := auth.uid(); new.arquivado_em := now();
  elsif new.status = 'ativo' and old.status <> 'ativo' then
    new.restaurado_por := auth.uid(); new.restaurado_em := now();
  end if;
  return new;
end;
$$;
drop trigger if exists antes_de_gravar_valor on public.valores_equipe;
create trigger antes_de_gravar_valor before insert or update on public.valores_equipe
for each row execute function public.preparar_valor_equipe();

alter table public.valores_equipe enable row level security;
drop policy if exists "valores: aprovados leem" on public.valores_equipe;
create policy "valores: aprovados leem" on public.valores_equipe
  for select to authenticated using (public.sou_aprovado());
drop policy if exists "valores: equipe registra" on public.valores_equipe;
create policy "valores: equipe registra" on public.valores_equipe
  for insert to authenticated with check (public.posso_registrar());
drop policy if exists "valores: autor ou admin arquiva" on public.valores_equipe;
create policy "valores: autor ou admin arquiva" on public.valores_equipe
  for update to authenticated
  using (public.sou_admin() or (autor = auth.uid() and public.posso_registrar()))
  with check (public.sou_admin() or (autor = auth.uid() and public.posso_registrar()));

-- 4. Novidades da atualização automática -----------------------------
-- Gravadas só pela tarefa semanal do GitHub (chave de serviço). O site só lê.
create table if not exists public.auto_valores (
  id text primary key,
  uf text not null,
  data date,
  municipio text,
  orgao text,
  modalidade text,
  controle_pncp text,
  item integer,
  descricao text,
  unidade text,
  quantidade numeric,
  valor_estimado numeric,
  valor_homologado numeric,
  valor numeric,
  base text,
  contratado text,
  horas numeric,
  valor_hora numeric,
  url text not null check (url ~ '^https://'),
  consultado_em date not null,
  encontrado_em timestamptz not null default now()
);
create table if not exists public.auto_contratos (
  id text primary key,
  uf text not null,
  data date,
  municipio text,
  orgao text,
  fornecedor text,
  cnpj text,
  tipo_pessoa text,
  objeto text,
  valor_global numeric,
  inicio date,
  fim date,
  modalidade text,
  controle_pncp text,
  url text not null check (url ~ '^https://'),
  consultado_em date not null,
  encontrado_em timestamptz not null default now()
);
create table if not exists public.auto_noticias (
  id text primary key,
  uf text not null,
  data date,
  local text,
  tema text,
  resumo text not null,
  veiculo text,
  url text not null check (url ~ '^https://'),
  origem text,
  consultado_em date not null,
  encontrado_em timestamptz not null default now()
);
create table if not exists public.atualizacoes (
  id text primary key,
  data date not null,
  status text not null,
  resumo text,
  janela_de date,
  janela_ate date,
  por_estado jsonb not null default '{}'::jsonb,
  observacoes text,
  criado_em timestamptz not null default now()
);
do $$
declare t text;
begin
  foreach t in array array['auto_valores', 'auto_contratos', 'auto_noticias', 'atualizacoes'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "%s: aprovados leem" on public.%I', t, t);
    execute format('create policy "%s: aprovados leem" on public.%I for select to authenticated using (public.sou_aprovado())', t, t);
  end loop;
end $$;

insert into public.atualizacoes (id, data, status, resumo, janela_de, janela_ate, observacoes)
values ('2026-11-02', '2026-11-02', 'Base inicial',
  'Site criado a partir dos quatro relatórios estaduais: Tocantins (28/10/2026), Alagoas (29/10/2026), Roraima (30/10/2026) e Rio Grande do Sul (02/11/2026). As varreduras semanais buscam o que foi publicado depois dessas datas.',
  null, '2026-11-02', 'Registro de partida; nenhuma varredura nesta data.')
on conflict (id) do nothing;

-- 5. Relatórios em armazenamento privado -----------------------------
insert into storage.buckets (id, name, public) values ('relatorios', 'relatorios', false)
on conflict (id) do nothing;
drop policy if exists "relatorios: aprovados leem" on storage.objects;
create policy "relatorios: aprovados leem" on storage.objects
  for select to authenticated using (bucket_id = 'relatorios' and public.sou_aprovado());

-- 6. Permissões básicas -----------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, update on public.perfis to authenticated;
grant select on public.acessos to authenticated;
grant select, insert, update on public.valores_equipe to authenticated;
grant select on public.auto_valores, public.auto_contratos, public.auto_noticias, public.atualizacoes to authenticated;
revoke all on public.administradores_iniciais from anon, authenticated;
grant execute on function public.meu_perfil_status(), public.sou_aprovado(), public.sou_admin(), public.posso_registrar() to authenticated;

-- 7. Atualização ao vivo dos valores da equipe no site -----------------
do $$
begin
  begin
    alter publication supabase_realtime add table public.valores_equipe;
  exception when duplicate_object then null;
           when undefined_object then null;
  end;
end $$;
