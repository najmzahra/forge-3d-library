import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Box, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero py-20 md:py-32 overflow-hidden">
      {/* Industrial pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-industrial-white/20"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2 bg-industrial-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Box className="h-5 w-5 text-primary" />
              <span className="text-industrial-white text-sm font-medium">Industrial Grade Quality</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-industrial-white mb-6 leading-tight">
            Accelerate Your
            <span className="block text-primary">Engineering Workflow</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-industrial-steel mb-8 max-w-3xl mx-auto leading-relaxed">
            Get ready-to-use CAD files, 3D models & real projects. 
            Join the premier platform trusted by engineers and designers across industries.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="bg-industrial-white/10 backdrop-blur-sm rounded-lg p-4 mb-3">
                <Wrench className="h-8 w-8 text-primary mx-auto" />
              </div>
              <div className="text-2xl font-bold text-industrial-white">10K+</div>
              <div className="text-industrial-steel">3D Models</div>
            </div>
            <div className="text-center">
              <div className="bg-industrial-white/10 backdrop-blur-sm rounded-lg p-4 mb-3">
                <Users className="h-8 w-8 text-primary mx-auto" />
              </div>
              <div className="text-2xl font-bold text-industrial-white">5K+</div>
              <div className="text-industrial-steel">Engineers</div>
            </div>
            <div className="text-center">
              <div className="bg-industrial-white/10 backdrop-blur-sm rounded-lg p-4 mb-3">
                <Box className="h-8 w-8 text-primary mx-auto" />
              </div>
              <div className="text-2xl font-bold text-industrial-white">48hrs</div>
              <div className="text-industrial-steel">Validation</div>
            </div>
          </div>

          <div className="text-industrial-steel/80 text-sm mb-4">
            Professional platform for industrial 3D models and guided learning
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;