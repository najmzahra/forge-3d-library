import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background font-industrial">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <HelpButton />
    </div>
  );
};

export default Layout;