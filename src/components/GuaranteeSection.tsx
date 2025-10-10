import { Star } from "lucide-react";

const GuaranteeSection = () => {
  return (
    <section className="w-full py-8 md:py-10 px-4 md:px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-3">
        {/* Número Grande */}
        <div className="relative inline-block">
          <h2 className="text-8xl md:text-9xl lg:text-[160px] font-bold text-[#FF0000] tracking-tight leading-none">
            7
          </h2>
          {/* Efeito de brilho no número */}
          <div className="absolute inset-0 blur-3xl bg-[#FF0000]/25" />
        </div>
        
        {/* Estrelas */}
        <div className="flex justify-center gap-1 py-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className="w-5 h-5 md:w-6 md:h-6 fill-[#FF0000] text-[#FF0000]" 
            />
          ))}
        </div>
        
        {/* Texto de Garantia */}
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-bold tracking-wide">
            DIAS DE GARANTIA
          </h3>
          <p className="text-sm md:text-base text-[#d1d1d1] font-medium">
            NÃO GOSTOU? SEU DINHEIRO DE VOLTA.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
