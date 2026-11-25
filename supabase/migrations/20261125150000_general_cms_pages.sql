begin;

-- Keep the history and published copy for every existing trek in place.
create or replace function public.write_site_revision(page_key text, expected_revision integer, page_content jsonb, publish_now boolean)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  latest integer;
  field text;
  fields constant text[] := array['kicker','titleStart','titleAccent','titleEnd','intro'];
begin
  if page_key is distinct from 'home' then
    return public.write_trek_revision(page_key, expected_revision, page_content, publish_now);
  end if;
  if not public.can_edit_treks() then raise exception 'Editor access required' using errcode='42501'; end if;
  if publish_now is null or page_content is null or jsonb_typeof(page_content) <> 'object'
    or not (page_content ?& fields) or page_content - fields <> '{}'::jsonb then
    raise exception 'Invalid home page';
  end if;
  foreach field in array fields loop
    if jsonb_typeof(page_content->field) <> 'string' or
      length(page_content->>field) > (case field when 'intro' then 1500 when 'kicker' then 140 else 100 end)
      or (field in ('titleStart','intro') and trim(page_content->>field)='') then
      raise exception 'Invalid home page field';
    end if;
  end loop;
  perform pg_advisory_xact_lock(53111,hashtext(page_key));
  select coalesce(max(revision),0) into latest from public.trek_revisions where slug=page_key;
  if expected_revision is distinct from latest then raise exception 'Revision conflict' using errcode='40001'; end if;
  latest := latest + 1;
  insert into public.trek_revisions(slug,revision,content,published,edited_by)
    values (page_key,latest,page_content,publish_now,auth.uid());
  if publish_now then
    insert into public.trek_published(slug,revision,content) values (page_key,latest,page_content)
      on conflict (slug) do update set revision=excluded.revision, content=excluded.content;
  end if;
  return latest;
end;
$$;
revoke all on function public.write_site_revision(text,integer,jsonb,boolean) from public, anon;
grant execute on function public.write_site_revision(text,integer,jsonb,boolean) to authenticated;
commit;
