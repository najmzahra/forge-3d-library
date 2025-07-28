import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Download, Star, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedProjects } from "@/hooks/api/useProjects";
import { useCart } from "@/hooks/stores/useCart";
import { useApp } from "@/hooks/stores/useApp";

const FeaturedProjectsSection = () => {
  const { data: featuredProjects = [], isLoading, error } = useFeaturedProjects(4);
  const { addToCart, isInCart } = useCart();
  const { notifySuccess } = useApp();

  const handleAddToCart = (project: any) => {
    addToCart(project);
    notifySuccess('Added to cart', `${project.title} has been added to your cart`);
  };

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load featured projects</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Featured Projects
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
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="bg-industrial-white border-industrial-steel/20">
                  <div className="aspect-[4/3]">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3 mb-3" />
                    <div className="flex justify-between mb-3">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))
            : featuredProjects.map((project) => (
                <Card key={project.id} className="bg-industrial-white border-industrial-steel/20 shadow-card hover:shadow-industrial transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${project.thumbnail})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-primary-foreground">
                        FEATURED
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-industrial-white/90">
                        {project.format.split(',')[0].trim()}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="capitalize">{project.category}</span>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3 fill-current text-red-500" />
                        <span>{project.likes}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{project.downloads}</span>
                        </div>
                        <span>{project.fileSize}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="mr-2 h-3 w-3" />
                        View Details
                      </Button>
                      
                      {project.price > 0 ? (
                        <Button 
                          size="sm" 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => handleAddToCart(project)}
                          disabled={isInCart(project.id)}
                        >
                          <ShoppingCart className="mr-2 h-3 w-3" />
                          {isInCart(project.id) ? 'In Cart' : `$${project.price.toFixed(2)}`}
                        </Button>
                      ) : (
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Download className="mr-2 h-3 w-3" />
                          Free Download
                        </Button>
                      )}
                    </div>
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