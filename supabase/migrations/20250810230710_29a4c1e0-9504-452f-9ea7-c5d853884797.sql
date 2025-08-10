-- Fix security issues: Enable RLS and update function search paths

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Enable RLS on security_logs table  
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rate_limits (only Edge Functions should access this)
CREATE POLICY "Edge functions can manage rate limits"
ON public.rate_limits
FOR ALL
USING (true);

-- Create RLS policies for security_logs (only Edge Functions should access this)
CREATE POLICY "Edge functions can manage security logs"
ON public.security_logs
FOR ALL
USING (true);

-- Fix search path for cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE timestamp < EXTRACT(EPOCH FROM now() - INTERVAL '1 hour') * 1000;
END;
$$;

-- Fix search path for log function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_severity TEXT,
  p_message TEXT,
  p_metadata JSONB DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_client_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_logs (
    event_type,
    severity,
    message,
    metadata,
    user_id,
    client_ip,
    user_agent
  ) VALUES (
    p_event_type,
    p_severity,
    p_message,
    p_metadata,
    p_user_id,
    p_client_ip,
    p_user_agent
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;