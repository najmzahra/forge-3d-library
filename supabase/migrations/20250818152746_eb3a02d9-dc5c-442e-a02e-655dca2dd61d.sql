-- Add current user as admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('a69967e4-6faa-4352-833d-d313b82707e4', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;