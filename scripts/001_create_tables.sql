-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT 'proj-' || floor(extract(epoch from now()) * 1000)::text || '-' || floor(random() * 1000)::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT DEFAULT '/images/project-1.jpg',
  tags TEXT[] DEFAULT '{}',
  live_url TEXT DEFAULT '#',
  repo_url TEXT DEFAULT '#',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('programmingLanguages', 'digitalMediaTools')),
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Proficient', 'Intermediate', 'Basic')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category, name)
);

-- Graphics table
CREATE TABLE IF NOT EXISTS graphics (
  id TEXT PRIMARY KEY DEFAULT 'gfx-' || floor(extract(epoch from now()) * 1000)::text || '-' || floor(random() * 1000)::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT DEFAULT '/images/graphic-1.jpg',
  link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS so public can read, API routes use service role key for writes
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE graphics ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read graphics" ON graphics FOR SELECT USING (true);

-- Allow service role full access (for admin API routes)
CREATE POLICY "Service role manage projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role manage skills" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role manage graphics" ON graphics FOR ALL USING (true) WITH CHECK (true);
