
-- Form templates table: stores detected/edited fields for a requirement's PDF
CREATE TABLE public.form_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requirement_id UUID NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  pdf_url TEXT NOT NULL,
  pdf_name TEXT,
  fields_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Form submissions table: stores signer responses
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  signing_request_id UUID REFERENCES public.signing_requests(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  signer_name TEXT,
  responses_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  snapshot_url TEXT,
  snapshot_status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for form_templates
CREATE POLICY "Users can view form templates in their org"
  ON public.form_templates FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert form templates in their org"
  ON public.form_templates FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update form templates in their org"
  ON public.form_templates FOR UPDATE
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete form templates in their org"
  ON public.form_templates FOR DELETE
  USING (organization_id = get_user_organization_id(auth.uid()));

-- Public access for signers via signing request
CREATE POLICY "Public can view published template via signing request"
  ON public.form_templates FOR SELECT
  USING (
    status = 'published' AND EXISTS (
      SELECT 1 FROM signing_requests sr
      WHERE sr.requirement_id = form_templates.requirement_id
        AND sr.status = 'pending'
        AND sr.expires_at > now()
    )
  );

-- RLS policies for form_submissions
CREATE POLICY "Users can view form submissions in their org"
  ON public.form_submissions FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert form submissions in their org"
  ON public.form_submissions FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Public insert for signers (unauthenticated)
CREATE POLICY "Public can submit forms via valid signing request"
  ON public.form_submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM signing_requests sr
      WHERE sr.id = form_submissions.signing_request_id
        AND sr.status = 'pending'
        AND sr.expires_at > now()
    )
  );

-- Public can view their own submission
CREATE POLICY "Public can view submission via signing request"
  ON public.form_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM signing_requests sr
      WHERE sr.id = form_submissions.signing_request_id
        AND sr.status = 'pending'
        AND sr.expires_at > now()
    )
  );

-- Update trigger for form_templates
CREATE TRIGGER update_form_templates_updated_at
  BEFORE UPDATE ON public.form_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for PDF snapshots
INSERT INTO storage.buckets (id, name, public) VALUES ('form-snapshots', 'form-snapshots', true);

-- Storage policies for form snapshots
CREATE POLICY "Anyone can view form snapshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'form-snapshots');

CREATE POLICY "Authenticated users can upload form snapshots"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'form-snapshots');

-- Index for fast lookups
CREATE INDEX idx_form_templates_requirement ON public.form_templates(requirement_id);
CREATE INDEX idx_form_submissions_template ON public.form_submissions(template_id);
CREATE INDEX idx_form_submissions_signing_request ON public.form_submissions(signing_request_id);
