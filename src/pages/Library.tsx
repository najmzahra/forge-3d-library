import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Star, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Library = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            profiles (
              username,
              full_name,
              is_creator
            )
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Project Library
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover professional-grade 3D models and CAD files from our community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-industrial-white rounded-lg shadow-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="step">STEP</SelectItem>
                  <SelectItem value="dwg">DWG</SelectItem>
                  <SelectItem value="sldprt">SLDPRT</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="solidworks">SolidWorks</SelectItem>
                  <SelectItem value="autocad">AutoCAD</SelectItem>
                  <SelectItem value="fusion360">Fusion 360</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="bg-industrial-white border-industrial-steel/20 shadow-card hover:shadow-industrial transition-all duration-300 group cursor-pointer">
                  <div className="relative overflow-hidden">
                    {project.preview_images && project.preview_images.length > 0 ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={project.preview_images[0]} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-gradient-industrial flex items-center justify-center">
                        <div className="text-industrial-steel/50 text-6xl font-bold">3D</div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      {project.profiles?.is_creator ? (
                        <Badge className="bg-primary text-primary-foreground">
                          CREATOR
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          COMMUNITY
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-industrial-white/90">
                        {project.file_url?.split('.').pop()?.toUpperCase() || 'FILE'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>By {project.profiles?.username || project.profiles?.full_name || 'Anonymous'}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        <span>{project.rating || '0'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{project.download_count || 0}</span>
                        </div>
                      </div>
                      <div className="font-semibold text-primary">
                        {project.is_free ? 'Free' : `$${project.price}`}
                      </div>
                    </div>

                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {projects.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No projects found. Be the first to upload!</p>
                </div>
              )}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Load More Projects
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Library;