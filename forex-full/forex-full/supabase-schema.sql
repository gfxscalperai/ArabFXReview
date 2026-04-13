-- ===================================================
-- FXPro Arabia — Supabase Database Schema
-- انسخ هذا الكود في Supabase SQL Editor وشغّله
-- ===================================================

-- جدول المقالات (مؤشرات + إكسبيرت + مراجعات)
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  body text not null,
  excerpt text,
  keywords text,
  category text not null default 'indicators',
  status text not null default 'draft',
  source_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- جدول الأخبار (أوتوماتيكية من RSS)
create table if not exists news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  excerpt text,
  source text,
  source_url text,
  original_url text unique,
  category text default 'general',
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- تفعيل Row Level Security (اختياري)
alter table posts enable row level security;
alter table news enable row level security;

-- سماح بالقراءة للجميع
create policy "public read posts" on posts for select using (status = 'published');
create policy "public read news" on news for select using (true);

-- سماح بالكتابة عبر service key فقط (من API)
create policy "service write posts" on posts for all using (true);
create policy "service write news" on news for all using (true);

-- Index للبحث السريع
create index if not exists posts_category_idx on posts(category);
create index if not exists posts_status_idx on posts(status);
create index if not exists news_created_idx on news(created_at desc);
create index if not exists news_original_url_idx on news(original_url);
