import { Button } from "@/components/ui/button";
import pricingImage from "@/assets/pricing-card.png";

const PricingSection = () => {
  return (
    <section className="w-full py-6 md:py-10 px-3 md:px-4 bg-background">
      <div className="max-w-[620px] md:max-w-[680px] mx-auto">
        {/* Container da imagem com botão posicionado */}
        <div className="relative w-full">
          <img
            src={pricingImage}
            alt="Rise Community - Preço"
            className="w-full h-auto block"
            loading="lazy"
            decoding="async"
          />

          {/* Botão posicionado exatamente no espaço da arte */}
          <div className="absolute left-[17.5%] right-[17.5%] bottom-[11%] h-[9.5%]">
            <Button
              className="w-full h-full bg-gradient-to-b from-[#ff2a2a] to-[#c90f0f] text-white text-sm md:text-base font-bold rounded-[12px] shadow-[0_6px_28px_rgba(255,0,0,0.45)]"
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
