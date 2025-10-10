import { Star } from "lucide-react";

const GuaranteeSection = () => {
  return (
    <section className="w-full py-8 md:py-10 px-4 md:px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Card Container */}
        <div className="rounded-3xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 md:p-12 text-center space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          {/* Badge com número 7 */}
          <div className="relative inline-block">
            <div className="relative bg-gradient-to-br from-[#FF0000] to-[#8B0000] rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(255,0,0,0.3)]">
              <h2 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-none">
                7
              </h2>
            </div>
          </div>
          
          {/* Texto: DIAS DE GARANTIA */}
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-bold tracking-wider">
              DIAS DE GARANTIA
            </h3>
          </div>
          
          {/* Estrelas */}
          <div className="flex justify-center gap-1 py-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-4 h-4 md:w-5 md:h-5 fill-[#FF0000] text-[#FF0000]" 
              />
            ))}
          </div>
          
          {/* Texto Principal */}
          <div className="space-y-4">
            <h4 className="text-xl md:text-2xl lg:text-3xl text-white font-bold leading-tight">
              Não gostou? A gente<br />devolve seu dinheiro.
            </h4>
            
            {/* Texto Explicativo */}
            <p className="text-sm md:text-base text-[#d1d1d1] leading-relaxed max-w-2xl mx-auto">
              Você tem 7 dias pra acessar tudo e decidir se vale a pena. Se não curtir por qualquer motivo, é só pedir e devolvemos 100% do valor. Sem perguntas. Sem estresse. Sem letra miúda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
