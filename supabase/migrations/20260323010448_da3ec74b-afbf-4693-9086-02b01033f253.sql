
-- Fix: Replace overly broad public org policy with one that only exposes safe columns
-- Drop the existing policy that exposes all org columns to anonymous signers
DROP POLICY IF EXISTS "Public can view organization via signing request" ON public.organizations;

-- Create a restricted view for signing context (only name, logo, accent_color)
CREATE OR REPLACE VIEW public.org_signing_public AS
  SELECT id, name, logo_url, accent_color FROM public.organizations;

-- Grant anon/authenticated access to the view
GRANT SELECT ON public.org_signing_public TO anon, authenticated;
