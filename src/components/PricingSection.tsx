import { Button } from "@/components/ui/button";
import pricingImage from "@/assets/pricing-card.png";

const PricingSection = () => {
  return (
    <section className="w-full py-8 md:py-12 px-4 bg-background">
      <div className="max-w-md mx-auto">
        {/* Container da imagem com botão posicionado */}
        <div className="relative w-full">
          <img 
            src={pricingImage} 
            alt="Rise Community - Preço" 
            className="w-full h-auto block"
          />
          
          {/* Botão posicionado no espaço reservado da imagem */}
          <div className="absolute bottom-[3.5%] left-[11%] right-[11%]">
            <Button 
              className="w-full h-[58px] bg-gradient-to-b from-[#FF0000] to-[#CC0000] hover:from-[#FF0000]/90 hover:to-[#CC0000]/90 text-white text-lg md:text-xl font-bold rounded-xl shadow-[0_4px_20px_rgba(255,0,0,0.4)] transition-all duration-300 hover:shadow-[0_6px_30px_rgba(255,0,0,0.6)] hover:scale-[1.02]"
            >
              Comprar agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
