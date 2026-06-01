-- ============================================================================
-- INTAN MIRACLE CARE — Complete Unified Database Setup Schema & Storage Setup
-- Run this complete script inside your Supabase dashboard SQL Editor to initialize.
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
    price_clinic NUMERIC DEFAULT 0,
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

-- 6. Create members table (Kelola Member)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_ibu TEXT NOT NULL,
    nama_bayi TEXT,
    usia_bayi TEXT,
    jenis_kelamin_bayi TEXT,
    whatsapp TEXT,
    alamat TEXT,
    member_number TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create reservations table (Kelola Reservasi)
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nama_ibu TEXT NOT NULL,
    nama_bayi TEXT,
    usia_bayi TEXT,
    jenis_kelamin TEXT,
    tipe_layanan TEXT DEFAULT 'homecare',
    whatsapp TEXT NOT NULL,
    layanan TEXT NOT NULL,
    tanggal DATE NOT NULL,
    jam TEXT NOT NULL,
    alamat TEXT,
    catatan TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create member_programs table (Program Member)
CREATE TABLE IF NOT EXISTS public.member_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create site_settings table (Pengaturan Website)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Create therapists table (Kelola Terapis)
CREATE TABLE IF NOT EXISTS public.therapists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- Enable Row Level Security (RLS) on all Database Tables
-- ============================================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Configure RLS Policies for Database Tables
-- ============================================================================

-- Clean up existing database policies to prevent conflicts
DROP POLICY IF EXISTS "Allow public read access" ON public.articles;
DROP POLICY IF EXISTS "Allow authenticated manage access" ON public.articles;
DROP POLICY IF EXISTS "Allow public read access" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated manage access" ON public.services;
DROP POLICY IF EXISTS "Allow public read access" ON public.gallery;
DROP POLICY IF EXISTS "Allow authenticated manage access" ON public.gallery;
DROP POLICY IF EXISTS "Allow public read access" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated manage access" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public read access" ON public.certificates;
DROP POLICY IF EXISTS "Allow authenticated manage access" ON public.certificates;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.members;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.members;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.members;
DROP POLICY IF EXISTS "Allow admin to manage all profiles" ON public.members;
DROP POLICY IF EXISTS "Allow public insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow users to select own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow admin to manage all reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow public read member programs" ON public.member_programs;
DROP POLICY IF EXISTS "Allow admin manage member programs" ON public.member_programs;
DROP POLICY IF EXISTS "Allow public read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow admin manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public read therapists" ON public.therapists;
DROP POLICY IF EXISTS "Allow admin manage therapists" ON public.therapists;

-- A. Articles Policies
CREATE POLICY "Allow public read access" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.articles FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- B. Services Policies
CREATE POLICY "Allow public read access" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.services FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- C. Gallery Policies
CREATE POLICY "Allow public read access" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.gallery FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- D. Testimonials Policies
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.testimonials FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- E. Certificates Policies
CREATE POLICY "Allow public read access" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.certificates FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- F. Members Policies
CREATE POLICY "Allow users to read own profile" ON public.members FOR SELECT 
  USING (auth.uid() = id OR (auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));
CREATE POLICY "Allow users to insert own profile" ON public.members FOR INSERT 
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow users to update own profile" ON public.members FOR UPDATE 
  USING (auth.uid() = id OR (auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));
CREATE POLICY "Allow admin to manage all profiles" ON public.members FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- G. Reservations Policies
CREATE POLICY "Allow public insert reservations" ON public.reservations FOR INSERT 
  WITH CHECK (true);
CREATE POLICY "Allow users to select own reservations" ON public.reservations FOR SELECT 
  USING (auth.uid() = user_id OR (auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));
CREATE POLICY "Allow admin to manage all reservations" ON public.reservations FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- H. Member Programs Policies
CREATE POLICY "Allow public read member programs" ON public.member_programs FOR SELECT USING (true);
CREATE POLICY "Allow admin manage member programs" ON public.member_programs FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- I. Site Settings Policies
CREATE POLICY "Allow public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin manage site settings" ON public.site_settings FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

-- J. Therapists Policies
CREATE POLICY "Allow public read therapists" ON public.therapists FOR SELECT USING (true);
CREATE POLICY "Allow admin manage therapists" ON public.therapists FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));


-- ============================================================================
-- 8. Setup Storage Buckets for Image Uploads
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

INSERT INTO storage.buckets (id, name, public)
VALUES ('therapists', 'therapists', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. Configure Row Level Security (RLS) Policies on Storage
-- ============================================================================

-- Clean up existing policies with the same names to prevent conflicts
DROP POLICY IF EXISTS "Public Read Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Objects" ON storage.objects;

-- Allow public select/read access to these buckets (anyone can see images)
CREATE POLICY "Public Read Objects" ON storage.objects
  FOR SELECT TO public USING (bucket_id IN ('articles', 'gallery', 'certificates', 'therapists'));

-- Allow authenticated administrators to perform write operations (upload/edit/delete)
CREATE POLICY "Admin Insert Objects" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('articles', 'gallery', 'certificates', 'therapists') AND (auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

CREATE POLICY "Admin Update Objects" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id IN ('articles', 'gallery', 'certificates', 'therapists') AND (auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));

CREATE POLICY "Admin Delete Objects" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id IN ('articles', 'gallery', 'certificates', 'therapists') AND (auth.jwt() ->> 'email') IN ('intanmiracle@gmail.com', 'admin@intanmiracle.com'));
