import { Star } from "lucide-react";

const GuaranteeSection = () => {
  return (
    <section className="w-full py-8 md:py-10 px-4 md:px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Card Container */}
        <div className="rounded-3xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 md:p-12 lg:p-16 text-center space-y-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          
          {/* Número 7 com design moderno */}
          <div className="relative inline-block">
            <div className="relative">
              <h2 className="text-8xl md:text-9xl lg:text-[140px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FF0000] to-[#FF6B6B] tracking-tight leading-none drop-shadow-[0_0_30px_rgba(255,0,0,0.5)]">
                7
              </h2>
            </div>
          </div>
          
          {/* Texto: DIAS DE GARANTIA com estrelas inline */}
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold tracking-wide">
              DIAS DE GARANTIA
            </h3>
            
            {/* Estrelas */}
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-5 h-5 md:w-6 md:h-6 fill-[#FF0000] text-[#FF0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]" 
                />
              ))}
            </div>
          </div>
          
          {/* Texto Principal */}
          <div className="space-y-5 pt-2">
            <h4 className="text-xl md:text-2xl lg:text-3xl text-white font-bold leading-tight">
              Não gostou? A gente devolve seu dinheiro.
            </h4>
            
            {/* Texto Explicativo */}
            <p className="text-sm md:text-base lg:text-lg text-[#d1d1d1] leading-relaxed max-w-2xl mx-auto">
              Você tem 7 dias pra acessar tudo e decidir se vale a pena. Se não curtir por qualquer motivo, é só pedir e devolvemos 100% do valor. Sem perguntas. Sem estresse. Sem letra miúda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
