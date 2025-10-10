import { Users, Bot, Search as SearchIcon, Package } from "lucide-react";

const BonusSection = () => {
  const bonuses = [
    {
      icon: Package,
      title: "Fornecedores de Rateio",
      description: "Após anos guardando a 7 chaves, liberamos acesso aos principais fornecedores utilizados atualmente pela comunidade.",
      originalPrice: "R$ 67,00"
    },
    {
      icon: SearchIcon,
      title: "Puxador de Dados Vitalício",
      description: "Tenha acesso ao nosso Puxador de Dados exclusivo da Rise Community, funcionando 24/7, com puxadas ilimitadas e acesso vitalício garantido.",
      originalPrice: "R$ 97,00"
    },
    {
      icon: Bot,
      title: "Agentes de IA Exclusivos",
      description: "Ferramentas inteligentes criadas para turbinar seus estudos, negócios e automações.",
      originalPrice: "R$ 197,00"
    },
    {
      icon: Users,
      title: "Grupos de Networking no WhatsApp",
      description: "Acesso a grupos ativos com membros que compartilham estratégias, conteúdo, oportunidades e bastidores do digital.",
      originalPrice: "R$ 97,00"
    }
  ];

  return (
    <section className="w-full py-6 md:py-8 px-4 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <div className="text-center mb-6 md:mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Bônus exclusivos da <span className="text-primary">Rise Community</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Só esses diferenciais já valeriam o investimento, mas você leva tudo incluso no acesso vitalício.
          </p>
        </div>

        {/* Grid de Bônus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {bonuses.map((bonus, index) => {
            const Icon = bonus.icon;
            return (
              <div
                key={index}
                className="group relative bg-card p-4 md:p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
              >
                {/* Icon */}
                <div className="flex items-start gap-3 mb-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF0000]/10 flex-shrink-0 group-hover:bg-[#FF0000]/20 transition-colors">
                    <Icon className="w-4 h-4 text-[#FF0000]" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-foreground flex-1 leading-tight pt-0.5">
                    {bonus.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4">
                  {bonus.description}
                </p>

                {/* Price and Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#999999] mr-0.5">De</span>
                  <span className="text-sm md:text-base font-medium text-[#666666] line-through">
                    {bonus.originalPrice}
                  </span>
                  <span className="bg-[#00FF00] text-black px-2 py-1 md:px-2.5 md:py-1 rounded text-[10px] md:text-[11px] font-bold uppercase tracking-wide whitespace-nowrap">
                    NESSA OFERTA: GRÁTIS
                  </span>
                </div>

                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BonusSection;
