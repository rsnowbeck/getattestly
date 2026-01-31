-- Create team_invitations table using existing 'admin' role as default
-- We'll use TEXT for role instead to avoid enum issues
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Policies for team_invitations
CREATE POLICY "Users can view invitations for their org"
ON public.team_invitations FOR SELECT
TO authenticated
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Admins can insert invitations for their org"
ON public.team_invitations FOR INSERT
TO authenticated
WITH CHECK (
  organization_id = get_user_organization_id(auth.uid())
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete invitations for their org"
ON public.team_invitations FOR DELETE
TO authenticated
USING (
  organization_id = get_user_organization_id(auth.uid())
  AND has_role(auth.uid(), 'admin')
);

-- Allow admins in the same org to view other users' profiles (drop existing policy first if exists)
DROP POLICY IF EXISTS "Admins can view profiles in their org" ON public.profiles;
CREATE POLICY "Admins can view profiles in their org"
ON public.profiles FOR SELECT
TO authenticated
USING (
  organization_id = get_user_organization_id(auth.uid())
);

-- Allow admins to update profiles in their org
DROP POLICY IF EXISTS "Admins can update profiles in their org" ON public.profiles;
CREATE POLICY "Admins can update profiles in their org"
ON public.profiles FOR UPDATE
TO authenticated
USING (
  organization_id = get_user_organization_id(auth.uid())
  AND has_role(auth.uid(), 'admin')
);

-- Allow admins to manage user_roles in their org
DROP POLICY IF EXISTS "Admins can view roles in their org" ON public.user_roles;
CREATE POLICY "Admins can view roles in their org"
ON public.user_roles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = user_roles.user_id
    AND p.organization_id = get_user_organization_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can insert roles in their org" ON public.user_roles;
CREATE POLICY "Admins can insert roles in their org"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin')
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = user_roles.user_id
    AND p.organization_id = get_user_organization_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can update roles in their org" ON public.user_roles;
CREATE POLICY "Admins can update roles in their org"
ON public.user_roles FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin')
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = user_roles.user_id
    AND p.organization_id = get_user_organization_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can delete roles in their org" ON public.user_roles;
CREATE POLICY "Admins can delete roles in their org"
ON public.user_roles FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin')
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = user_roles.user_id
    AND p.organization_id = get_user_organization_id(auth.uid())
  )
  AND user_id != auth.uid()
);