import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Box, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero py-16 md:py-20 overflow-hidden">
      {/* Industrial pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-industrial-white/20"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl text-left">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2 bg-industrial-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Box className="h-5 w-5 text-primary" />
              <span className="text-industrial-white text-sm font-medium">Industrial Grade Quality</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-industrial-white mb-6 leading-tight">
            Your Industrial Files
            <span className="block text-primary">Marketplace</span>
          </h1>
          
          <p className="text-lg md:text-xl text-industrial-steel mb-8 max-w-2xl leading-relaxed">
            Post, showcase, and sell your 3D industrial models with ease. 
            Join our community of creators and start earning from your work.
          </p>

          <div className="text-industrial-steel/80 text-sm">
            Professional platform for industrial 3D models and guided learning
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;