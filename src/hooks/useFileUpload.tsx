import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FileUploadMetadata {
  name: string;
  size: number;
  type: string;
  url: string;
  bucket: string;
  path: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: FileUploadMetadata;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = [
  'application/step',
  'application/stp',
  'application/dwg',
  'application/octet-stream', // For SLDPRT, F3D, etc.
  'model/step',
  'model/stp',
  'image/jpeg',
  'image/png',
  'image/webp'
];

export const useFileUpload = () => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds 50MB limit`;
    }

    // More flexible file type checking for 3D files
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const allowed3DExtensions = ['step', 'stp', 'dwg', 'sldprt', 'f3d', 'igs', 'stl'];
    const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    const isValid3DFile = allowed3DExtensions.includes(fileExtension || '');
    const isValidImageFile = allowedImageExtensions.includes(fileExtension || '');
    const isValidMimeType = ALLOWED_FILE_TYPES.includes(file.type);

    if (!isValid3DFile && !isValidImageFile && !isValidMimeType) {
      return `File type "${fileExtension}" is not supported`;
    }

    return null;
  };

  const generateSecureFileName = (file: File): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.toLowerCase().split('.').pop();
    return `${timestamp}_${randomString}.${fileExtension}`;
  };

  const uploadFile = async (
    file: File, 
    bucket: 'project-files' | 'project-previews',
    folder?: string
  ): Promise<FileUploadMetadata | null> => {
    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const fileName = generateSecureFileName(file);
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      url: urlData.publicUrl,
      bucket,
      path: filePath
    };
  };

  const uploadFiles = async (
    files: File[],
    bucket: 'project-files' | 'project-previews',
    folder?: string
  ): Promise<FileUploadMetadata[]> => {
    setIsUploading(true);
    
    // Initialize upload progress tracking
    const initialUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));
    
    setUploads(initialUploads);

    const results: FileUploadMetadata[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update status to uploading
        setUploads(prev => prev.map((upload, index) => 
          index === i ? { ...upload, status: 'uploading', progress: 0 } : upload
        ));

        try {
          // Simulate progress for better UX
          const progressInterval = setInterval(() => {
            setUploads(prev => prev.map((upload, index) => 
              index === i && upload.progress < 90 
                ? { ...upload, progress: upload.progress + 10 } 
                : upload
            ));
          }, 200);

          const metadata = await uploadFile(file, bucket, folder);
          
          clearInterval(progressInterval);
          
          if (metadata) {
            results.push(metadata);
            
            // Update to completed
            setUploads(prev => prev.map((upload, index) => 
              index === i 
                ? { ...upload, status: 'completed', progress: 100, metadata } 
                : upload
            ));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          
          setUploads(prev => prev.map((upload, index) => 
            index === i 
              ? { ...upload, status: 'error', error: errorMessage } 
              : upload
          ));
          
          toast({
            title: "Upload Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsUploading(false);
    }

    return results;
  };

  const removeFile = async (bucket: string, path: string): Promise<boolean> => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const clearUploads = () => {
    setUploads([]);
  };

  return {
    uploads,
    isUploading,
    uploadFiles,
    removeFile,
    clearUploads,
    validateFile
  };
};