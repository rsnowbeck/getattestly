
-- Drop the overly permissive storage policies for client-documents
DROP POLICY IF EXISTS "Authenticated users can upload client documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view client documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete client documents" ON storage.objects;

-- Create firm-scoped storage policies using the client_id folder prefix
-- The upload path pattern is: {client_id}/{timestamp}-{filename}
-- We scope access by checking that the client belongs to the user's firm

CREATE POLICY "Firm members can upload client documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'client-documents'
    AND public.is_firm_member(auth.uid(), public.get_firm_id_for_client((storage.foldername(name))[1]::uuid))
  );

CREATE POLICY "Firm members can view client documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND public.is_firm_member(auth.uid(), public.get_firm_id_for_client((storage.foldername(name))[1]::uuid))
  );

CREATE POLICY "Firm members can delete client documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND public.is_firm_member(auth.uid(), public.get_firm_id_for_client((storage.foldername(name))[1]::uuid))
  );

-- Also allow clients to view their own documents
CREATE POLICY "Clients can view their own documents in storage"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND public.is_client_user(auth.uid(), (storage.foldername(name))[1]::uuid)
  );

-- Allow clients to upload their own documents
CREATE POLICY "Clients can upload their own documents in storage"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'client-documents'
    AND public.is_client_user(auth.uid(), (storage.foldername(name))[1]::uuid)
  );
