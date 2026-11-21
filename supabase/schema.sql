-- =====================================================
-- NEMU - Modul 4: tabel laporan + Row Level Security
-- Jalankan di Supabase Dashboard -> SQL Editor -> New query -> Run
-- =====================================================

-- 1. Tabel laporan barang (hilang / ditemukan)
create table if not exists public.laporan (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  nama        text not null,
  deskripsi   text default '',
  kategori    text not null,
  lokasi      text not null,
  status      text not null default 'Hilang'
              check (status in ('Hilang', 'Ditemukan', 'Sudah Kembali')),
  kontak      text not null,
  pelapor     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists laporan_user_id_idx    on public.laporan (user_id);
create index if not exists laporan_created_at_idx on public.laporan (created_at desc);

-- 2. Aktifkan Row Level Security
alter table public.laporan enable row level security;

-- 3. Bersihkan policy lama (supaya script aman dijalankan ulang)
drop policy if exists "laporan_select_authenticated" on public.laporan;
drop policy if exists "laporan_insert_own"           on public.laporan;
drop policy if exists "laporan_update_own"           on public.laporan;
drop policy if exists "laporan_delete_own"           on public.laporan;

-- 4. Policy
-- BACA: semua user yang sudah login boleh melihat semua laporan
--       (tujuan app lost & found: orang lain harus bisa melihat laporan kita)
create policy "laporan_select_authenticated"
  on public.laporan for select
  to authenticated
  using (true);

-- TULIS: hanya boleh membuat laporan atas nama dirinya sendiri
create policy "laporan_insert_own"
  on public.laporan for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- UBAH & HAPUS: hanya pemilik laporan
create policy "laporan_update_own"
  on public.laporan for update
  to authenticated
  using      ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "laporan_delete_own"
  on public.laporan for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- -----------------------------------------------------
-- OPSIONAL (versi "private" seperti contoh modul):
-- kalau dosen/asisten minta tiap user hanya melihat data miliknya,
-- ganti policy SELECT dengan ini:
--
--   drop policy "laporan_select_authenticated" on public.laporan;
--   create policy "laporan_select_own"
--     on public.laporan for select
--     to authenticated
--     using ((select auth.uid()) = user_id);
-- -----------------------------------------------------
