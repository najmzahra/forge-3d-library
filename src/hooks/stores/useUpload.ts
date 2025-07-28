import { useUploadStore } from '@/stores/uploadStore';
import { UploadedFileMetadata, ProjectUpload } from '@/types';
import { toast } from 'sonner';

/**
 * Enhanced upload hook with file handling utilities
 */
export const useUpload = () => {
  const {
    files,
    projects,
    currentUpload,
    addFile,
    updateFile,
    removeFile,
    clearFiles,
    createProject,
    updateProject,
    deleteProject,
    setCurrentUpload,
    getFileById,
    getProjectById,
    getFilesByProject,
    getUploadProgress,
    hasActiveUploads,
  } = useUploadStore();

  const uploadFile = async (file: File, projectId?: string): Promise<UploadedFileMetadata> => {
    const fileMetadata: UploadedFileMetadata = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'uploading',
      progress: 0,
      projectId,
    };

    addFile(fileMetadata);

    try {
      // Simulate file upload with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateFile(fileMetadata.id, { progress });
      }

      // Simulate processing
      updateFile(fileMetadata.id, { status: 'processing', progress: 100 });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Complete upload
      const finalMetadata: Partial<UploadedFileMetadata> = {
        status: 'completed',
        url: `https://example.com/files/${fileMetadata.id}`,
        thumbnailUrl: file.type.startsWith('image/') 
          ? `https://example.com/thumbnails/${fileMetadata.id}` 
          : undefined,
      };

      updateFile(fileMetadata.id, finalMetadata);
      return { ...fileMetadata, ...finalMetadata } as UploadedFileMetadata;
      
    } catch (error) {
      updateFile(fileMetadata.id, { status: 'failed' });
      toast.error(`Failed to upload ${file.name}`);
      throw error;
    }
  };

  const uploadMultipleFiles = async (files: FileList | File[], projectId?: string) => {
    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(file => uploadFile(file, projectId));
    
    try {
      const results = await Promise.allSettled(uploadPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0) {
        toast.success(`${successful} file(s) uploaded successfully`);
      }
      if (failed > 0) {
        toast.error(`${failed} file(s) failed to upload`);
      }
      
      return results;
    } catch (error) {
      toast.error('Upload failed');
      throw error;
    }
  };

  const createProjectWithFiles = async (
    projectData: Omit<ProjectUpload, 'id' | 'createdAt' | 'updatedAt' | 'files'>,
    files: FileList | File[]
  ) => {
    try {
      // Create project first
      const project = createProject({
        ...projectData,
        files: [],
      });

      // Upload files and associate with project
      await uploadMultipleFiles(files, project.id);

      // Update project with files
      const projectFiles = getFilesByProject(project.id);
      updateProject(project.id, { 
        files: projectFiles,
        status: projectFiles.every(f => f.status === 'completed') ? 'submitted' : 'draft'
      });

      return project;
    } catch (error) {
      toast.error('Failed to create project');
      throw error;
    }
  };

  const retryFailedFiles = async (projectId: string) => {
    const projectFiles = getFilesByProject(projectId);
    const failedFiles = projectFiles.filter(f => f.status === 'failed');
    
    for (const file of failedFiles) {
      updateFile(file.id, { status: 'uploading', progress: 0 });
      
      try {
        // Simulate retry
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          updateFile(file.id, { progress });
        }
        
        updateFile(file.id, { status: 'completed' });
      } catch (error) {
        updateFile(file.id, { status: 'failed' });
      }
    }
  };

  const getDraftProjects = () => 
    projects.filter(p => p.status === 'draft');

  const getSubmittedProjects = () => 
    projects.filter(p => p.status === 'submitted' || p.status === 'reviewing');

  const getApprovedProjects = () => 
    projects.filter(p => p.status === 'approved');

  return {
    // State
    files,
    projects,
    currentUpload,
    
    // File Actions
    uploadFile,
    uploadMultipleFiles,
    updateFile,
    removeFile,
    clearFiles,
    
    // Project Actions
    createProject,
    createProjectWithFiles,
    updateProject,
    deleteProject,
    setCurrentUpload,
    
    // Utilities
    getFileById,
    getProjectById,
    getFilesByProject,
    retryFailedFiles,
    getDraftProjects,
    getSubmittedProjects,
    getApprovedProjects,
    
    // Computed
    uploadProgress: getUploadProgress(),
    hasActiveUploads: hasActiveUploads(),
    totalFiles: files.length,
    totalProjects: projects.length,
  };
};
