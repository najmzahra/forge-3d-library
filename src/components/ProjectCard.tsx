import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Star, Edit, Trash2, MoreHorizontal, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

interface ProjectCardProps {
  project: any;
  showOwnerActions?: boolean;
  onEdit?: (project: any) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: any) => void;
}

export const ProjectCard = ({ 
  project, 
  showOwnerActions = false, 
  onEdit, 
  onDelete, 
  onView 
}: ProjectCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleDelete = async () => {
    if (!onDelete || !window.confirm('Are you sure you want to delete this project?')) return;
    
    setIsDeleting(true);
    await onDelete(project.id);
    setIsDeleting(false);
  };

  const isOwner = user && project.profiles && project.profiles.user_id === user.id;

  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative overflow-hidden">
        {project.preview_images && project.preview_images.length > 0 ? (
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src={project.preview_images[0]} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-4xl font-bold opacity-50">3D</div>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          {project.profiles?.is_creator ? (
            <Badge className="bg-primary text-primary-foreground">
              CREATOR
            </Badge>
          ) : (
            <Badge variant="secondary">
              COMMUNITY
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90">
            {project.file_url?.split('.').pop()?.toUpperCase() || 'FILE'}
          </Badge>
          
          {(showOwnerActions || isOwner) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(project)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="line-clamp-1">
            By {project.profiles?.username || project.profiles?.full_name || 'Anonymous'}
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            <Star className="h-3 w-3 fill-current text-yellow-500" />
            <span>{project.rating || '0'}</span>
          </div>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 2).map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>{project.download_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{project.view_count || 0}</span>
            </div>
          </div>
          <div className="font-semibold text-primary">
            {project.is_free ? 'Free' : `$${project.price}`}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1"
            onClick={() => onView?.(project)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          
          {!isOwner && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => addToCart(project.id)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};