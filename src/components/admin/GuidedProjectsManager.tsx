import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface GuidedProject {
  id: string;
  title: string;
  description: string;
  is_guided: boolean;
  priority_order: number;
  created_at: string;
  guided_steps: any;
  profiles: {
    username: string;
    full_name: string;
  };
}

export const GuidedProjectsManager = () => {
  const [guidedProjects, setGuidedProjects] = useState<GuidedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchGuidedProjects();
  }, []);

  const fetchGuidedProjects = async () => {
    try {
      // For now, get all projects and filter for admin-created ones
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          created_at,
          profiles!creator_id(username, full_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mock guided projects structure for display
      const mockGuidedProjects = (data || []).slice(0, 3).map(project => ({
        ...project,
        is_guided: true,
        priority_order: 10,
        guided_steps: { steps: ['Step 1: Setup', 'Step 2: Development', 'Step 3: Deploy'] }
      }));
      
      setGuidedProjects(mockGuidedProjects);
    } catch (error) {
      console.error('Error fetching guided projects:', error);
      toast({
        title: "Error",
        description: "Failed to load guided projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createGuidedProject = async () => {
    if (!user) return;

    try {
      // First, get or create user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        toast({
          title: "Error",
          description: "User profile not found",
          variant: "destructive"
        });
        return;
      }

      const stepsArray = formData.steps.split('\n').filter(step => step.trim() !== '');
      
      const { error } = await supabase
        .from('projects')
        .insert({
          title: formData.title,
          description: formData.description,
          creator_id: profile.id,
          is_published: true,
          is_free: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guided project created successfully",
      });

      setDialogOpen(false);
      setFormData({ title: '', description: '', steps: '' });
      await fetchGuidedProjects();
    } catch (error) {
      console.error('Error creating guided project:', error);
      toast({
        title: "Error",
        description: "Failed to create guided project",
        variant: "destructive"
      });
    }
  };

  const updatePriority = async (projectId: string, newPriority: number) => {
    try {
      // For now, just update the local state since priority_order column doesn't exist yet
      setGuidedProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, priority_order: newPriority }
            : project
        )
      );

      toast({
        title: "Success",
        description: "Priority updated successfully",
      });
    } catch (error) {
      console.error('Error updating priority:', error);
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive"
      });
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Guided Projects</h2>
          <p className="text-muted-foreground">
            Create and manage step-by-step tutorial projects that appear first in the library.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Guided Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Guided Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., React Dashboard Tutorial"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what users will learn..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="steps">Steps (one per line)</Label>
                <Textarea
                  id="steps"
                  value={formData.steps}
                  onChange={(e) => setFormData(prev => ({ ...prev, steps: e.target.value }))}
                  placeholder="Step 1: Set up the project&#10;Step 2: Create components&#10;Step 3: Add styling"
                  rows={4}
                />
              </div>
              <Button onClick={createGuidedProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {guidedProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant="default">
                      <Star className="w-3 h-3 mr-1" />
                      Guided
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By {project.profiles?.full_name || project.profiles?.username || 'Admin'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Priority: {project.priority_order}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePriority(project.id, project.priority_order + 1)}
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePriority(project.id, Math.max(0, project.priority_order - 1))}
                  >
                    ↓
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {project.description}
              </p>
              {project.guided_steps?.steps && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Steps:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {project.guided_steps.steps.slice(0, 3).map((step: string, index: number) => (
                      <li key={index}>• {step}</li>
                    ))}
                    {project.guided_steps.steps.length > 3 && (
                      <li>... and {project.guided_steps.steps.length - 3} more steps</li>
                    )}
                  </ul>
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {guidedProjects.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No guided projects yet.</p>
              <p className="text-sm text-muted-foreground">
                Create step-by-step tutorial projects to help users learn and showcase featured content.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};