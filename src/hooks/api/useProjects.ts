import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ProjectService } from '@/services/projectService';
import { ProjectFilters, Project } from '@/types';
import { toast } from 'sonner';

export const useProjects = (filters: ProjectFilters = {}) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const response = await ProjectService.getProjects(filters);
      return response.success ? response.data : { projects: [], total: 0, hasMore: false };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useInfiniteProjects = (filters: ProjectFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ['infiniteProjects', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await ProjectService.getProjects({
        ...filters,
        offset: pageParam,
        limit: filters.limit || 12,
      });
      return response.success ? response.data : { projects: [], total: 0, hasMore: false };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length * (filters.limit || 12);
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await ProjectService.getProject(id);
      return response.success ? response.data : null;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFeaturedProjects = (limit?: number) => {
  return useQuery({
    queryKey: ['featuredProjects', limit],
    queryFn: async () => {
      const response = await ProjectService.getFeaturedProjects(limit);
      return response.success ? response.data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await ProjectService.getCategories();
      return response.success ? response.data : [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const usePopularTags = (limit?: number) => {
  return useQuery({
    queryKey: ['popularTags', limit],
    queryFn: async () => {
      const response = await ProjectService.getPopularTags(limit);
      return response.success ? response.data : [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'likes'>) =>
      ProjectService.createProject(projectData),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate and refetch projects
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['infiniteProjects'] });
        queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error('Failed to create project');
    },
  });
};

export const useLikeProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProjectService.likeProject(id),
    onSuccess: (response, id) => {
      if (response.success) {
        // Update the project in cache
        queryClient.setQueryData(['project', id], response.data);
        
        // Invalidate projects lists to update the like count
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['infiniteProjects'] });
        queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
        
        toast.success('Project liked!');
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error('Failed to like project');
    },
  });
};

export const useDownloadProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProjectService.downloadProject(id),
    onSuccess: (response, id) => {
      if (response.success) {
        // Update the project in cache
        queryClient.setQueryData(['project', id], response.data);
        
        // Invalidate projects lists to update the download count
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['infiniteProjects'] });
        queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
        
        toast.success('Download started!');
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error('Failed to download project');
    },
  });
};
