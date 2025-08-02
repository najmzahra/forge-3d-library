import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Star } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedProjectsSection = () => {
  // Mock admin projects data
  const adminProjects = [
    {
      id: 1,
      title: "Industrial Frame System",
      type: "STEP",
      program: "SolidWorks",
      version: "2023",
      price: 45,
      image: "/api/placeholder/300/200",
      views: 1250,
      downloads: 340,
      rating: 4.9,
      description: "Complete industrial frame system with parametric components"
    },
    {
      id: 2,
      title: "Pneumatic Actuator Assembly",
      type: "SLDPRT", 
      program: "SolidWorks",
      version: "2022",
      price: 65,
      image: "/api/placeholder/300/200",
      views: 890,
      downloads: 195,
      rating: 4.8,
      description: "High-precision pneumatic actuator with full assembly"
    },
    {
      id: 3,
      title: "Conveyor Belt Module",
      type: "DWG",
      program: "AutoCAD",
      version: "2023",
      price: 35,
      image: "/api/placeholder/300/200",
      views: 2100,
      downloads: 670,
      rating: 4.9,
      description: "Modular conveyor system components for manufacturing"
    },
    {
      id: 4,
      title: "Robotic Arm Base",
      type: "STEP",
      program: "Fusion 360",
      version: "2023",
      price: 85,
      image: "/api/placeholder/300/200",
      views: 750,
      downloads: 125,
      rating: 5.0,
      description: "Professional-grade robotic arm base with mounting options"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Admin Featured
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Grade Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by designers and engineers across industries. 
            These premium models showcase the quality you can expect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {adminProjects.map((project) => (
            <Card key={project.id} className="bg-industrial-white border-industrial-steel/20 shadow-card hover:shadow-industrial transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-industrial flex items-center justify-center">
                  <div className="text-industrial-steel/50 text-6xl font-bold">3D</div>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground">
                    ADMIN
                  </Badge>
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
                </div>

                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/library">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;