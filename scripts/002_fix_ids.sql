-- Drop old tables and recreate with UUID primary keys
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS graphics CASCADE;

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT DEFAULT '/images/project-1.jpg',
  tags TEXT[] DEFAULT '{}',
  live_url TEXT DEFAULT '#',
  repo_url TEXT DEFAULT '#',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Skills table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('programmingLanguages', 'digitalMediaTools')),
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Proficient', 'Intermediate', 'Basic')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category, name)
);

-- Graphics table
CREATE TABLE graphics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT DEFAULT '/images/graphic-1.jpg',
  link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE graphics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read graphics" ON graphics FOR SELECT USING (true);

-- Allow anonymous insert/update/delete (admin panel uses anon key)
CREATE POLICY "Allow all inserts on projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on projects" ON projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all deletes on projects" ON projects FOR DELETE USING (true);

CREATE POLICY "Allow all inserts on skills" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on skills" ON skills FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all deletes on skills" ON skills FOR DELETE USING (true);

CREATE POLICY "Allow all inserts on graphics" ON graphics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on graphics" ON graphics FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all deletes on graphics" ON graphics FOR DELETE USING (true);
