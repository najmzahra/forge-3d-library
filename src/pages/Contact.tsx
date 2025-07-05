import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our platform or need technical support? 
              We're here to help you succeed with your engineering projects.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-industrial-white border-industrial-steel/20 shadow-card">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">
                    Send us a Message
                  </h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-foreground font-medium">
                          First Name
                        </Label>
                        <Input 
                          id="firstName"
                          placeholder="Enter your first name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-foreground font-medium">
                          Last Name
                        </Label>
                        <Input 
                          id="lastName"
                          placeholder="Enter your last name"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground font-medium">
                        Email Address
                      </Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-foreground font-medium">
                        Subject
                      </Label>
                      <Input 
                        id="subject"
                        placeholder="What is this regarding?"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground font-medium">
                        Message
                      </Label>
                      <Textarea 
                        id="message"
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card className="bg-industrial-white border-industrial-steel/20 shadow-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Get in Touch
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <div className="text-muted-foreground">support@industrial3dstore.com</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Phone</div>
                        <div className="text-muted-foreground">+1 (555) 123-4567</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Address</div>
                        <div className="text-muted-foreground">
                          123 Industrial Ave<br/>
                          Engineering District, ED 12345
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Business Hours</div>
                        <div className="text-muted-foreground">
                          Mon - Fri: 9:00 AM - 6:00 PM<br/>
                          Sat: 10:00 AM - 4:00 PM<br/>
                          Sun: Closed
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="bg-industrial-white border-industrial-steel/20 shadow-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Quick Help
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-foreground text-sm">File Upload Issues?</div>
                      <div className="text-muted-foreground text-sm">Check our supported formats and size limits</div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-foreground text-sm">Payment Questions?</div>
                      <div className="text-muted-foreground text-sm">Review our pricing and commission structure</div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-foreground text-sm">Project Approval?</div>
                      <div className="text-muted-foreground text-sm">Learn about our 48-hour validation process</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;