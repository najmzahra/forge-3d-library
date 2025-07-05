import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, BookOpen, ArrowRight, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Industrial grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="border border-industrial-white/20"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="bg-industrial-white/10 backdrop-blur-sm rounded-full p-3">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-industrial-white mb-4">
            Ready to Accelerate Your Workflow?
          </h2>
          <p className="text-xl text-industrial-steel max-w-2xl mx-auto mb-8">
            Join thousands of engineers and designers who trust our platform 
            for their industrial 3D modeling needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Upload Action */}
          <Card className="bg-industrial-white/10 backdrop-blur-sm border-industrial-white/20 hover:bg-industrial-white/15 transition-all duration-300">            <CardContent className="p-8 text-center">
              <div className="bg-primary/20 rounded-full p-4 w-fit mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-industrial-white mb-3">
                Share Your Expertise
              </h3>
              <p className="text-industrial-steel mb-6">
                Upload your 3D models and CAD files. Get them validated by professionals 
                and start earning from your technical expertise.
              </p>
              <Link to="/upload">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full">
                  Start Uploading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Learn Action */}
          <Card className="bg-industrial-white/10 backdrop-blur-sm border-industrial-white/20 hover:bg-industrial-white/15 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="bg-accent/20 rounded-full p-4 w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-industrial-white mb-3">
                Learn Through Projects
              </h3>
              <p className="text-industrial-steel mb-6">
                Access guided learning projects with step-by-step instructions, 
                private tutoring, and professional feedback.
              </p>
              <Link to="/guided-projects">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-medium w-full">
                  Explore Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;