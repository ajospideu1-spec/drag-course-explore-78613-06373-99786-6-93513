import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from "embla-carousel-autoplay";

const TestimonialsCarousel = () => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const testimonials = [
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/01-t-Yg2457Xobqh14GnV.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/02-t-AoP4NDQxREi2yzNe.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/03-t-AGBzvqVEoGSqV8M1.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/04-t-ALp2b8LZx3h0r24N.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/06-t-dJoPNlODwwhzln5l.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/08-t-mnl452EOJGF34ebk.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/09-t-AMqDp2w39rS1OzWa.png",
  ];

  // Preload progressivo das imagens em ordem de prioridade
  useEffect(() => {
    testimonials.forEach((url, index) => {
      setTimeout(() => {
        const img = new Image();
        img.src = url;
      }, index * 300); // 300ms de delay entre cada imagem
    });
  }, []);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section className="w-full py-6 md:py-8 px-4 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 md:mb-8 max-w-3xl mx-auto">
          O que <span className="neon-gradient">nossos membros</span>
          <br />
          estão falando
        </h2>

        {/* Carrossel Otimizado */}
        <Carousel
          opts={{
            align: "center",
            loop: true,
            dragFree: false,
            skipSnaps: false,
            containScroll: "trimSnaps",
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full mx-auto"
        >
          <CarouselContent className="-ml-0">
            {testimonials.map((image, index) => (
              <CarouselItem key={index} className="pl-0 basis-full">
                <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto rounded-xl overflow-hidden bg-transparent shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/[0.06] will-change-transform min-h-[400px] md:min-h-[500px] flex items-center justify-center">
                  {!loadedImages[index] && (
                    <Skeleton className="w-full h-[400px] md:h-[500px] rounded-xl" />
                  )}
                  <img
                    src={image}
                    alt={`Depoimento de membro satisfeito ${index + 1}`}
                    className={`w-full h-auto object-cover block rounded-xl select-none transition-opacity duration-300 ${
                      loadedImages[index] ? "opacity-100" : "opacity-0"
                    }`}
                    draggable={false}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                    decoding="async"
                    width={800}
                    height={500}
                    onLoad={() => handleImageLoad(index)}
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
