import {
  Project,
  Category,
  ProjectFilters,
  ProjectsResponse,
  ApiResponse,
} from '@/types';
import projectsData from '@/data/projects.json';
import categoriesData from '@/data/categories.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ProjectService {
  private static projects: Project[] = projectsData;
  private static categories: Category[] = categoriesData;

  static async getProjects(filters: ProjectFilters = {}): Promise<ApiResponse<ProjectsResponse>> {
    await delay(600); // Simulate API call

    let filteredProjects = [...this.projects];

    // Apply category filter
    if (filters.category) {
      filteredProjects = filteredProjects.filter(
        project => project.category === filters.category
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProjects = filteredProjects.filter(
        project =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredProjects = filteredProjects.filter(project =>
        filters.tags!.some(tag => project.tags.includes(tag))
      );
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      filteredProjects = filteredProjects.filter(
        project => project.featured === filters.featured
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filteredProjects.sort((a, b) => b.likes - a.likes);
        break;
      case 'downloads':
        filteredProjects.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
      default:
        filteredProjects.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 12;
    const total = filteredProjects.length;
    const paginatedProjects = filteredProjects.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      success: true,
      message: 'Projects retrieved successfully',
      data: {
        projects: paginatedProjects,
        total,
        hasMore,
      },
    };
  }

  static async getProject(id: string): Promise<ApiResponse<Project | null>> {
    await delay(400);

    const project = this.projects.find(p => p.id === id);

    if (!project) {
      return {
        success: false,
        message: 'Project not found',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    };
  }

  static async getFeaturedProjects(limit: number = 3): Promise<ApiResponse<Project[]>> {
    await delay(400);

    const featuredProjects = this.projects
      .filter(project => project.featured)
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);

    return {
      success: true,
      message: 'Featured projects retrieved successfully',
      data: featuredProjects,
    };
  }

  static async getCategories(): Promise<ApiResponse<Category[]>> {
    await delay(300);

    // Update category counts based on actual projects
    const updatedCategories = this.categories.map(category => ({
      ...category,
      count: this.projects.filter(project => project.category === category.category).length,
    }));

    return {
      success: true,
      message: 'Categories retrieved successfully',
      data: updatedCategories,
    };
  }

  static async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'likes'>): Promise<ApiResponse<Project>> {
    await delay(800);

    const newProject: Project = {
      ...projectData,
      id: `proj-${this.projects.length + 1}`,
      downloads: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.unshift(newProject); // Add to beginning

    return {
      success: true,
      message: 'Project created successfully',
      data: newProject,
    };
  }

  static async likeProject(id: string): Promise<ApiResponse<Project | null>> {
    await delay(300);

    const project = this.projects.find(p => p.id === id);

    if (!project) {
      return {
        success: false,
        message: 'Project not found',
        data: null,
      };
    }

    project.likes += 1;
    project.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: 'Project liked successfully',
      data: project,
    };
  }

  static async downloadProject(id: string): Promise<ApiResponse<Project | null>> {
    await delay(500);

    const project = this.projects.find(p => p.id === id);

    if (!project) {
      return {
        success: false,
        message: 'Project not found',
        data: null,
      };
    }

    project.downloads += 1;
    project.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: 'Download initiated successfully',
      data: project,
    };
  }

  static async getPopularTags(limit: number = 10): Promise<ApiResponse<string[]>> {
    await delay(200);

    // Count tag frequency
    const tagCounts = new Map<string, number>();
    
    this.projects.forEach(project => {
      project.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Sort by frequency and get top tags
    const popularTags = Array.from(tagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);

    return {
      success: true,
      message: 'Popular tags retrieved successfully',
      data: popularTags,
    };
  }
}
