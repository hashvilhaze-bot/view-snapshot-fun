begin;
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;
create table if not exists site_content_private.form_checks(
 ticket uuid primary key, token_hash text not null, request_id bigint not null, created_at timestamptz not null default now()
);

create table if not exists site_content_private.crm_staff(email text primary key);
insert into site_content_private.crm_staff values
  ('yardenlazar96@gmail.com'), ('hertz.ohad@gmail.com'), ('hashvilhaze@gmail.com') on conflict do nothing;
create table if not exists site_content_private.leads (
  id uuid primary key, created_at timestamptz not null default now(),
  form text not null, origin_page text not null, channel text not null, payload jsonb not null,
  status text not null default 'new', assignee text references site_content_private.crm_staff,
  follow_up date, version integer not null default 1,
  attempts integer not null default 0, delivery text not null default 'pending',
  request_id bigint, queued_at timestamptz
);
create index if not exists leads_created on site_content_private.leads(created_at desc,id);
create index if not exists leads_delivery on site_content_private.leads(delivery,queued_at);
create index if not exists leads_phone_time on site_content_private.leads((payload->>'phone'),created_at);
create table if not exists site_content_private.lead_notes (
  id bigint generated always as identity primary key, lead_id uuid not null references site_content_private.leads,
  actor text not null, body text not null, created_at timestamptz not null default now()
);
create index if not exists lead_notes_lookup on site_content_private.lead_notes(lead_id,id);
create table if not exists site_content_private.change_log(
  id bigint generated always as identity primary key, actor text not null,
  action text not null, target text not null, created_at timestamptz not null default now()
);
alter table site_content_private.change_log add column if not exists detail text not null default '';
create table if not exists site_content_private.page_settings (
  path text primary key, config jsonb not null, version integer not null
);
create table if not exists site_content_private.integrations(
  slot integer primary key check(slot=1), config jsonb not null default '{}', version integer not null default 0
);
insert into site_content_private.integrations(slot) values (1) on conflict do nothing;
create table if not exists site_content_private.article_calendar(path text primary key, published_on date not null);
insert into site_content_private.article_calendar values
  ('/knowledge/nepal-planning','2026-11-25'),('/knowledge/nepal-close-up','2026-11-25'),('/knowledge/himalayas','2026-11-25')
  on conflict do nothing;

create or replace function site_content_private.editor_email() returns text
language sql stable security definer set search_path='' as $$
 select lower(u.email) from auth.users u where u.id=auth.uid() and public.can_edit_treks();
$$;
create or replace function site_content_private.require_staff() returns text
language plpgsql stable security definer set search_path='' as $$
declare actor text:=site_content_private.editor_email();
begin
 if not exists(select from site_content_private.crm_staff where email=actor) then
   raise exception 'Access denied' using errcode='42501'; end if;
 return actor;
end; $$;

create or replace function public.cms_public_config() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('integrations',(select config-array['googleClient','property','searchProperty'] from site_content_private.integrations where slot=1),
   'pages',coalesce((select jsonb_object_agg(path,config-'focus') from site_content_private.page_settings),'{}'::jsonb));
$$;
revoke all on function public.cms_public_config() from public;
grant execute on function public.cms_public_config() to anon,authenticated;

create or replace function public.cms_receive_lead(ticket uuid, form_kind text, origin_path text, source_channel text, fields jsonb, challenge text)
returns boolean language plpgsql security definer set search_path='' as $$
declare check_row site_content_private.form_checks; rid bigint; old_row site_content_private.leads; widget text; secret_value text; verdict jsonb;
begin
 if ticket is null or form_kind is null or form_kind not in ('contact','quote')
 or coalesce(origin_path,'') !~ '^/[a-z0-9/-]{0,155}$' or coalesce(source_channel,'') !~ '^[a-zA-Z0-9_.:/-]{1,120}$'
 or jsonb_typeof(fields) is distinct from 'object' or octet_length(fields::text)>24000
 or length(trim(coalesce(fields->>'name',''))) not between 1 and 160
 or coalesce(fields->>'phone','') !~ '^[+0-9 .()-]{7,30}$' or length(regexp_replace(fields->>'phone','[^0-9]','','g')) not between 7 and 15
 or (form_kind='contact' and length(trim(coalesce(fields->>'note','')))=0)
 or exists(select from jsonb_each(fields) f where jsonb_typeof(f.value)<>'string' or length(f.value#>>'{}')>6500)
 or fields-array['name','phone','email','note','source','dates','travelers','interests','selected','considered','quizAnswers','matchAnswers','fitScores','contextSource','signedIn']<>'{}'::jsonb
 then raise exception 'Invalid submission' using errcode='22023'; end if;
 perform pg_advisory_xact_lock(45672,hashtext(ticket::text));
 select * into old_row from site_content_private.leads where id=ticket;
 if found then
   if old_row.payload<>fields or old_row.form<>form_kind then raise exception 'Submission conflict'; end if;
   return true;
 end if;
 perform pg_advisory_xact_lock(45673,hashtext(fields->>'phone'));
 if (select count(*) from site_content_private.leads where payload->>'phone'=fields->>'phone' and created_at>now()-interval '10 minutes')>=5
 then raise exception 'Please try later'; end if;
 select config->>'turnstile' into widget from site_content_private.integrations where slot=1;
 if coalesce(widget,'')<>'' then
   select decrypted_secret into secret_value from vault.decrypted_secrets where name='hashvil_turnstile_secret';
   if secret_value is null or coalesce(length(challenge),0) not between 1 and 2048 then raise exception 'Verification required'; end if;
   select * into check_row from site_content_private.form_checks where form_checks.ticket=cms_receive_lead.ticket;
   if not found or check_row.token_hash<>md5(challenge) or check_row.created_at<now()-interval '5 minutes' then
     select net.http_post(url:='https://challenges.cloudflare.com/turnstile/v0/siteverify',
       body:=jsonb_build_object('secret',secret_value,'response',challenge,'idempotency_key',gen_random_uuid()),timeout_milliseconds:=10000) into rid;
     insert into site_content_private.form_checks values(ticket,md5(challenge),rid,now()) on conflict on constraint form_checks_pkey do update
       set token_hash=excluded.token_hash,request_id=excluded.request_id,created_at=excluded.created_at;
     return false;
   end if;
   select case when status_code=200 then content::jsonb else '{}'::jsonb end into verdict from net._http_response where id=check_row.request_id;
   if not found then return false; end if;
   if verdict->>'success' is distinct from 'true' or verdict->>'action' is distinct from 'lead' then raise exception 'Verification failed'; end if;
   delete from site_content_private.form_checks where form_checks.ticket=cms_receive_lead.ticket;
 end if;
 insert into site_content_private.leads(id,form,origin_page,channel,payload) values(ticket,form_kind,origin_path,source_channel,fields);
 return true;
end; $$;
revoke all on function public.cms_receive_lead(uuid,text,text,text,jsonb,text) from public;
grant execute on function public.cms_receive_lead(uuid,text,text,text,jsonb,text) to anon,authenticated;

-- Make delivery is independent of the visitor's connection. Keep a stable submissionId on retries.
create or replace function site_content_private.deliver_leads() returns void
language plpgsql security definer set search_path='' as $$
declare endpoint text; entry record; rid bigint;
begin
 if not pg_try_advisory_xact_lock(17814155) then return; end if;
 delete from site_content_private.form_checks where created_at<now()-interval '10 minutes';
 select decrypted_secret into endpoint from vault.decrypted_secrets where name='hashvil_make_webhook';
 if endpoint is null then return; end if;
 update site_content_private.leads l set delivery=case when r.status_code between 200 and 299 then 'sent'
  when l.attempts>=5 then 'failed' else 'retry' end
 from net._http_response r where l.delivery='queued' and l.request_id=r.id;
 update site_content_private.leads set delivery=case when attempts>=5 then 'failed' else 'retry' end
   where delivery='queued' and queued_at<now()-interval '12 minutes';
 for entry in select * from site_content_private.leads where delivery='pending'
 or (delivery='retry' and queued_at < now() - interval '1 minute' * greatest(1,attempts*attempts))
 order by created_at limit 50 for update skip locked loop
   select net.http_post(url:=endpoint,body:=entry.payload||jsonb_build_object('submittedAt',entry.created_at,'submissionId',entry.id,'originPage',entry.origin_page,'channel',entry.channel),timeout_milliseconds:=10000) into rid;
   update site_content_private.leads set delivery='queued',attempts=attempts+1,request_id=rid,queued_at=now() where id=entry.id;
 end loop;
end; $$;
revoke all on all functions in schema site_content_private from public, anon, authenticated;
select cron.schedule('hashvil-deliver-leads','* * * * *','select site_content_private.deliver_leads()');

create or replace function public.cms_read(section text, opts jsonb default '{}') returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare authorized_staff text:=site_content_private.require_staff(); result jsonb; skip_rows integer:=greatest(0,coalesce((opts->>'offset')::int,0)); days integer:=coalesce((opts->>'days')::int,30);
begin
 if days not in (7,30,90,365) then raise exception 'Invalid period'; end if;
 case section
 when 'staff' then select jsonb_agg(email order by email) into result from site_content_private.crm_staff;
 when 'overview' then
 select jsonb_build_object('leads',count(*) filter(where created_at>=now()-interval '30 days'),
 'won',count(*) filter(where created_at>=now()-interval '30 days' and status='won'),
 'due',count(*) filter(where follow_up<=(now() at time zone 'Asia/Jerusalem')::date and status not in ('won','irrelevant')))
 into result from site_content_private.leads;
 when 'leads' then
 with visible as (
 select l.id,l.created_at,l.form,l.origin_page,l.channel,l.payload,l.status,l.assignee,l.follow_up,l.version,l.delivery,
 coalesce((select jsonb_agg(jsonb_build_object('actor',n.actor,'body',n.body,'created_at',n.created_at) order by n.id desc) from site_content_private.lead_notes n where n.lead_id=l.id),'[]') as notes
 from site_content_private.leads l where (coalesce(opts->>'status','')='' or l.status=opts->>'status')
 and (not coalesce((opts->>'due')::boolean,false) or (l.follow_up <= (now() at time zone 'Asia/Jerusalem')::date and l.status not in ('won','irrelevant')))
 order by l.created_at desc,l.id limit 31 offset skip_rows)
 select jsonb_build_object('rows',coalesce(jsonb_agg(to_jsonb(visible) order by created_at desc,id),'[]'),
 'staff',(select jsonb_agg(email order by email) from site_content_private.crm_staff)) into result from visible;
 when 'reports' then
 with grouped as (select form,origin_page,channel,count(*) as leads,count(*) filter(where status='won') as won
 from site_content_private.leads where created_at>=now()-make_interval(days=>days)
 group by form,origin_page,channel)
 select coalesce(jsonb_agg(to_jsonb(grouped) order by leads desc),'[]') into result from grouped;
 when 'calendar' then
 select jsonb_build_object('dates',coalesce((select jsonb_object_agg(path,published_on) from site_content_private.article_calendar),'{}'),
 'leads',coalesce((select jsonb_object_agg(origin_page,total) from (select origin_page,count(*) total from site_content_private.leads
  where created_at>=now()-make_interval(days=>days) and origin_page like '/knowledge/%' group by origin_page) a),'{}')) into result;
 when 'history' then
 select coalesce(jsonb_agg(to_jsonb(a) order by created_at desc, target,action),'[]') into result from (
 select * from (select created_at,actor,action,target,detail from site_content_private.change_log union all
 select r.created_at,coalesce(u.email,'חשבון שהוסר'),case when r.published then 'publish' else 'draft' end,case when r.slug='home' then '/' else '/treks/'||r.slug end,'גרסה '||r.revision
 from public.trek_revisions r left join auth.users u on u.id=r.edited_by) h where coalesce(opts->>'actor','')='' or actor=opts->>'actor' order by created_at desc,target,action limit 51 offset skip_rows) a;
 when 'settings' then select jsonb_build_object('config',config,'version',version,
 'captchaSecret',exists(select from vault.secrets where name='hashvil_turnstile_secret')) into result from site_content_private.integrations where slot=1;
 when 'seo' then select coalesce((select jsonb_build_object('config',config,'version',version) from site_content_private.page_settings where path=opts->>'path'),'{"config":{},"version":0}') into result;
 else raise exception 'Unknown section'; end case;
 return result;
end; $$;
revoke all on function public.cms_read(text,jsonb) from public,anon;
grant execute on function public.cms_read(text,jsonb) to authenticated;

create or replace function public.cms_edit(action_name text, target_key text, expected integer, value jsonb) returns void
language plpgsql security definer set search_path='' as $$
declare actor text:=site_content_private.require_staff(); current_ver integer; lead site_content_private.leads; field text; secret_id uuid; details text; prior jsonb; changed_secret boolean:=false;
begin
 if action_name is null or target_key is null or jsonb_typeof(value) is distinct from 'object' or octet_length(value::text)>16000 then raise exception 'Invalid values'; end if;
 perform pg_advisory_xact_lock(34507,hashtext(target_key));
 case action_name
 when 'lead' then
 select * into strict lead from site_content_private.leads where id=target_key::uuid for update;
 if lead.version is distinct from expected then raise exception 'Revision conflict' using errcode='40001'; end if;
 if coalesce(value->>'status','') not in ('new','working','offered','won','irrelevant') or length(coalesce(value->>'note',''))>4000 then raise exception 'Invalid lead'; end if;
 details:=concat_ws(' · ',case when lead.status is distinct from value->>'status' then 'status:'||(value->>'status') end,
 case when lead.assignee is distinct from nullif(value->>'assignee','') then 'שיוך למטפל' end,
 case when lead.follow_up is distinct from nullif(value->>'follow_up','')::date then 'תאריך מעקב' end,
 case when trim(coalesce(value->>'note',''))<>'' then 'הערה פנימית' end);
 update site_content_private.leads set status=value->>'status',assignee=nullif(value->>'assignee',''),
 follow_up=nullif(value->>'follow_up','')::date,version=version+1 where id=lead.id;
 if trim(coalesce(value->>'note',''))<>'' then insert into site_content_private.lead_notes(lead_id,actor,body) values(lead.id,actor,trim(value->>'note')); end if;
 when 'retry' then
 update site_content_private.leads set delivery='pending',attempts=0 where id=target_key::uuid and delivery='failed';
 if not found then raise exception 'Already queued'; end if;
 when 'calendar' then
 details:=value->>'date';
 if target_key !~ '^/knowledge/[a-z0-9-]{1,100}$' or (value->>'date')::date > (now() at time zone 'Asia/Jerusalem')::date then raise exception 'Invalid article date'; end if;
 if coalesce((select published_on::text from site_content_private.article_calendar where path=target_key),'') is distinct from coalesce(value->>'previous','') then raise exception 'Revision conflict' using errcode='40001'; end if;
 insert into site_content_private.article_calendar values(target_key,(value->>'date')::date) on conflict(path) do update set published_on=excluded.published_on;
 when 'seo' then
 if target_key !~ '^/([a-z0-9-]+(/[a-z0-9-]+)?)?$' or target_key ~ '^/(admin|auth|profile|pilot)(/|$)'
 or value-array['title','description','image','noindex','focus']<>'{}'::jsonb or length(coalesce(value->>'title',''))>130 or length(coalesce(value->>'description',''))>400
 or (coalesce(value->>'image','')<>'' and (value->>'image' !~ '^https://[^[:space:]]+$' or length(value->>'image')>1800))
 or length(coalesce(value->>'focus',''))>100 or exists(select from jsonb_each(value-'noindex') f where jsonb_typeof(f.value)<>'string')
 or (value ? 'noindex' and jsonb_typeof(value->'noindex')<>'boolean') then raise exception 'Invalid SEO'; end if;
 select coalesce((select version from site_content_private.page_settings where path=target_key),0) into current_ver;
 if expected is distinct from current_ver then raise exception 'Revision conflict' using errcode='40001'; end if;
 select config into prior from site_content_private.page_settings where path=target_key;
 select string_agg(k,', ' order by k) into details from jsonb_object_keys(coalesce(prior,'{}')||value) k where (prior->k) is distinct from (value->k);
 insert into site_content_private.page_settings values(target_key,value,current_ver+1)
 on conflict(path) do update set config=excluded.config,version=excluded.version;
 when 'settings' then
 if coalesce(value->>'turnstileSecret','')<>'' then
   if length(value->>'turnstileSecret') not between 15 and 200 or value->>'turnstileSecret' !~ '^[a-zA-Z0-9_-]+$' then raise exception 'Invalid secret'; end if;
   changed_secret:=true;
   select id into secret_id from vault.secrets where name='hashvil_turnstile_secret';
   if secret_id is null then perform vault.create_secret(value->>'turnstileSecret','hashvil_turnstile_secret');
   else perform vault.update_secret(secret_id,value->>'turnstileSecret'); end if;
 end if;
 value:=value-'turnstileSecret';
 if target_key<>'integrations' or value-array['ga','pixel','verification','turnstile','googleClient','property','searchProperty']<>'{}'::jsonb then raise exception 'Invalid settings'; end if;
 for field in select jsonb_object_keys(value) loop
 if jsonb_typeof(value->field)<>'string' or (value->>field<>'' and value->>field !~ (case field
 when 'ga' then '^G-[A-Z0-9]{4,20}$' when 'pixel' then '^[0-9]{5,25}$' when 'verification' then '^[A-Za-z0-9_-]{8,160}$'
 when 'turnstile' then '^[0-9A-Za-z_-]{10,120}$' when 'googleClient' then '^[a-zA-Z0-9-]+\.apps\.googleusercontent\.com$'
 when 'property' then '^[0-9]{1,20}$' else '^(sc-domain:[a-zA-Z0-9.-]+|https://[a-zA-Z0-9./_-]+)$' end)) then raise exception 'Invalid integration: %',field; end if;
 end loop;
 if coalesce(value->>'turnstile','')<>'' and not exists(select from vault.secrets where name='hashvil_turnstile_secret') then raise exception 'Captcha secret missing'; end if;
 select config into prior from site_content_private.integrations where slot=1;
 select string_agg(k,', ' order by k) into details from jsonb_object_keys(coalesce(prior,'{}')||value) k where (prior->k) is distinct from (value->k);
 if changed_secret then details:=concat_ws(', ',details,'מפתח אימות'); end if;
 update site_content_private.integrations set config=value,version=version+1 where slot=1 and version=expected;
 if not found then raise exception 'Revision conflict' using errcode='40001'; end if;
 else raise exception 'Unknown action'; end case;
 insert into site_content_private.change_log(actor,action,target,detail) values(actor,action_name,target_key,coalesce(details,''));
end; $$;
revoke all on function public.cms_edit(text,text,integer,jsonb) from public,anon;
grant execute on function public.cms_edit(text,text,integer,jsonb) to authenticated;
notify pgrst,'reload schema';
commit;
