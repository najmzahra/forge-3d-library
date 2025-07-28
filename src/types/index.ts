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
  price?: number; // For paid projects
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

// Shopping Cart Types
export interface CartItem {
  id: string;
  projectId: string;
  title: string;
  thumbnail: string;
  price: number;
  fileSize: string;
  format: string;
  author: ProjectAuthor;
  addedAt: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// File Upload Types
export interface UploadedFileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url?: string;
  thumbnailUrl?: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress?: number;
  projectId?: string;
}

export interface ProjectUpload {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price?: number;
  files: UploadedFileMetadata[];
  thumbnail?: string;
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  isGuidedProject?: boolean;
}

// Auth State Types
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    showEmail: boolean;
    showProjects: boolean;
  };
}
