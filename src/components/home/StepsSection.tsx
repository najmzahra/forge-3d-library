import { Card, CardContent } from "@/components/ui/card";
import { Upload, BookOpen, DollarSign, ArrowRight } from "lucide-react";

const StepsSection = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Work",
      description: "Share your 3D models, CAD files, and technical drawings with our professional community.",
      details: ["48-hour validation process", "Professional quality standards", "Multiple file format support"]
    },
    {
      number: "02", 
      icon: BookOpen,
      title: "Learn & Improve",
      description: "Access guided projects, step-by-step tutorials, and get feedback from industry experts.",
      details: ["Guided learning projects", "Private tutoring available", "Project corrections & feedback"]
    },
    {
      number: "03",
      icon: DollarSign,
      title: "Earn Money",
      description: "Get paid for your approved projects. Build your reputation and grow your professional network.",
      details: ["Fair revenue sharing", "First 3 transactions free", "Only 10% platform commission"]
    }
  ];

  return (
    <section className="py-20 bg-industrial-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to start sharing your engineering expertise 
            and accelerating your professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              <Card className="bg-industrial-white border-industrial-steel/20 shadow-card hover:shadow-industrial transition-all duration-300 hover:scale-105 h-full">
                <CardContent className="p-8 text-center">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-industrial rounded-full mb-6 relative">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <step.icon className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Arrow for mobile */}
              {index < steps.length - 1 && (
                <div className="flex justify-center lg:hidden my-4">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;