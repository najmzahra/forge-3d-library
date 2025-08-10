import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for web app compatibility
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Rate limiting interface
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  identifier?: string; // Custom identifier (defaults to IP)
}

// Security middleware interface
interface SecurityConfig {
  rateLimit?: RateLimitConfig;
  requireAuth?: boolean;
  validateInput?: (data: any) => { success: boolean; error?: string };
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

// Enhanced logger with structured logging
export class SecurityLogger {
  private logLevel: string;
  
  constructor(logLevel: string = 'info') {
    this.logLevel = logLevel;
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatLog(level: string, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    return JSON.stringify(logEntry);
  }

  debug(message: string, meta?: any) {
    if (this.shouldLog('debug')) {
      console.log(this.formatLog('debug', message, meta));
    }
  }

  info(message: string, meta?: any) {
    if (this.shouldLog('info')) {
      console.log(this.formatLog('info', message, meta));
    }
  }

  warn(message: string, meta?: any) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatLog('warn', message, meta));
    }
  }

  error(message: string, meta?: any) {
    if (this.shouldLog('error')) {
      console.error(this.formatLog('error', message, meta));
    }
  }
}

// Rate limiting implementation using Supabase database
export class RateLimiter {
  private supabase: any;
  private logger: SecurityLogger;

  constructor(supabase: any, logger: SecurityLogger) {
    this.supabase = supabase;
    this.logger = logger;
  }

  async checkRateLimit(
    identifier: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining?: number; resetTime?: number }> {
    try {
      const windowStart = Date.now() - config.windowMs;
      const currentTime = Date.now();

      // Clean up old entries
      await this.supabase
        .from('rate_limits')
        .delete()
        .lt('timestamp', windowStart);

      // Count current requests in window
      const { data: requests, error } = await this.supabase
        .from('rate_limits')
        .select('*')
        .eq('identifier', identifier)
        .gte('timestamp', windowStart);

      if (error) {
        this.logger.error('Rate limit check failed', { error: error.message, identifier });
        // Fail open for database errors
        return { allowed: true };
      }

      const requestCount = requests?.length || 0;

      if (requestCount >= config.maxRequests) {
        this.logger.warn('Rate limit exceeded', {
          identifier,
          requestCount,
          maxRequests: config.maxRequests,
          windowMs: config.windowMs
        });
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: windowStart + config.windowMs
        };
      }

      // Record this request
      await this.supabase
        .from('rate_limits')
        .insert({
          identifier,
          timestamp: currentTime,
          endpoint: 'unknown' // Can be customized per endpoint
        });

      return {
        allowed: true,
        remaining: config.maxRequests - requestCount - 1,
        resetTime: windowStart + config.windowMs
      };
    } catch (error) {
      this.logger.error('Rate limiter error', { error: error.message, identifier });
      // Fail open for unexpected errors
      return { allowed: true };
    }
  }
}

// Input sanitization utilities
export class InputSanitizer {
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Basic XSS prevention
      .substring(0, 10000); // Prevent extremely long inputs
  }

  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeString(email).toLowerCase();
    
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  static sanitizeObject(obj: any, maxDepth: number = 10): any {
    if (maxDepth <= 0) return {};
    
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.slice(0, 100).map(item => this.sanitizeObject(item, maxDepth - 1));
    }
    
    const sanitized: any = {};
    let keyCount = 0;
    
    for (const [key, value] of Object.entries(obj)) {
      if (keyCount >= 50) break; // Limit object size
      
      const sanitizedKey = this.sanitizeString(key);
      if (sanitizedKey) {
        sanitized[sanitizedKey] = this.sanitizeObject(value, maxDepth - 1);
        keyCount++;
      }
    }
    
    return sanitized;
  }
}

// Main security middleware
export async function securityMiddleware(
  request: Request,
  config: SecurityConfig = {}
): Promise<{
  success: boolean;
  response?: Response;
  user?: any;
  sanitizedData?: any;
}> {
  const logger = new SecurityLogger(config.logLevel);
  
  try {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return {
        success: true,
        response: new Response(null, { headers: corsHeaders })
      };
    }

    // Get client IP for rate limiting and logging
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const requestId = crypto.randomUUID();

    logger.info('Request received', {
      requestId,
      method: request.method,
      url: request.url,
      clientIP,
      userAgent: userAgent.substring(0, 200) // Truncate long user agents
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limiting
    if (config.rateLimit) {
      const rateLimiter = new RateLimiter(supabase, logger);
      const identifier = config.rateLimit.identifier || clientIP;
      
      const rateCheck = await rateLimiter.checkRateLimit(identifier, config.rateLimit);
      
      if (!rateCheck.allowed) {
        logger.warn('Rate limit exceeded', { requestId, identifier });
        
        return {
          success: false,
          response: new Response(
            JSON.stringify({
              error: 'Rate limit exceeded',
              retryAfter: Math.ceil((rateCheck.resetTime! - Date.now()) / 1000)
            }),
            {
              status: 429,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'Retry-After': String(Math.ceil((rateCheck.resetTime! - Date.now()) / 1000))
              }
            }
          )
        };
      }
    }

    // Authentication check
    let user = null;
    if (config.requireAuth) {
      const authHeader = request.headers.get('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn('Missing or invalid auth header', { requestId });
        
        return {
          success: false,
          response: new Response(
            JSON.stringify({ error: 'Authentication required' }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        };
      }

      const token = authHeader.split(' ')[1];
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !authUser) {
        logger.warn('Authentication failed', { requestId, error: authError?.message });
        
        return {
          success: false,
          response: new Response(
            JSON.stringify({ error: 'Invalid authentication token' }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        };
      }
      
      user = authUser;
      logger.info('User authenticated', { requestId, userId: user.id });
    }

    // Input validation and sanitization
    let sanitizedData = null;
    if (request.method !== 'GET' && request.method !== 'DELETE') {
      try {
        const rawData = await request.json();
        sanitizedData = InputSanitizer.sanitizeObject(rawData);
        
        if (config.validateInput) {
          const validation = config.validateInput(sanitizedData);
          
          if (!validation.success) {
            logger.warn('Input validation failed', { 
              requestId, 
              error: validation.error,
              data: sanitizedData 
            });
            
            return {
              success: false,
              response: new Response(
                JSON.stringify({ error: validation.error || 'Invalid input data' }),
                {
                  status: 400,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              )
            };
          }
        }
      } catch (error) {
        logger.warn('Failed to parse request body', { requestId, error: error.message });
        
        return {
          success: false,
          response: new Response(
            JSON.stringify({ error: 'Invalid JSON in request body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        };
      }
    }

    logger.info('Security checks passed', { requestId, userId: user?.id });

    return {
      success: true,
      user,
      sanitizedData
    };

  } catch (error) {
    logger.error('Security middleware error', { error: error.message });
    
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'Internal security error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    };
  }
}

// Utility function to create error responses with proper CORS
export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: any
): Response {
  return new Response(
    JSON.stringify({
      error: message,
      ...details
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

// Utility function to create success responses with proper CORS
export function createSuccessResponse(data: any, status: number = 200): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}