import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Cart } from "@/components/Cart";
import { MakeAdminButton } from "@/components/MakeAdminButton";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out.",
      });
    }
  };

  return (
    <header className="w-full bg-industrial-white border-b-2 border-industrial-steel/20 sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3 group">
          <img 
            src="/lovable-uploads/78017245-bd61-4a1b-8435-32d92d6eb663.png" 
            alt="Industrial 3D Store" 
            className="h-32 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            onClick={scrollToTop}
            className={`font-industrial font-medium transition-colors duration-300 hover:text-primary ${
              currentPath === '/' ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/library" 
            onClick={scrollToTop}
            className={`font-industrial font-medium transition-colors duration-300 hover:text-primary ${
              currentPath === '/library' ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
            }`}
          >
            Library
          </Link>
          <Link 
            to="/guided-projects" 
            onClick={scrollToTop}
            className={`font-industrial font-medium transition-colors duration-300 hover:text-primary ${
              currentPath === '/guided-projects' ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
            }`}
          >
            Guided Projects
          </Link>
          <Link 
            to="/contact" 
            onClick={scrollToTop}
            className={`font-industrial font-medium transition-colors duration-300 hover:text-primary ${
              currentPath === '/contact' ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Upload button - only show on library page */}
        <div className="flex items-center space-x-4">
          {currentPath === '/library' && (
            <Link to="/upload">
              <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground font-industrial font-medium shadow-button">
                Upload Project
              </Button>
            </Link>
          )}
          
          {/* Cart - show when user is logged in */}
          {user && <Cart />}
          
          {/* Make Admin Button */}
          <MakeAdminButton />
          
          {/* Auth section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline" className="font-industrial">
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="default" className="bg-primary hover:bg-primary/90 font-industrial">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;