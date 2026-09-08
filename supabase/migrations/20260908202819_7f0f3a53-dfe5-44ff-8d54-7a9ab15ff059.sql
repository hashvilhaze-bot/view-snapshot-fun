ALTER TABLE public.profiles
  ADD COLUMN interests TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN preferred_season TEXT,
  ADD COLUMN group_size TEXT,
  ADD COLUMN notes TEXT;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();