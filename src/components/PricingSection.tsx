import { Clock, Users, Headphones, UserCircle, Network, Server, Send, Bot } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="w-full py-6 md:py-10 px-4 bg-background">
      <div 
        className="max-w-[460px] mx-auto rounded-[18px] p-6 sm:p-9 text-center"
        style={{
          background: '#0d0d0d',
          boxShadow: '0 0 26px rgba(255, 0, 0, 0.25)',
          fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
        }}
      >
        {/* Título Principal */}
        <h2 className="text-[1.45rem] sm:text-[1.85rem] font-extrabold text-white mb-7 tracking-wide uppercase">
          Tudo isso está incluso no seu acesso
        </h2>

        {/* Lista de Benefícios Principais */}
        <ul className="list-none p-0 text-left mb-8 space-y-3.5">
          <li className="flex items-start text-[0.98rem] leading-relaxed">
            <Clock className="w-5 h-5 flex-shrink-0 mr-2.5 mt-0.5" style={{ color: '#ff2b2b' }} />
            <span className="text-white">Atualizações semanais com novos conteúdos e ferramentas</span>
          </li>

          <li className="flex items-start text-[0.98rem] leading-relaxed">
            <Users className="w-5 h-5 flex-shrink-0 mr-2.5 mt-0.5" style={{ color: '#ff2b2b' }} />
            <span className="text-white">Comunidade fechada no Discord e Telegram (com canais organizados por tema)</span>
          </li>

          <li className="flex items-start text-[0.98rem] leading-relaxed">
            <Headphones className="w-5 h-5 flex-shrink-0 mr-2.5 mt-0.5" style={{ color: '#ff2b2b' }} />
            <span className="text-white">Suporte direto da equipe em caso de dúvidas</span>
          </li>

          <li className="flex items-start text-[0.98rem] leading-relaxed">
            <UserCircle className="w-5 h-5 flex-shrink-0 mr-2.5 mt-0.5" style={{ color: '#ff2b2b' }} />
            <span className="text-white">Acesso liberado à afiliação da comunidade</span>
          </li>

          <li className="flex items-start text-[0.98rem] leading-relaxed">
            <Network className="w-5 h-5 flex-shrink-0 mr-2.5 mt-0.5" style={{ color: '#ff2b2b' }} />
            <span className="text-white">Grupos de Networking no WhatsApp com membros ativos</span>
          </li>
        </ul>

        {/* Seção de Bônus */}
        <h3 
          className="text-[1.15rem] font-bold text-left mb-4 text-white pt-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          Bônus:
        </h3>

        <ul className="list-none p-0 text-left mb-9 space-y-3">
          <li className="flex items-start text-[0.97rem] leading-relaxed">
            <Server className="w-5 h-5 flex-shrink-0 mr-2.5 mt-0.5" style={{ color: '#ff2b2b' }} />
            <span className="text-white">Fornecedores de rateio</span>
          </li>

          <li className="flex items-start text-[0.97rem] leading-relaxed">
            <Send className="w-5 h-5 flex-shrink-0 mr-2.5 mt-0.5" style={{ color: '#ff2b2b' }} />
            <span className="text-white">Consultar dados via Telegram</span>
          </li>

          <li className="flex items-start text-[0.97rem] leading-relaxed">
            <Bot className="w-5 h-5 flex-shrink-0 mr-2.5 mt-0.5" style={{ color: '#ff2b2b' }} />
            <span className="text-white">Agentes de IA Exclusivos</span>
          </li>
        </ul>

        {/* Card de Preço */}
        <div 
          className="rounded-xl p-5 mb-6"
          style={{ background: '#1a1a1a' }}
        >
          <p className="text-[#ccc] m-0 text-[0.95rem]">POR APENAS 4X DE</p>
          <h3 className="text-[2.05rem] sm:text-[2.45rem] font-bold m-2" style={{ color: '#ff2b2b' }}>
            R$5,77
          </h3>
          <p className="text-[#ccc] m-0 text-[0.95rem]">OU R$19,90 À VISTA</p>
        </div>

        {/* Botão CTA */}
        <a 
          href="#comprar"
          className="inline-block font-bold px-7 sm:px-9 py-3 sm:py-4 rounded-[10px] text-white no-underline text-[1.05rem] sm:text-[1.18rem] transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: '#ff2b2b',
            boxShadow: '0 8px 18px rgba(255, 0, 0, 0.35)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 22px rgba(255,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 18px rgba(255, 0, 0, 0.35)';
          }}
        >
          COMEÇAR AGORA
        </a>
      </div>
    </section>
  );
};

export default PricingSection;
