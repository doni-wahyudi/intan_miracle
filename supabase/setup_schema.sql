-- ============================================================================
-- INTAN MIRACLE CARE — Database Setup Schema & Storage Configuration
-- Run this complete script inside your Supabase dashboard SQL Editor.
-- ============================================================================

-- 1. Create articles table (Kelola Artikel)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT NOT NULL,
    author TEXT DEFAULT 'Bdn. Intan Purnama Sari, S.Keb., CBMT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create services table (Kelola Layanan)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT NOT NULL,
    duration TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create gallery table (Kelola Galeri)
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create testimonials table (Kelola Testimoni)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_name TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    stars INTEGER DEFAULT 5,
    avatar_initials TEXT,
    avatar_bg TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create certificates table (Kelola Sertifikat)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 6. Setup Storage Buckets for Image Uploads
-- ============================================================================

-- Create public storage buckets for each page section
INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. Configure Row Level Security (RLS) Policies on Storage
-- ============================================================================

-- Clean up existing policies with the same names to prevent conflicts
DROP POLICY IF EXISTS "Public Read Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Objects" ON storage.objects;

-- Allow public select/read access to these buckets (anyone can see images)
CREATE POLICY "Public Read Objects" ON storage.objects
  FOR SELECT TO public USING (bucket_id IN ('articles', 'gallery', 'certificates'));

-- Allow authenticated administrators to perform write operations (upload/edit/delete)
CREATE POLICY "Admin Insert Objects" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('articles', 'gallery', 'certificates'));

CREATE POLICY "Admin Update Objects" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id IN ('articles', 'gallery', 'certificates'));

CREATE POLICY "Admin Delete Objects" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id IN ('articles', 'gallery', 'certificates'));
