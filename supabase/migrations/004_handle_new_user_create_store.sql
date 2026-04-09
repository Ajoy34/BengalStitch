-- Update auth signup trigger to auto-create store for sellers.
-- This runs server-side as SECURITY DEFINER, so RLS won't block inserts.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role TEXT;
  requested_store_name TEXT;
  base_slug TEXT;
  try_slug TEXT;
  attempt INT := 0;
BEGIN
  requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'buyer');
  requested_store_name := NEW.raw_user_meta_data->>'store_name';

  INSERT INTO public.users (id, email, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((requested_role)::public.user_role, 'buyer')
  );

  -- Auto-create store for sellers when store_name is provided
  IF requested_role = 'seller' AND requested_store_name IS NOT NULL AND length(trim(requested_store_name)) > 0 THEN
    base_slug := lower(regexp_replace(trim(requested_store_name), '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := regexp_replace(base_slug, '(^-+|-+$)', '', 'g');
    IF base_slug IS NULL OR length(base_slug) = 0 THEN
      base_slug := 'store';
    END IF;

    try_slug := base_slug;

    LOOP
      BEGIN
        INSERT INTO public.stores (user_id, store_name, store_slug)
        VALUES (NEW.id, trim(requested_store_name), try_slug);
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        attempt := attempt + 1;
        try_slug := base_slug || '-' || substr(md5(NEW.id::text || attempt::text), 1, 6);
        IF attempt > 10 THEN
          -- give up silently; user can create store manually later
          EXIT;
        END IF;
      END;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

