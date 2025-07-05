import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";

const GuidedProjects = () => {
  const guidedProjects = [
    {
      id: 1,
      title: "Industrial Workbench Design",
      difficulty: "Beginner",
      duration: "8 hours",
      students: 340,
      price: 89,
      finalProject: "Complete industrial workbench with modular components",
      description: "Learn to design a professional-grade industrial workbench from concept to completion. This project covers parametric modeling, material selection, and manufacturing considerations.",
      learningOutcomes: [
        "Parametric design principles",
        "Material selection criteria", 
        "Manufacturing constraints",
        "Assembly techniques"
      ],
      includes: [
        "Step-by-step video tutorials",
        "Project files and templates",
        "Private tutoring session",
        "Project correction & feedback"
      ]
    },
    {
      id: 2,
      title: "Pneumatic System Assembly",
      difficulty: "Advanced",
      duration: "12 hours",
      students: 156,
      price: 149,
      finalProject: "Complete pneumatic actuation system with control circuits",
      description: "Master advanced pneumatic system design including actuators, valves, and control circuits. Perfect for engineers working in automation and manufacturing.",
      learningOutcomes: [
        "Pneumatic circuit design",
        "Component sizing",
        "Control system integration",
        "Safety considerations"
      ],
      includes: [
        "Advanced video tutorials",
        "Real-world case studies",
        "1-on-1 expert consultation",
        "Certificate of completion"
      ]
    },
    {
      id: 3,
      title: "Conveyor Belt System",
      difficulty: "Intermediate",
      duration: "10 hours",
      students: 290,
      price: 119,
      finalProject: "Modular conveyor system with drive mechanisms",
      description: "Design and analyze conveyor belt systems for industrial applications. Learn about belt selection, drive calculations, and system optimization.",
      learningOutcomes: [
        "Belt selection criteria",
        "Power calculation methods",
        "System optimization",
        "Maintenance planning"
      ],
      includes: [
        "Interactive simulations",
        "Calculation worksheets",
        "Design review sessions",
        "Industry best practices"
      ]
    }
  ];

  const services = [
    {
      title: "Private Tutoring",
      description: "One-on-one sessions with industry experts",
      price: "From $75/hour"
    },
    {
      title: "Project Review",
      description: "Professional feedback on your designs",
      price: "From $45/project"
    },
    {
      title: "Custom Training",
      description: "Tailored learning programs for teams",
      price: "Contact for pricing"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-industrial py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <Badge className="bg-primary text-primary-foreground">
                Learn by Doing
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Guided Learning Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build real industrial projects with step-by-step guidance from experts. 
              Get hands-on experience and professional feedback.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {guidedProjects.map((project) => (
              <Card key={project.id} className="bg-industrial-white border-industrial-steel/20 shadow-card hover:shadow-industrial transition-all duration-300 h-full">
                <div className="aspect-[16/10] bg-gradient-industrial flex items-center justify-center relative">
                  <div className="text-industrial-steel/50 text-4xl font-bold">PROJECT</div>
                  <div className="absolute top-4 left-4">
                    <Badge className={`${
                      project.difficulty === 'Beginner' ? 'bg-green-500' :
                      project.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      {project.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{project.students} students</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 flex-grow">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2">You'll Learn:</h4>
                    <ul className="space-y-1">
                      {project.learningOutcomes.slice(0, 3).map((outcome, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">
                      ${project.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      One-time payment
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Special Services */}
          <section className="bg-industrial-gray-light rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Our Special Services
              </h2>
              <p className="text-muted-foreground">
                Additional support to accelerate your learning journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="bg-industrial-white border-industrial-steel/20 shadow-card text-center">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <div className="text-primary font-semibold mb-4">
                      {service.price}
                    </div>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default GuidedProjects;