import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UploadedFileMetadata, ProjectUpload } from '@/types';
import { toast } from 'sonner';

interface UploadStore {
  // State
  files: UploadedFileMetadata[];
  projects: ProjectUpload[];
  currentUpload: ProjectUpload | null;

  // File Actions
  addFile: (file: UploadedFileMetadata) => void;
  updateFile: (id: string, updates: Partial<UploadedFileMetadata>) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;

  // Project Actions
  createProject: (project: Omit<ProjectUpload, 'id' | 'createdAt' | 'updatedAt'>) => ProjectUpload;
  updateProject: (id: string, updates: Partial<ProjectUpload>) => void;
  deleteProject: (id: string) => void;
  setCurrentUpload: (project: ProjectUpload | null) => void;

  // Computed
  getFileById: (id: string) => UploadedFileMetadata | undefined;
  getProjectById: (id: string) => ProjectUpload | undefined;
  getFilesByProject: (projectId: string) => UploadedFileMetadata[];
  getUploadProgress: () => number;
  hasActiveUploads: () => boolean;
}

export const useUploadStore = create<UploadStore>()(
  persist(
    (set, get) => ({
      // Initial state
      files: [],
      projects: [],
      currentUpload: null,

      // File Actions
      addFile: (file: UploadedFileMetadata) => {
        set((state) => ({
          files: [...state.files, file],
        }));
      },

      updateFile: (id: string, updates: Partial<UploadedFileMetadata>) => {
        set((state) => ({
          files: state.files.map(file =>
            file.id === id ? { ...file, ...updates } : file
          ),
        }));

        // Update project if file status changes
        const file = get().files.find(f => f.id === id);
        if (file?.projectId && updates.status) {
          const projectFiles = get().getFilesByProject(file.projectId);
          const allCompleted = projectFiles.every(f => f.status === 'completed');
          const anyFailed = projectFiles.some(f => f.status === 'failed');

          if (allCompleted) {
            get().updateProject(file.projectId, { status: 'submitted' });
            toast.success('Project files uploaded successfully!');
          } else if (anyFailed) {
            get().updateProject(file.projectId, { status: 'draft' });
            toast.error('Some files failed to upload');
          }
        }
      },

      removeFile: (id: string) => {
        set((state) => ({
          files: state.files.filter(file => file.id !== id),
        }));
      },

      clearFiles: () => {
        set({ files: [] });
      },

      // Project Actions
      createProject: (projectData) => {
        const newProject: ProjectUpload = {
          ...projectData,
          id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentUpload: newProject,
        }));

        return newProject;
      },

      updateProject: (id: string, updates: Partial<ProjectUpload>) => {
        set((state) => ({
          projects: state.projects.map(project =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          ),
          currentUpload: state.currentUpload?.id === id
            ? { ...state.currentUpload, ...updates, updatedAt: new Date().toISOString() }
            : state.currentUpload,
        }));
      },

      deleteProject: (id: string) => {
        // Remove associated files
        const projectFiles = get().getFilesByProject(id);
        projectFiles.forEach(file => get().removeFile(file.id));

        set((state) => ({
          projects: state.projects.filter(project => project.id !== id),
          currentUpload: state.currentUpload?.id === id ? null : state.currentUpload,
        }));

        toast.success('Project deleted');
      },

      setCurrentUpload: (project: ProjectUpload | null) => {
        set({ currentUpload: project });
      },

      // Computed getters
      getFileById: (id: string) =>
        get().files.find(file => file.id === id),

      getProjectById: (id: string) =>
        get().projects.find(project => project.id === id),

      getFilesByProject: (projectId: string) =>
        get().files.filter(file => file.projectId === projectId),

      getUploadProgress: () => {
        const files = get().files.filter(file => file.status === 'uploading');
        if (files.length === 0) return 100;
        
        const totalProgress = files.reduce((sum, file) => sum + (file.progress || 0), 0);
        return Math.round(totalProgress / files.length);
      },

      hasActiveUploads: () =>
        get().files.some(file => file.status === 'uploading' || file.status === 'processing'),
    }),
    {
      name: 'forge3d-uploads',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        // Don't persist files and currentUpload as they're temporary
      }),
    }
  )
);
