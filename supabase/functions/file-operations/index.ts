import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url: string;
  bucket: string;
  path: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log(`File operation request: ${method} - ${action}`);

    switch (action) {
      case 'generate-upload-url': {
        const { bucket, fileName, fileType } = await req.json();
        
        // Generate secure upload URL with expiration
        const { data, error } = await supabaseClient.storage
          .from(bucket)
          .createSignedUploadUrl(fileName, {
            expiresIn: 3600, // 1 hour
            upsert: false
          });

        if (error) {
          console.error('Error generating upload URL:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        return new Response(
          JSON.stringify({ uploadUrl: data.signedUrl, path: data.path }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      case 'validate-file': {
        const { bucket, path } = await req.json();
        
        // Check if file exists and get metadata
        const { data, error } = await supabaseClient.storage
          .from(bucket)
          .list(path.split('/').slice(0, -1).join('/'), {
            search: path.split('/').pop()
          });

        if (error || !data || data.length === 0) {
          return new Response(
            JSON.stringify({ valid: false, error: 'File not found' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const file = data[0];
        return new Response(
          JSON.stringify({ 
            valid: true, 
            metadata: {
              size: file.metadata?.size || 0,
              lastModified: file.updated_at,
              contentType: file.metadata?.mimetype
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      case 'delete-file': {
        const { bucket, path } = await req.json();
        
        console.log(`Deleting file: ${bucket}/${path}`);
        
        const { error } = await supabaseClient.storage
          .from(bucket)
          .remove([path]);

        if (error) {
          console.error('Error deleting file:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      case 'get-file-info': {
        const { bucket, path } = await req.json();
        
        // Get file metadata and public URL
        const { data: fileData } = await supabaseClient.storage
          .from(bucket)
          .getPublicUrl(path);

        const { data: metadata, error } = await supabaseClient.storage
          .from(bucket)
          .list(path.split('/').slice(0, -1).join('/'), {
            search: path.split('/').pop()
          });

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const file = metadata?.[0];
        
        return new Response(
          JSON.stringify({
            url: fileData.publicUrl,
            metadata: file ? {
              size: file.metadata?.size || 0,
              lastModified: file.updated_at,
              contentType: file.metadata?.mimetype
            } : null
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('File operation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});