import pricingImage from "@/assets/pricing/main-card.png";
import ctaImage from "@/assets/pricing/cta-button.png";

const PricingSection = () => {
  return (
    <section className="w-full py-6 md:py-10 px-0 bg-background">
      <div className="w-full max-w-none mx-auto">
        {/* Container da imagem com botão posicionado */}
        <div className="relative w-full">
          <img
            src={pricingImage}
            alt="Rise Community - Preço"
            className="w-full h-auto block"
            loading="lazy"
            decoding="async"
          />

          {/* Botão como imagem posicionado exatamente no espaço da arte */}
          <div className="absolute left-[10.5%] right-[10.5%] bottom-[9%] h-[12.5%]">
            <img
              src={ctaImage}
              alt="Botão Comprar agora - Rise Community"
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
