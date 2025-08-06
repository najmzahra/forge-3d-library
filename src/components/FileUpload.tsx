import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFileUpload, FileUploadMetadata } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  bucket: 'project-files' | 'project-previews';
  folder?: string;
  accept?: string;
  maxFiles?: number;
  onUploadComplete?: (files: FileUploadMetadata[]) => void;
  onUploadStart?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const FileUpload = ({
  bucket,
  folder,
  accept,
  maxFiles = 10,
  onUploadComplete,
  onUploadStart,
  className,
  children
}: FileUploadProps) => {
  const { uploads, isUploading, uploadFiles, clearUploads } = useFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadMetadata[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    onUploadStart?.();
    clearUploads();
    
    const results = await uploadFiles(acceptedFiles, bucket, folder);
    
    if (results.length > 0) {
      setUploadedFiles(prev => [...prev, ...results]);
      onUploadComplete?.(results);
    }
  }, [bucket, folder, uploadFiles, onUploadComplete, onUploadStart, clearUploads]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxFiles,
    disabled: isUploading
  });

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    if (imageExtensions.includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-primary/50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        
        {children ? (
          children
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              {isDragActive 
                ? "Drop files here..." 
                : "Drag and drop files, or click to browse"
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {bucket === 'project-files' 
                ? "STEP, DWG, SLDPRT, F3D files up to 50MB each"
                : "PNG, JPG, WebP up to 5MB"
              }
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploading Files</h4>
          {uploads.map((upload, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(upload.file.name)}
                  <span className="text-sm font-medium truncate">
                    {upload.file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(upload.file.size)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {upload.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <Badge variant={
                    upload.status === 'completed' ? 'default' :
                    upload.status === 'error' ? 'destructive' :
                    'secondary'
                  }>
                    {upload.status}
                  </Badge>
                </div>
              </div>
              
              {upload.status === 'uploading' && (
                <Progress value={upload.progress} className="h-1" />
              )}
              
              {upload.error && (
                <p className="text-xs text-destructive">{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploaded Files</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between border rounded-lg p-3">
              <div className="flex items-center space-x-2">
                {getFileIcon(file.name)}
                <span className="text-sm font-medium truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <Badge variant="outline">Uploaded</Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeUploadedFile(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};