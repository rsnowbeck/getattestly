
-- Fix SECURITY DEFINER view by making it SECURITY INVOKER
CREATE OR REPLACE VIEW public.org_signing_public
WITH (security_invoker = true) AS
  SELECT id, name, logo_url, accent_color FROM public.organizations;
