-- Create rate_limits table for rate limiting functionality
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  endpoint TEXT,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient rate limit queries
CREATE INDEX idx_rate_limits_identifier_timestamp ON public.rate_limits(identifier, timestamp);
CREATE INDEX idx_rate_limits_timestamp ON public.rate_limits(timestamp);

-- Create security_logs table for audit logging
CREATE TABLE public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('debug', 'info', 'warn', 'error')),
  message TEXT NOT NULL,
  metadata JSONB,
  user_id UUID,
  client_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for security logs
CREATE INDEX idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX idx_security_logs_severity ON public.security_logs(severity);
CREATE INDEX idx_security_logs_user_id ON public.security_logs(user_id);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at);

-- Create function to clean up old rate limit entries (runs automatically)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE timestamp < EXTRACT(EPOCH FROM now() - INTERVAL '1 hour') * 1000;
END;
$$;

-- Create function to log security events
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