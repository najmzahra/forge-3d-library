import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";
import StepsSection from "@/components/home/StepsSection";
import CallToActionSection from "@/components/home/CallToActionSection";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <WhyUsSection />
      <FeaturedProjectsSection />
      <StepsSection />
      <CallToActionSection />
    </Layout>
  );
};

export default Home;