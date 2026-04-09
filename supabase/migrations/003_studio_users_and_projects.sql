-- Add "studio" role for buyer-side design studio users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'studio'
  ) THEN
    ALTER TYPE public.user_role ADD VALUE 'studio';
  END IF;
END$$;

-- Buyer-side studio projects (personal designs + try-on)
CREATE TABLE IF NOT EXISTS public.studio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Studio Project',
  base_image_url TEXT NOT NULL,
  design_image_url TEXT,
  mockup_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_studio_projects_user ON public.studio_projects(user_id);

ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Studio projects: owners can read" ON public.studio_projects;
DROP POLICY IF EXISTS "Studio projects: owners can write" ON public.studio_projects;

CREATE POLICY "Studio projects: owners can read"
  ON public.studio_projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Studio projects: owners can write"
  ON public.studio_projects
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
-- (optional) add later if you have a shared set_updated_at() function

