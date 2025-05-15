
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CourseSection } from "@/components/landing/CourseSection";
import { UserRolesSection } from "@/components/landing/UserRolesSection";
import { InstructorsSection } from "@/components/landing/InstructorsSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { CourseStructureSection } from "@/components/landing/CourseStructureSection";
import { Footer } from "@/components/landing/Footer"; // New import

const Index = () => {
  return (
    <div className="min-h-screen ">
      <HeroSection />
      <FeaturesSection />
      <CourseStructureSection />
      <UserRolesSection />
      <CourseSection />
      <InstructorsSection />
      {/* <ComparisonSection /> */}
      <Footer /> {/* New Footer component */}
    </div>
  );
};

export default Index;