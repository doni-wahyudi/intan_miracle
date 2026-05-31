-- ============================================
-- INTAN MIRACLE CARE — Database Setup Schema
-- Run this in your Supabase SQL Editor to initialize.
-- ============================================

-- 1. Create articles table
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

-- 2. Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'baby' or 'mom'
    price NUMERIC NOT NULL,
    description TEXT NOT NULL,
    duration TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_name TEXT NOT NULL,
    category TEXT NOT NULL, -- Pijat Bayi, Laktasi Massage, dll.
    content TEXT NOT NULL,
    stars INTEGER DEFAULT 5,
    avatar_initials TEXT,
    avatar_bg TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 6. Setup Public Read Access Policies
CREATE POLICY "Allow public read access" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.certificates FOR SELECT USING (true);

-- 7. Setup Authorized Write Access Policies (Authenticated users can manage)
CREATE POLICY "Allow authenticated manage access" ON public.articles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.services FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage access" ON public.certificates FOR ALL TO authenticated USING (true);
