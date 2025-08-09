import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectSearchParams {
  search?: string;
  category?: string;
  tags?: string;
  author?: string;
  minRating?: number;
  maxPrice?: number;
  isFree?: boolean;
  sortBy?: 'created_at' | 'rating' | 'downloads' | 'price' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProjectsResponse {
  projects: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useProjectCRUD = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchProjects = async (params: ProjectSearchParams = {}): Promise<ProjectsResponse | null> => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      // For now, let's use the direct Supabase query until the edge function is working
      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles!creator_id (
            id,
            user_id,
            username,
            full_name,
            is_creator,
            avatar_url
          )
        `, { count: 'exact' });
        // Show all projects for now (both published and unpublished)

      // Apply search filter
      if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      // Apply category filter
      if (params.category && params.category !== 'all') {
        query = query.eq('category', params.category);
      }

      // Apply tags filter
      if (params.tags) {
        const tagArray = params.tags.split(',').map(tag => tag.trim());
        query = query.overlaps('tags', tagArray);
      }

      // Apply rating filter
      if (params.minRating) {
        query = query.gte('rating', params.minRating);
      }

      // Apply price filters
      if (params.isFree === true) {
        query = query.eq('is_free', true);
      } else if (params.maxPrice) {
        query = query.lte('price', params.maxPrice);
      }

      // Apply sorting
      const ascending = params.sortOrder === 'asc';
      if (params.sortBy === 'rating') {
        query = query.order('rating', { ascending }).order('rating_count', { ascending: false });
      } else if (params.sortBy === 'downloads') {
        query = query.order('download_count', { ascending });
      } else if (params.sortBy === 'price') {
        query = query.order('price', { ascending });
      } else {
        query = query.order(params.sortBy || 'created_at', { ascending });
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 12;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data: projects, error, count } = await query;

      if (error) throw error;

      const data = {
        projects: projects || [],
        totalCount: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        hasNextPage: offset + limit < (count || 0),
        hasPrevPage: page > 1
      };

      return data;
    } catch (error) {
      console.error('Error searching projects:', error);
      toast({
        title: "Search failed",
        description: "Failed to search projects. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('project-crud', {
        method: 'POST',
        body: projectData,
      });

      if (error) throw error;

      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      });

      return data.project;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (projectId: string, projectData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
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

      if (error) throw error;

      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Update failed",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProjects = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user projects:', error);
      toast({
        title: "Fetch failed",
        description: "Failed to fetch your projects. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    searchProjects,
    createProject,
    updateProject,
    deleteProject,
    getUserProjects,
  };
};