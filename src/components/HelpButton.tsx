import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HelpButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-16 right-0 bg-industrial-gray-dark text-industrial-white px-3 py-2 rounded-lg shadow-industrial text-sm whitespace-nowrap">
            Help & Contact
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-industrial-gray-dark"></div>
          </div>
        )}

        {/* Help Button */}
        <Link to="/contact">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-industrial rounded-full h-14 w-14 p-0 transition-all duration-300 hover:scale-110"
          >
            <div className="flex items-center justify-center">
              {isHovered ? (
                <MessageCircle className="h-6 w-6" />
              ) : (
                <HelpCircle className="h-6 w-6" />
              )}
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HelpButton;