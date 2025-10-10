const MembersCounter = () => {
  return (
    <section className="w-full py-6 md:py-8 px-4 md:px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        {/* Título */}
        <h2 className="text-xl md:text-2xl text-white font-normal">
          Contagem de membros...
        </h2>
        
        {/* Número Principal */}
        <div className="relative inline-block">
          <h3 className="text-7xl md:text-8xl lg:text-9xl font-bold text-[#FF0000] tracking-tight leading-none">
            3,965
          </h3>
          {/* Efeito de brilho no número */}
          <div className="absolute inset-0 blur-3xl bg-[#FF0000]/25" />
        </div>
      </div>
    </section>
  );
};

export default MembersCounter;