import Header from "@/components/villa/Header";
import Hero from "@/components/villa/Hero";
import Introduction from "@/components/villa/Introduction";
import Experience from "@/components/villa/Experience";
import LifestyleImage from "@/components/villa/LifestyleImage";
import PropertyOverview from "@/components/villa/PropertyOverview";
import Gallery from "@/components/villa/Gallery";
import BookingSection from "@/components/villa/BookingSection";
import Amenities from "@/components/villa/Amenities";
import Details from "@/components/villa/Details";
import Footer from "@/components/villa/Footer";
import FinalGallery from "@/components/villa/FinalGallery";

import villaRiceView from "@/assets/villa-rice-view.jpg";

const Index = () => {
  // v2 - republish trigger
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Introduction */}
      <Introduction />
      
      {/* Experience Section */}
      <div id="experience">
        <Experience />
      </div>
      
      {/* Lifestyle Transition Image - Villa with Rice Fields */}
      <LifestyleImage 
        src={villaRiceView}
        alt="Nismara Uma Villa surrounded by rice fields"
      />
      
      {/* Property Overview */}
      <PropertyOverview />
      
      {/* Gallery Section */}
      <div id="gallery">
        <Gallery />
      </div>
      
      
      {/* Amenities */}
      <div id="amenities">
        <Amenities />
      </div>
      
      {/* Booking / Availability Section */}
      <BookingSection />
      
      {/* Details - Rates, Policies, etc. */}
      <Details />
      
      {/* Final Villa Photos */}
      <FinalGallery />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
