import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-industrial-gray-dark text-industrial-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/lovable-uploads/78017245-bd61-4a1b-8435-32d92d6eb663.png" 
              alt="Industrial 3D Store" 
              className="h-20 w-auto mb-4 filter invert"
            />
            <p className="text-industrial-steel text-sm leading-6 max-w-md">
              The premier platform for industrial 3D models and guided learning projects. 
              Connect with professionals, upload your work, and accelerate your engineering workflow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-industrial-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  onClick={scrollToTop}
                  className="text-industrial-steel hover:text-industrial-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/library" 
                  onClick={scrollToTop}
                  className="text-industrial-steel hover:text-industrial-white transition-colors duration-300"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link 
                  to="/guided-projects" 
                  onClick={scrollToTop}
                  className="text-industrial-steel hover:text-industrial-white transition-colors duration-300"
                >
                  Guided Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={scrollToTop}
                  className="text-industrial-steel hover:text-industrial-white transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-industrial-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-industrial-steel hover:text-industrial-white transition-colors duration-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-industrial-steel hover:text-industrial-white transition-colors duration-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-industrial-steel hover:text-industrial-white transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-industrial-steel/30 mt-8 pt-8 text-center">
          <p className="text-industrial-steel text-sm">
            © 2025 Industrial 3D Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;