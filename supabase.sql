-- Run in a fresh Supabase project SQL editor. Service-role access only.
create table papers(id text primary key,title text not null,abstract text not null,authors text not null,published timestamptz not null,updated timestamptz,url text not null,shelf text not null check(shelf in ('finance','quantum')),source_text text);
create table jobs(id uuid primary key default gen_random_uuid(),"paperId" text references papers(id),minutes int check(minutes between 5 and 25),dedup text not null,status text not null check(status in ('queued','processing','ready','failed')),attempts int default 0,created_at timestamptz default now(),started_at timestamptz,finished_at timestamptz,audio_key text,transcript_key text,duration numeric,error text);
create unique index one_active_episode on jobs(dedup) where status in ('queued','processing','ready');
create table feedback(id uuid primary key default gen_random_uuid(),"paperId" text not null,difficulty int check(difficulty between 1 and 5),usefulness int check(usefulness between 1 and 5),created_at timestamptz default now());
create table settings(id text primary key,checked_at timestamptz not null);
create table request_limits(id text primary key,window_at timestamptz not null,hits int not null);
alter table papers enable row level security;alter table jobs enable row level security;alter table feedback enable row level security;alter table settings enable row level security;alter table request_limits enable row level security;
create or replace function take_request() returns boolean language plpgsql security definer set search_path=public as $$ declare n int;begin insert into request_limits values('owner',now(),1) on conflict(id) do update set hits=case when request_limits.window_at<now()-interval '1 hour' then 1 else request_limits.hits+1 end,window_at=case when request_limits.window_at<now()-interval '1 hour' then now() else request_limits.window_at end returning hits into n;return n<=40;end;$$;
create or replace function claim_job() returns setof jobs language plpgsql security definer set search_path=public as $$ begin
-- Interrupted work retries at most twice. A 60-minute lease exceeds the worker's 45-minute timeout.
update jobs set status=case when attempts<2 then 'queued' else 'failed' end,error='Worker lease expired' where status='processing' and started_at<now()-interval '60 minutes';
return query update jobs set status='processing',started_at=now(),attempts=attempts+1 where id=(select id from jobs where status='queued' order by created_at for update skip locked limit 1) returning *;end;$$;
revoke all on function claim_job() from public,anon,authenticated;revoke all on function take_request() from public,anon,authenticated;grant execute on function claim_job() to service_role;grant execute on function take_request() to service_role;
insert into storage.buckets(id,name,public,file_size_limit) values('episodes','episodes',false,100000000) on conflict(id) do nothing;

create table briefs(id uuid primary key default gen_random_uuid(),ideas jsonb not null,scope text not null,created_at timestamptz default now());alter table briefs enable row level security;
create or replace function begin_refresh() returns boolean language plpgsql security definer set search_path=public as $$ declare n int;begin insert into request_limits values('arxiv-lock',now(),1) on conflict(id) do update set window_at=now() where request_limits.window_at<now()-interval '3 minutes' returning hits into n;return n is not null;end;$$;
revoke all on function begin_refresh() from public,anon,authenticated;grant execute on function begin_refresh() to service_role;

alter table jobs add column cover_key text,add column comic_key text,add column art_error text;

-- Shared visitor generation: the server owns all credentials; quotas bound paid work.
alter table jobs add column visitor_hash text;
create or replace function take_public_request(visitor text,kind text,daily_limit int default 10) returns boolean language plpgsql security definer set search_path=public as $$ declare n int;g int;cap int;begin
if length(visitor)<>64 or kind not in ('generation','feedback') then return false;end if;
cap:=case when kind='generation' then 2 else 30 end;
insert into request_limits values('public:'||kind||':'||visitor,now(),1) on conflict(id) do update set hits=case when request_limits.window_at<date_trunc('day',now()) then 1 else request_limits.hits+1 end,window_at=case when request_limits.window_at<date_trunc('day',now()) then now() else request_limits.window_at end returning hits into n;
if n>cap then return false;end if;
insert into request_limits values('global:'||kind,now(),1) on conflict(id) do update set hits=case when request_limits.window_at<date_trunc('day',now()) then 1 else request_limits.hits+1 end,window_at=case when request_limits.window_at<date_trunc('day',now()) then now() else request_limits.window_at end returning hits into g;
return g<=case when kind='generation' then least(100,greatest(1,daily_limit)) else 500 end;end;$$;
revoke all on function take_public_request(text,text,int) from public,anon,authenticated;grant execute on function take_public_request(text,text,int) to service_role;
