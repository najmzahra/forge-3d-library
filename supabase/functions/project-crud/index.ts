import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { method } = req;
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log(`${method} ${pathname}`);

    // Get projects with search, filtering, and pagination
    if (method === 'GET' && pathname === '/project-crud') {
      const searchTerm = url.searchParams.get('search') || '';
      const category = url.searchParams.get('category');
      const tags = url.searchParams.get('tags');
      const author = url.searchParams.get('author');
      const minRating = url.searchParams.get('minRating');
      const maxPrice = url.searchParams.get('maxPrice');
      const isFree = url.searchParams.get('isFree');
      const sortBy = url.searchParams.get('sortBy') || 'created_at';
      const sortOrder = url.searchParams.get('sortOrder') || 'desc';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '12');
      const offset = (page - 1) * limit;

      let query = supabaseClient
        .from('projects')
        .select(`
          *,
          profiles (
            id,
            username,
            full_name,
            is_creator,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('is_published', true);

      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply category filter
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply tags filter
      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        query = query.overlaps('tags', tagArray);
      }

      // Apply author filter
      if (author) {
        query = query.eq('profiles.username', author);
      }

      // Apply rating filter
      if (minRating) {
        query = query.gte('rating', parseFloat(minRating));
      }

      // Apply price filters
      if (isFree === 'true') {
        query = query.eq('is_free', true);
      } else if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }

      // Apply sorting
      const ascending = sortOrder === 'asc';
      if (sortBy === 'rating') {
        query = query.order('rating', { ascending }).order('rating_count', { ascending: false });
      } else if (sortBy === 'downloads') {
        query = query.order('download_count', { ascending });
      } else if (sortBy === 'price') {
        query = query.order('price', { ascending });
      } else {
        query = query.order(sortBy, { ascending });
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching projects:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          projects: data,
          totalCount: count,
          currentPage: page,
          totalPages: Math.ceil((count || 0) / limit),
          hasNextPage: offset + limit < (count || 0),
          hasPrevPage: page > 1
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create project
    if (method === 'POST' && pathname === '/project-crud') {
      const body = await req.json();
      
      const { data, error } = await supabaseClient
        .from('projects')
        .insert(body)
        .select(`
          *,
          profiles (
            username,
            full_name,
            is_creator
          )
        `)
        .single();

      if (error) {
        console.error('Error creating project:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ project: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update project
    if (method === 'PUT' && pathname.startsWith('/project-crud/')) {
      const projectId = pathname.split('/')[2];
      const body = await req.json();

      // First check if user owns the project
      const { data: existingProject, error: fetchError } = await supabaseClient
        .from('projects')
        .select(`
          *,
          profiles!inner (
            user_id
          )
        `)
        .eq('id', projectId)
        .single();

      if (fetchError || !existingProject) {
        return new Response(
          JSON.stringify({ error: 'Project not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get current user
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user || existingProject.profiles.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabaseClient
        .from('projects')
        .update(body)
        .eq('id', projectId)
        .select(`
          *,
          profiles (
            username,
            full_name,
            is_creator
          )
        `)
        .single();

      if (error) {
        console.error('Error updating project:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ project: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete project
    if (method === 'DELETE' && pathname.startsWith('/project-crud/')) {
      const projectId = pathname.split('/')[2];

      // First check if user owns the project
      const { data: existingProject, error: fetchError } = await supabaseClient
        .from('projects')
        .select(`
          *,
          profiles!inner (
            user_id
          )
        `)
        .eq('id', projectId)
        .single();

      if (fetchError || !existingProject) {
        return new Response(
          JSON.stringify({ error: 'Project not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get current user
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user || existingProject.profiles.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Delete associated files from storage
      if (existingProject.file_url) {
        const filePath = existingProject.file_url.split('/').slice(-1)[0];
        await supabaseClient.storage.from('project-files').remove([filePath]);
      }

      if (existingProject.preview_images && existingProject.preview_images.length > 0) {
        const imagePaths = existingProject.preview_images.map((url: string) => 
          url.split('/').slice(-1)[0]
        );
        await supabaseClient.storage.from('project-previews').remove(imagePaths);
      }

      const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's projects
    if (method === 'GET' && pathname === '/project-crud/user') {
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        return new Response(
          JSON.stringify({ projects: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user projects:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ projects: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});