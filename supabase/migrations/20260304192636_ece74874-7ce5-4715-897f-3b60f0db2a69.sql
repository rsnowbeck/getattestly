CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id uuid;
BEGIN
    -- Create organization
    INSERT INTO public.organizations (name)
    VALUES (COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Firm'))
    RETURNING id INTO new_org_id;

    -- Create profile
    INSERT INTO public.profiles (id, email, full_name, organization_id)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'company_name', split_part(NEW.email, '@', 1)),
      new_org_id
    );

    -- Add admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');

    RETURN NEW;
END;
$$;