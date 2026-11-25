begin;

create schema if not exists site_content_private;
revoke all on schema site_content_private from public, anon, authenticated;

create table if not exists site_content_private.editor_emails (
  email text primary key check (email = lower(email))
);

create or replace function public.can_edit_treks()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.users u
    join auth.identities i on i.user_id = u.id and i.provider = 'google'
    join site_content_private.editor_emails e on e.email = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null
      and lower(i.identity_data->>'email') = e.email and i.identity_data->>'email_verified' = 'true'
  );
$$;
revoke all on function public.can_edit_treks() from public, anon;
grant execute on function public.can_edit_treks() to authenticated;

create table if not exists public.trek_revisions (
  slug text not null,
  revision integer not null,
  content jsonb not null,
  published boolean not null,
  edited_by uuid not null,
  created_at timestamptz not null default now(),
  primary key (slug, revision)
);
create table if not exists public.trek_published (
  slug text primary key,
  revision integer not null,
  content jsonb not null,
  foreign key (slug, revision) references public.trek_revisions(slug,revision)
);
alter table public.trek_revisions enable row level security;
alter table public.trek_published enable row level security;
revoke all on public.trek_revisions, public.trek_published from public, anon, authenticated;
grant select on public.trek_revisions to authenticated;
grant select on public.trek_published to anon, authenticated;
do $$ begin
  if not exists (select from pg_policies where schemaname='public' and tablename='trek_revisions' and policyname='Editors can read revision history') then
    create policy "Editors can read revision history" on public.trek_revisions for select to authenticated using ((select public.can_edit_treks()));
  end if;
  if not exists (select from pg_policies where schemaname='public' and tablename='trek_published' and policyname='Visitors can read published trek text') then
    create policy "Visitors can read published trek text" on public.trek_published for select to anon, authenticated using (true);
  end if;
end $$;

create or replace function public.write_trek_revision(trek_slug text, expected_revision integer, page_content jsonb, publish_now boolean)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  current_revision integer;
  next_revision integer;
begin
  if not public.can_edit_treks() then raise exception 'Editor access required' using errcode='42501'; end if;
  if trek_slug is null or trek_slug not in ('everest-base-camp','annapurna-circuit','annapurna-base-camp','manaslu-circuit','langtang-valley','gosaikunda','mardi-himal','khopra-danda','poon-hill')
    or publish_now is null or page_content is null or jsonb_typeof(page_content) <> 'object'
    or octet_length(page_content::text) > 180000 or not (page_content ?& array['description','difference','altitude','stages'])
    or jsonb_typeof(page_content->'stages') <> 'array' then raise exception 'Invalid trek'; end if;
  if jsonb_array_length(page_content->'stages') not between 1 and 65
    or exists (select from unnest(array['description','difference','altitude']) f where jsonb_typeof(page_content->f) <> 'string' or length(trim(page_content->>f))=0)
    or exists (select from jsonb_array_elements(page_content->'stages') s where
      not(s ?& array['id','start','end','kind','time','story']) or s->>'kind' not in ('walk','acclimatization','transfer')
      or exists (select from unnest(array['id','start','end','kind','time','story']) f where jsonb_typeof(s->f) <> 'string' or (f<>'time' and length(trim(s->>f))=0)))
    or (select count(distinct s->>'id') from jsonb_array_elements(page_content->'stages') s) <> jsonb_array_length(page_content->'stages')
    then raise exception 'Invalid trek fields'; end if;

  perform pg_advisory_xact_lock(53111,hashtext(trek_slug));
  select coalesce(max(revision),0) into current_revision from public.trek_revisions where slug=trek_slug;
  if expected_revision is distinct from current_revision then raise exception 'Revision conflict' using errcode='40001'; end if;
  next_revision := current_revision + 1;
  insert into public.trek_revisions(slug, revision, content, published, edited_by)
    values (trek_slug, next_revision, page_content, publish_now, auth.uid());
  if publish_now then
    insert into public.trek_published(slug, revision, content) values (trek_slug,next_revision,page_content)
      on conflict (slug) do update set revision=excluded.revision, content=excluded.content;
  end if;
  return next_revision;
end;
$$;
revoke all on function public.write_trek_revision(text,integer,jsonb,boolean) from public, anon;
grant execute on function public.write_trek_revision(text,integer,jsonb,boolean) to authenticated;
commit;
