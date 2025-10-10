import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import depoimento1 from "@/assets/testimonials/depoimento-1.png";
import depoimento2 from "@/assets/testimonials/depoimento-2.png";
import depoimento3 from "@/assets/testimonials/depoimento-3.png";
import depoimento4 from "@/assets/testimonials/depoimento-4.png";
import depoimento5 from "@/assets/testimonials/depoimento-5.png";
import depoimento6 from "@/assets/testimonials/depoimento-6.png";
import depoimento7 from "@/assets/testimonials/depoimento-7.png";

const TestimonialsCarousel = () => {
  const testimonials = [
    depoimento1,
    depoimento2,
    depoimento3,
    depoimento4,
    depoimento5,
    depoimento6,
    depoimento7,
  ];

  return (
    <section className="w-full py-6 md:py-8 px-4 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 md:mb-8 max-w-3xl mx-auto">
          O que <span className="neon-gradient">nossos membros</span>
          <br />
          estão falando
        </h2>

        {/* Carrossel */}
        <Carousel
          opts={{
            align: "center",
            loop: true,
            dragFree: false,
          }}
          plugins={[
            Autoplay({
              delay: 2400,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
          className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((image, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
                <div className="w-full aspect-[9/16] rounded-xl overflow-hidden bg-transparent shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/[0.06]">
                  <img
                    src={image}
                    alt={`Depoimento ${index + 1}`}
                    className="w-full h-full object-contain block rounded-xl select-none"
                    draggable={false}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <style>{`
        .neon-gradient {
          background: linear-gradient(90deg, #ffffff 0%, #FF0000 25%, #ffae00 50%, #ffffff 75%, #FF0000 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: sweep 6s linear infinite;
        }
        
        @keyframes sweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;
