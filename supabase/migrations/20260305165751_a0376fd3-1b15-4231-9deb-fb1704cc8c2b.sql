
-- Create audit_logs table for tracking document access
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  entity_name text,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view audit logs in their org
CREATE POLICY "Users can view audit logs in their org"
  ON public.audit_logs FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

-- RLS: Insert audit logs for their org
CREATE POLICY "Users can insert audit logs in their org"
  ON public.audit_logs FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- RLS: Public can insert audit logs via signing request context
CREATE POLICY "Public can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (user_id IS NULL AND organization_id IS NOT NULL);

-- Index for fast lookups
CREATE INDEX idx_audit_logs_org_created ON public.audit_logs (organization_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);
