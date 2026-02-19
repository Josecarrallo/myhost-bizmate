-- ============================================================
-- TABLA: videos
-- Tracking de jobs de generación de video (pipeline LTX-2 + Remotion)
-- Estado: pending → ltx_done → rendered → failed
-- Ejecutar en Supabase SQL Editor
-- ============================================================

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  property_id uuid,
  photo_url_s3 text not null,
  ltx_video_url_s3 text,
  final_video_url_s3 text,
  status text not null check (
    status in ('pending','ltx_done','rendered','failed')
  ) default 'pending',
  title text,
  subtitle text,
  music_file text,
  render_id text,
  render_time_seconds numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices
create index if not exists videos_user_id_idx on videos(user_id);
create index if not exists videos_status_idx on videos(status);
create index if not exists videos_created_at_idx on videos(created_at desc);

-- RLS: desactivado para que server.cjs (service_role) pueda insertar/actualizar
alter table videos disable row level security;
