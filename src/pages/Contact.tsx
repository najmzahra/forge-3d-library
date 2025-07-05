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
          </div>          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
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
        </div>
      </div>
    </Layout>
  );
};

export default Contact;