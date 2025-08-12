import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  is_published: boolean;
  created_at: string;
  price: number;
  is_free: boolean;
  profiles: {
    username: string;
    full_name: string;
  };
}

export const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateProjectApproval } = useAdmin();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          creator_id,
          is_published,
          created_at,
          price,
          is_free,
          profiles!creator_id(username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (projectId: string, approved: boolean) => {
    const success = await updateProjectApproval(projectId, approved);
    if (success) {
      await fetchProjects(); // Refresh the list
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Project Management</h2>
        <p className="text-muted-foreground">
          Review and manage all projects submitted to your marketplace.
        </p>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    By {project.profiles?.full_name || project.profiles?.username || 'Unknown'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={project.is_published ? "default" : "secondary"}>
                    {project.is_published ? "Published" : "Draft"}
                  </Badge>
                  {project.is_free ? (
                    <Badge variant="outline">Free</Badge>
                  ) : (
                    <Badge variant="outline">${(project.price || 0).toFixed(2)}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(project.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {/* TODO: View project details */}}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {!project.is_published && (
                    <Button
                      size="sm"
                      onClick={() => handleApproval(project.id, true)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  {project.is_published && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleApproval(project.id, false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Unpublish
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No projects found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};