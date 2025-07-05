import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Star, Search, Filter } from "lucide-react";

const Library = () => {
  // Mock projects data with admin projects first
  const projects = [
    // Admin projects first
    {
      id: 1,
      title: "Industrial Frame System",
      type: "STEP",
      program: "SolidWorks",
      version: "2023",
      price: 45,
      views: 1250,
      downloads: 340,
      rating: 4.9,
      description: "Complete industrial frame system with parametric components",
      isAdmin: true
    },
    {
      id: 2,
      title: "Pneumatic Actuator Assembly",
      type: "SLDPRT", 
      program: "SolidWorks",
      version: "2022",
      price: 65,
      views: 890,
      downloads: 195,
      rating: 4.8,
      description: "High-precision pneumatic actuator with full assembly",
      isAdmin: true
    },
    // Regular user projects
    {
      id: 3,
      title: "Gear Assembly Model",
      type: "DWG",
      program: "AutoCAD",
      version: "2023",
      price: 25,
      views: 450,
      downloads: 120,
      rating: 4.5,
      description: "Standard gear assembly for mechanical applications",
      isAdmin: false
    },
    {
      id: 4,
      title: "Valve Housing",
      type: "STEP",
      program: "Fusion 360",
      version: "2023",
      price: 35,
      views: 320,
      downloads: 85,
      rating: 4.3,
      description: "Industrial valve housing with mounting brackets",
      isAdmin: false
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-industrial-white border-industrial-steel/20 shadow-card hover:shadow-industrial transition-all duration-300 group cursor-pointer">
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-industrial flex items-center justify-center">
                    <div className="text-industrial-steel/50 text-6xl font-bold">3D</div>
                  </div>
                  <div className="absolute top-3 left-3">
                    {project.isAdmin ? (
                      <Badge className="bg-primary text-primary-foreground">
                        ADMIN
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-accent/20 text-accent">
                        COMMUNITY
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-industrial-white/90">
                      {project.type}
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
                    <span>{project.program} {project.version}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{project.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{project.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{project.downloads}</span>
                      </div>
                    </div>
                    <div className="font-semibold text-primary">
                      ${project.price}
                    </div>
                  </div>

                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

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