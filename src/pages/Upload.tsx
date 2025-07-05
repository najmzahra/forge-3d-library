import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Upload = () => {
  // Mock user projects progress
  const userProjects = [
    {
      id: 1,
      title: "Mechanical Joint Assembly",
      status: "approved",
      submittedDate: "2025-01-15",
      approvedDate: "2025-01-17"
    },
    {
      id: 2,
      title: "Bearing Housing Model",
      status: "pending",
      submittedDate: "2025-01-20",
      reason: ""
    },
    {
      id: 3,
      title: "Pump Casing Design",
      status: "denied",
      submittedDate: "2025-01-10",
      reason: "Model lacks technical drawings and specifications"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending Review</Badge>;
      case 'denied':
        return <Badge className="bg-red-500 text-white">Denied</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upload Your Project
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your project with our professional community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Form */}
            <div className="lg:col-span-2">
              <Card className="bg-industrial-white border-industrial-steel/20 shadow-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="projectName" className="text-foreground font-medium">
                      Project Name *
                    </Label>
                    <Input 
                      id="projectName"
                      placeholder="Enter your project name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-foreground font-medium">
                      Description *
                    </Label>
                    <Textarea 
                      id="description"
                      placeholder="Describe your project, its features, and applications..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="program" className="text-foreground font-medium">
                        Program Used *
                      </Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solidworks">SolidWorks</SelectItem>
                          <SelectItem value="autocad">AutoCAD</SelectItem>
                          <SelectItem value="fusion360">Fusion 360</SelectItem>
                          <SelectItem value="inventor">Inventor</SelectItem>
                          <SelectItem value="catia">CATIA</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="version" className="text-foreground font-medium">
                        Program Version *
                      </Label>
                      <Input 
                        id="version"
                        placeholder="e.g., 2024, 2025"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="coverPhoto" className="text-foreground font-medium">
                      Cover Photo *
                    </Label>
                    <div className="mt-1 border-2 border-dashed border-industrial-steel/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <UploadIcon className="h-8 w-8 text-industrial-steel mx-auto mb-2" />
                      <p className="text-muted-foreground mb-2">
                        Drag and drop your cover image, or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 5MB
                      </p>
                      <Button variant="outline" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="projectFile" className="text-foreground font-medium">
                      Project Files *
                    </Label>
                    <div className="mt-1 border-2 border-dashed border-industrial-steel/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <FileText className="h-8 w-8 text-industrial-steel mx-auto mb-2" />
                      <p className="text-muted-foreground mb-2">
                        Upload your 3D model files
                      </p>
                      <p className="text-sm text-muted-foreground">
                        STEP, DWG, SLDPRT, F3D files up to 50MB each
                      </p>
                      <Button variant="outline" className="mt-2">
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  <div className="bg-industrial-gray-light/50 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Before submitting:</p>
                        <ul className="mt-1 text-muted-foreground space-y-1">
                          <li>• Ensure your files meet our quality standards</li>
                          <li>• Include detailed descriptions and specifications</li>
                          <li>• Projects undergo a 48-hour validation process</li>
                          <li>• You'll receive email notifications about approval status</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    Submit for Review
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    Need to login first? Your progress will be saved.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Section */}
            <div>
              <Card className="bg-industrial-white border-industrial-steel/20 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Your Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProjects.map((project) => (
                    <div key={project.id} className="border border-industrial-steel/20 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-foreground text-sm">
                          {project.title}
                        </h4>
                        {getStatusIcon(project.status)}
                      </div>
                      
                      <div className="mb-2">
                        {getStatusBadge(project.status)}
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Submitted: {project.submittedDate}</p>
                        {project.status === 'approved' && project.approvedDate && (
                          <p>Approved: {project.approvedDate}</p>
                        )}
                        {project.status === 'denied' && project.reason && (
                          <p className="text-red-600">Reason: {project.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {userProjects.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <UploadIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No projects uploaded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card className="bg-industrial-white border-industrial-steel/20 shadow-card mt-6">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground">Supported Formats:</h4>
                    <p className="text-muted-foreground">STEP, DWG, SLDPRT, F3D, IGS, STL</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">File Size Limits:</h4>
                    <p className="text-muted-foreground">Up to 50MB per file, 200MB total</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Quality Standards:</h4>
                    <p className="text-muted-foreground">Professional-grade models with proper documentation</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Revenue Sharing:</h4>
                    <p className="text-muted-foreground">First 3 sales free, then 10% platform fee</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;