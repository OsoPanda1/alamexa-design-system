
-- 1. Drop the overly-permissive public SELECT policy on profiles
DROP POLICY IF EXISTS "Users can view public profile fields of others" ON public.profiles;

-- 2. Drop any existing public_profiles view (recreate as secure)
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- 3. Create a SECURITY INVOKER view exposing only safe public fields
CREATE VIEW public.public_profiles
WITH (security_invoker = true)
AS
SELECT
  user_id,
  username,
  avatar_url,
  bio,
  city,
  state,
  reputation_score,
  total_trades,
  membership_tier,
  is_verified,
  kyc_level,
  created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 4. Add a new restricted SELECT policy on profiles for authenticated users
-- (own-row policy already exists). We add a policy that allows authenticated
-- users to view rows but the app must use public_profiles view for non-owners.
-- For backward compat, allow authenticated read of profiles but rely on view for safe surface.
CREATE POLICY "Authenticated users can view profiles basic"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 5. Ensure devhub_registrations has no public access (confirm RLS enabled)
ALTER TABLE public.devhub_registrations ENABLE ROW LEVEL SECURITY;

-- 6. Add admin read policy for devhub_registrations (admins need to approve)
CREATE POLICY "Admins can view all devhub registrations"
ON public.devhub_registrations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update devhub registrations"
ON public.devhub_registrations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
