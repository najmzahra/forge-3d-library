export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: 'admin' | 'designer' | 'engineer' | 'user';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: 'admin' | 'designer' | 'engineer' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  format: string;
  downloadUrl: string;
}

export interface ProjectAuthor {
  id: string;
  name: string;
  avatar: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: ProjectAuthor;
  thumbnail: string;
  images: string[];
  downloads: number;
  likes: number;
  featured: boolean;
  fileSize: string;
  format: string;
  createdAt: string;
  updatedAt: string;
  files: ProjectFile[];
}

export interface Category {
  category: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface ProjectFilters {
  category?: string;
  search?: string;
  tags?: string[];
  featured?: boolean;
  sortBy?: 'newest' | 'popular' | 'downloads';
  limit?: number;
  offset?: number;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
