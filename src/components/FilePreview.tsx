import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Image, Download, Eye, Trash2 } from 'lucide-react';
import { FileUploadMetadata } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  files: FileUploadMetadata[];
  onRemove?: (index: number) => void;
  onDownload?: (file: FileUploadMetadata) => void;
  className?: string;
  showActions?: boolean;
}

export const FilePreview = ({ 
  files, 
  onRemove, 
  onDownload, 
  className,
  showActions = true 
}: FilePreviewProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getFileIcon = (fileName: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const extension = fileName.toLowerCase().split('.').pop();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8';
    
    if (imageExtensions.includes(extension || '')) {
      return <Image className={iconSize} />;
    }
    return <FileText className={iconSize} />;
  };

  const getFileTypeColor = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
        return 'bg-green-500';
      case 'step':
      case 'stp':
        return 'bg-blue-500';
      case 'dwg':
        return 'bg-yellow-500';
      case 'sldprt':
        return 'bg-purple-500';
      case 'f3d':
        return 'bg-orange-500';
      default:
        return 'bg-muted-foreground';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '');
  };

  const handleDownload = (file: FileUploadMetadata) => {
    if (onDownload) {
      onDownload(file);
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (files.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No files uploaded</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              {/* File Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className={cn("text-white text-xs", getFileTypeColor(file.name))}
                >
                  {file.name.split('.').pop()?.toUpperCase()}
                </Badge>
              </div>

              {/* Image Preview */}
              {isImageFile(file.name) && (
                <div className="mb-3">
                  <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 3D File Preview Placeholder */}
              {!isImageFile(file.name) && (
                <div className="mb-3">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    {getFileIcon(file.name, 'lg')}
                  </div>
                </div>
              )}

              {/* Actions */}
              {showActions && (
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {/* Preview for images */}
                    {isImageFile(file.name) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{file.name}</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center">
                            <img
                              src={file.url}
                              alt={file.name}
                              className="max-w-full max-h-[70vh] object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Download */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>

                  {/* Remove */}
                  {onRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};