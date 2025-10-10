import { Unlock } from "lucide-react";
import ScrollingTopics from "@/components/ScrollingTopics";
import BonusSection from "@/components/BonusSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import MembersCounter from "@/components/MembersCounter";
import GuaranteeSection from "@/components/GuaranteeSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import mascotLogo from "@/assets/mascot-logo.png";

const Index = () => {
  const scrollToTopics = () => {
    const topicsSection = document.getElementById('topics-section');
    if (topicsSection) {
      topicsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-6 overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, rgba(139, 0, 0, 0.4) 0%, rgba(0, 0, 0, 1) 70%)' }}>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Mascot with Logo */}
          <div className="relative z-0 flex justify-center mb-0">
            <img 
              src={mascotLogo} 
              alt="Rise Community Mascot" 
              width="500"
              height="500"
              loading="eager"
              fetchPriority="high"
              className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[500px] max-h-[55vh] h-auto object-contain"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 -mt-8 sm:-mt-12 md:-mt-16 text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight px-4 sm:px-6">
              <span className="text-white">Maior comunidade de</span>
              <br />
              <span className="text-[#FF0000]">Rateio & Networking do</span>
              <br />
              <span className="text-white">Brasil +20k cursos</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-[#d1d1d1] max-w-2xl mx-auto px-4 sm:px-6 leading-relaxed">
              Os maiores rateios de cursos do Brasil, com todo o conhecimento que você precisa — na palma da sua mão!
            </p>

            {/* CTA Button */}
            <div className="pt-3 sm:pt-4">
              <Button 
                size="lg"
                onClick={scrollToTopics}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base px-6 sm:px-10 py-5 sm:py-6 rounded-full shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Unlock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                EXPLORAR O ACERVO
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Topics Section */}
      <div id="topics-section">
        <ScrollingTopics />
      </div>

      {/* Bonus Section */}
      <BonusSection />

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* Members Counter */}
      <MembersCounter />

      {/* Guarantee Section */}
      <GuaranteeSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
