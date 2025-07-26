import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { LogOut, Settings, User, Upload } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, isAuthenticated, logout } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
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
            className="h-24 w-auto transition-transform duration-300 group-hover:scale-105"
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
                <Upload className="mr-2 h-4 w-4" />
                Upload Project
              </Button>
            </Link>
          )}
          
          {/* Admin-only guided project submission - only show on guided-projects page for admins */}
          {currentPath === '/guided-projects' && isAuthenticated && user?.role === 'admin' && (
            <Link to="/upload?type=guided">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-industrial font-medium">
                <Upload className="mr-2 h-4 w-4" />
                Submit Guided Project
              </Button>
            </Link>
          )}
          
          {/* Auth section */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.firstName} />
                    <AvatarFallback>
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="font-industrial"
                onClick={() => openAuthModal('signin')}
              >
                Login
              </Button>
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90 font-industrial"
                onClick={() => openAuthModal('signup')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};

export default Header;