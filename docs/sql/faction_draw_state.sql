-- 国家抽卡状态表
-- 用途：
-- 1. 按国家保存每日免费抽卡次数
-- 2. 保存 S / SSS 保底进度
-- 3. 保存重复角色转化后的将魂
-- 4. 保存国家已拥有角色列表

create table if not exists public.faction_draw_state (
  faction_id uuid primary key references public.factions(id) on delete cascade,
  current_date date not null,
  free_draw_used integer not null default 0,
  pity_s_progress integer not null default 0,
  pity_sss_progress integer not null default 0,
  soul integer not null default 0,
  owned_character_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.faction_draw_state enable row level security;

create policy "faction_draw_state_select_by_ruler"
on public.faction_draw_state
for select
to authenticated
using (
  exists (
    select 1
    from public.factions f
    where f.id = faction_id
      and f.ruler_user_id = auth.uid()
  )
);

create policy "faction_draw_state_insert_by_ruler"
on public.faction_draw_state
for insert
to authenticated
with check (
  exists (
    select 1
    from public.factions f
    where f.id = faction_id
      and f.ruler_user_id = auth.uid()
  )
);

create policy "faction_draw_state_update_by_ruler"
on public.faction_draw_state
for update
to authenticated
using (
  exists (
    select 1
    from public.factions f
    where f.id = faction_id
      and f.ruler_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.factions f
    where f.id = faction_id
      and f.ruler_user_id = auth.uid()
  )
);
