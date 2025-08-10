import { securityMiddleware, createErrorResponse, createSuccessResponse } from '../_shared/security.ts';

// Input validation schema
function validateProjectData(data: any) {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid data format' };
  }

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    return { success: false, error: 'Title must be at least 3 characters long' };
  }

  if (data.title.length > 100) {
    return { success: false, error: 'Title cannot exceed 100 characters' };
  }

  if (data.description && typeof data.description !== 'string') {
    return { success: false, error: 'Description must be a string' };
  }

  if (data.description && data.description.length > 2000) {
    return { success: false, error: 'Description cannot exceed 2000 characters' };
  }

  if (data.price && (typeof data.price !== 'number' || data.price < 0)) {
    return { success: false, error: 'Price must be a non-negative number' };
  }

  return { success: true };
}

Deno.serve(async (req) => {
  // Apply comprehensive security middleware
  const securityCheck = await securityMiddleware(req, {
    // Rate limiting: 100 requests per 15 minutes per IP
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    },
    // Require authentication
    requireAuth: true,
    // Input validation for non-GET requests
    validateInput: req.method !== 'GET' ? validateProjectData : undefined,
    // Enhanced logging
    logLevel: 'info'
  });

  // If security checks failed, return the error response
  if (!securityCheck.success) {
    return securityCheck.response!;
  }

  const { user, sanitizedData } = securityCheck;

  try {
    // Initialize Supabase with service role for Edge Function operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Import createClient dynamically to avoid issues
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (req.method) {
      case 'GET': {
        // Get user's projects with proper error handling
        const { data: projects, error } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            description,
            category,
            tags,
            price,
            is_free,
            rating,
            rating_count,
            download_count,
            preview_images,
            created_at,
            updated_at
          `)
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Database error:', error);
          return createErrorResponse('Failed to fetch projects', 500);
        }

        return createSuccessResponse({
          projects: projects || [],
          total: projects?.length || 0
        });
      }

      case 'POST': {
        // Create new project with sanitized data
        const projectData = {
          title: sanitizedData.title,
          description: sanitizedData.description || null,
          category: sanitizedData.category || null,
          tags: Array.isArray(sanitizedData.tags) ? sanitizedData.tags.slice(0, 10) : null,
          price: sanitizedData.price || 0,
          is_free: sanitizedData.price === 0 || sanitizedData.is_free === true,
          creator_id: user.id,
          is_published: false // Always start as draft
        };

        const { data: newProject, error } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single();

        if (error) {
          console.error('Project creation error:', error);
          return createErrorResponse('Failed to create project', 500);
        }

        // Log successful project creation
        await supabase.rpc('log_security_event', {
          p_event_type: 'project_created',
          p_severity: 'info',
          p_message: 'User created new project',
          p_metadata: { 
            project_id: newProject.id,
            project_title: newProject.title 
          },
          p_user_id: user.id
        });

        return createSuccessResponse({
          message: 'Project created successfully',
          project: newProject
        }, 201);
      }

      case 'PUT': {
        const url = new URL(req.url);
        const projectId = url.searchParams.get('id');

        if (!projectId) {
          return createErrorResponse('Project ID is required', 400);
        }

        // Verify project ownership
        const { data: existingProject, error: fetchError } = await supabase
          .from('projects')
          .select('id, creator_id')
          .eq('id', projectId)
          .single();

        if (fetchError || !existingProject) {
          return createErrorResponse('Project not found', 404);
        }

        if (existingProject.creator_id !== user.id) {
          return createErrorResponse('Unauthorized to modify this project', 403);
        }

        // Update project with sanitized data
        const updateData: any = {};
        if (sanitizedData.title) updateData.title = sanitizedData.title;
        if (sanitizedData.description !== undefined) updateData.description = sanitizedData.description;
        if (sanitizedData.category !== undefined) updateData.category = sanitizedData.category;
        if (sanitizedData.tags !== undefined) updateData.tags = Array.isArray(sanitizedData.tags) ? sanitizedData.tags.slice(0, 10) : null;
        if (sanitizedData.price !== undefined) {
          updateData.price = sanitizedData.price;
          updateData.is_free = sanitizedData.price === 0;
        }

        const { data: updatedProject, error: updateError } = await supabase
          .from('projects')
          .update(updateData)
          .eq('id', projectId)
          .select()
          .single();

        if (updateError) {
          console.error('Project update error:', updateError);
          return createErrorResponse('Failed to update project', 500);
        }

        return createSuccessResponse({
          message: 'Project updated successfully',
          project: updatedProject
        });
      }

      default:
        return createErrorResponse('Method not allowed', 405);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    
    // Log security incident for unexpected errors
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
      
      await supabase.rpc('log_security_event', {
        p_event_type: 'function_error',
        p_severity: 'error',
        p_message: 'Unexpected error in secure project function',
        p_metadata: { 
          error: error.message,
          stack: error.stack?.substring(0, 1000) // Limit stack trace length
        },
        p_user_id: user?.id
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
});