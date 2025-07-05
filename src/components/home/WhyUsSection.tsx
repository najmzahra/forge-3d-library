import { Card, CardContent } from "@/components/ui/card";
import { Upload, GraduationCap, DollarSign, Shield, Clock, Users } from "lucide-react";

const WhyUsSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload & Earn",
      description: "Share your 3D models and CAD files with our community. Earn money from each approved project with our fair revenue sharing model."
    },
    {
      icon: GraduationCap,
      title: "Learn Through Projects",
      description: "Access guided learning projects with step-by-step instructions, corrections, and private tutoring opportunities."
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Every project goes through a 48-hour validation process by our expert team to ensure industrial-grade quality."
    },
    {
      icon: Clock,
      title: "Fast Workflow",
      description: "Find ready-to-use files instantly. No more starting from scratch - accelerate your engineering projects today."
    },
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description: "Transparent pricing with the first 3 transactions free. We take only 10% commission to support platform growth."
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with engineers and designers across industries. Build your professional network while sharing knowledge."
    }
  ];

  return (
    <section className="py-20 bg-industrial-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Industrial 3D Store?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built by engineers, for engineers. Experience the difference of a platform designed 
            specifically for industrial and technical professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-industrial-white border-industrial-steel/20 shadow-card hover:shadow-industrial transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="bg-gradient-industrial rounded-lg p-3 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;