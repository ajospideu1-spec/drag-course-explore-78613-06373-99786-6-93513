import { useState, useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, X, type LucideIcon, 
  Code, LineChart, Palette, ShoppingBag, CheckCircle2, Briefcase, Building, Scale,
  Paintbrush, Film, Music, Globe, Database, Shield, Bot, Cloud, Laptop, Smartphone,
  Brain, Video, Camera, FileText, PenTool, Megaphone, Target, Share2, Users,
  BarChart3, DollarSign, Package, Rocket, Mail, Award, Store, Zap, Heart,
  Calculator, BookOpen, GraduationCap, Languages, ChefHat, Scissors, Wrench,
  Stethoscope, Dumbbell, Utensils, Leaf, Truck, Server, Network, Cpu, Eye,
  Flower2, Headphones, Home, Image, Lock, Mic, PieChart, Trophy, Tv, Wifi,
  Sparkles, Settings, Binary, Wallet, TestTube, Activity, Lightbulb, MessageCircle,
  Bitcoin, Plane, Handshake, Coins, Box, Layout, Layers, Coffee, Pizza, Wine,
  Play, Timer, Phone, Book, Waves, TreePine, Mountain, Sun, Apple, Car, Bike,
  Printer, Radio, Ruler, Drill, Hammer, Footprints, Glasses, Key, Map, Gem,
  ThumbsUp, Wind, CircleDot, Navigation, Component, Plug, Flag, Anchor, Calendar,
  Clock, ShoppingCart, Brush, Youtube, Crosshair, Droplets, Flame, Gauge, Star,
  Medal, RefreshCw, Building2, UserCheck, Accessibility, Ship, Volleyball,
  FlaskConical, CloudRain, Speaker, CircuitBoard, Fingerprint, Pickaxe, Cone,
  Factory, Beaker, BookMarked, Sword, Recycle, Gamepad2, Pencil
} from "lucide-react";

interface Topic {
  name: string;
  icon: LucideIcon;
}

const ScrollingTopics = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Lista completa de temas em ordem alfabética
  const allTopics: Topic[] = [
    { name: 'Administração', icon: Briefcase },
    { name: 'Administração de Empresas', icon: Building },
    { name: 'Administração Pública', icon: Building2 },
    { name: 'Adobe After Effects', icon: Film },
    { name: 'Adobe Illustrator', icon: Paintbrush },
    { name: 'Adobe Photoshop', icon: Image },
    { name: 'Adobe Premiere', icon: Video },
    { name: 'Agronegócio', icon: Leaf },
    { name: 'Alemão', icon: Languages },
    { name: 'Análise de Dados', icon: BarChart3 },
    { name: 'Análise de Dados Estatísticos', icon: PieChart },
    { name: 'Análise e Desenvolvimento de Sistemas', icon: Code },
    { name: 'Animais de Estimação', icon: Heart },
    { name: 'Animais e Pets', icon: Heart },
    { name: 'Aplicativos Mobile', icon: Smartphone },
    { name: 'Aromaterapia', icon: Flower2 },
    { name: 'Arquitetura', icon: Building },
    { name: 'Arquitetura de Software', icon: Code },
    { name: 'Arquitetura e Urbanismo', icon: Building2 },
    { name: 'Arte Digital', icon: Paintbrush },
    { name: 'Arte e Cultura', icon: Palette },
    { name: 'Artes Visuais', icon: Eye },
    { name: 'Assertividade', icon: Target },
    { name: 'Astrologia', icon: Sparkles },
    { name: 'Audiobooks', icon: Headphones },
    { name: 'Audiovisual', icon: Video },
    { name: 'Automação', icon: Settings },
    { name: 'Automação de Processos', icon: RefreshCw },
    { name: 'Automação Residencial', icon: Home },
    { name: 'Autoconhecimento', icon: Lightbulb },
    { name: 'Barbeiro', icon: Scissors },
    { name: 'Beleza e Estética', icon: Sparkles },
    { name: 'Bem-estar', icon: Heart },
    { name: 'Big Data', icon: Database },
    { name: 'Biomedicina', icon: Stethoscope },
    { name: 'Blockchain', icon: Bitcoin },
    { name: 'Branding', icon: Award },
    { name: 'Business Intelligence', icon: BarChart3 },
    { name: 'Cabeleireiro', icon: Scissors },
    { name: 'Caligrafia', icon: PenTool },
    { name: 'ChatGPT', icon: Bot },
    { name: 'Ciência de Dados', icon: Database },
    { name: 'Ciências Biológicas', icon: TestTube },
    { name: 'Ciências Contábeis', icon: Calculator },
    { name: 'Cinema', icon: Film },
    { name: 'Cloud Computing', icon: Cloud },
    { name: 'Coaching', icon: Users },
    { name: 'Coaching de Carreira', icon: Briefcase },
    { name: 'Cobrança e Recuperação de Crédito', icon: DollarSign },
    { name: 'Comércio Exterior', icon: Globe },
    { name: 'Comunicação', icon: Megaphone },
    { name: 'Comunicação Assertiva', icon: MessageCircle },
    { name: 'Comunicação Corporativa', icon: Briefcase },
    { name: 'Concursos Públicos', icon: BookOpen },
    { name: 'Confeitaria', icon: ChefHat },
    { name: 'Confeitaria Artística', icon: Sparkles },
    { name: 'Consultoria', icon: Briefcase },
    { name: 'Contabilidade', icon: Calculator },
    { name: 'Contabilidade Digital', icon: Laptop },
    { name: 'Copywriting', icon: PenTool },
    { name: 'Criação de Conteúdo', icon: FileText },
    { name: 'Criação de Documentários', icon: Video },
    { name: 'Criptomoedas', icon: Bitcoin },
    { name: 'CRM (Gestão de Relacionamento)', icon: Users },
    { name: 'CSS', icon: Code },
    { name: 'Culinária', icon: ChefHat },
    { name: 'Culinária Fit', icon: Utensils },
    { name: 'Culinária Vegana', icon: Leaf },
    { name: 'Cybersecurity', icon: Shield },
    { name: 'Dança', icon: Music },
    { name: 'Data Science', icon: Database },
    { name: 'Deep Learning', icon: Brain },
    { name: 'Design', icon: Palette },
    { name: 'Design de Interiores', icon: Home },
    { name: 'Design de Produto', icon: Box },
    { name: 'Design de Sobrancelhas', icon: Eye },
    { name: 'Design Gráfico', icon: Paintbrush },
    { name: 'Design Thinking', icon: Lightbulb },
    { name: 'Desenvolvimento de Aplicativos', icon: Smartphone },
    { name: 'Desenvolvimento de Jogos', icon: Gamepad2 },
    { name: 'Desenvolvimento de Pessoas', icon: Users },
    { name: 'Desenvolvimento Mobile', icon: Smartphone },
    { name: 'Desenvolvimento Organizacional', icon: Building },
    { name: 'Desenvolvimento Pessoal', icon: Lightbulb },
    { name: 'Desenvolvimento Web', icon: Code },
    { name: 'DevOps', icon: Server },
    { name: 'Direito', icon: Scale },
    { name: 'Direito Digital', icon: Laptop },
    { name: 'Direito do Trabalho', icon: Briefcase },
    { name: 'Direito Empresarial', icon: Building },
    { name: 'Direito Tributário', icon: Calculator },
    { name: 'Documentários', icon: Video },
    { name: 'Dropshipping', icon: Package },
    { name: 'E-commerce', icon: ShoppingBag },
    { name: 'Economia', icon: LineChart },
    { name: 'Edição de Áudio', icon: Headphones },
    { name: 'Edição de Vídeo', icon: Video },
    { name: 'Edição de Vídeos com IA', icon: Bot },
    { name: 'Educação Financeira', icon: DollarSign },
    { name: 'Educação Física', icon: Dumbbell },
    { name: 'Eletrônica', icon: Cpu },
    { name: 'Emagrecimento', icon: Heart },
    { name: 'Empreendedorismo', icon: Rocket },
    { name: 'Empreendedorismo Digital', icon: Laptop },
    { name: 'Empreendedorismo Feminino', icon: Users },
    { name: 'Enfermagem', icon: Stethoscope },
    { name: 'Engenharia', icon: Wrench },
    { name: 'Engenharia Civil', icon: Building },
    { name: 'Engenharia de Dados', icon: Database },
    { name: 'Engenharia de Produção', icon: Factory },
    { name: 'Engenharia de Software', icon: Code },
    { name: 'Espanhol', icon: Languages },
    { name: 'Espiritualidade', icon: Sparkles },
    { name: 'Estética Automotiva', icon: Car },
    { name: 'Estética Facial', icon: Sparkles },
    { name: 'Estratégia de Negócios', icon: Target },
    { name: 'Ética Profissional', icon: Scale },
    { name: 'Excel', icon: FileText },
    { name: 'Excel Avançado', icon: BarChart3 },
    { name: 'Extensão de Cílios', icon: Eye },
    { name: 'Facebook Ads', icon: Megaphone },
    { name: 'Farmácia', icon: Stethoscope },
    { name: 'Finanças', icon: DollarSign },
    { name: 'Finanças Corporativas', icon: Building },
    { name: 'Finanças Pessoais', icon: Wallet },
    { name: 'Fisioterapia', icon: Activity },
    { name: 'Fitness', icon: Dumbbell },
    { name: 'Fotografia', icon: Camera },
    { name: 'Fotografia de Produtos', icon: Package },
    { name: 'Fotografia Profissional', icon: Camera },
    { name: 'Francês', icon: Languages },
    { name: 'Freelancer', icon: Laptop },
    { name: 'Front-end', icon: Code },
    { name: 'Funil de Vendas', icon: Target },
    { name: 'Funil Gamificado', icon: Gamepad2 },
    { name: 'Gastronomia', icon: ChefHat },
    { name: 'Gemini (Google IA)', icon: Bot },
    { name: 'Gestão Ambiental', icon: Leaf },
    { name: 'Gestão Comercial', icon: Store },
    { name: 'Gestão de Conflitos', icon: Users },
    { name: 'Gestão de Equipes', icon: Users },
    { name: 'Gestão de Pessoas', icon: Users },
    { name: 'Gestão de Processos', icon: RefreshCw },
    { name: 'Gestão de Projetos', icon: CheckCircle2 },
    { name: 'Gestão de Redes Sociais', icon: Share2 },
    { name: 'Gestão de Talentos', icon: Award },
    { name: 'Gestão de Tempo', icon: Clock },
    { name: 'Gestão de Tráfego', icon: BarChart3 },
    { name: 'Gestão Empresarial', icon: Building },
    { name: 'Gestão Financeira', icon: Calculator },
    { name: 'Gestão Pública', icon: Building2 },
    { name: 'Git e GitHub', icon: Code },
    { name: 'Google Ads', icon: Megaphone },
    { name: 'Google Analytics', icon: BarChart3 },
    { name: 'Governança Corporativa', icon: Building },
    { name: 'Growth Hacking', icon: Rocket },
    { name: 'Hard Skills', icon: Award },
    { name: 'Harmonização Facial', icon: Sparkles },
    { name: 'Hipnose', icon: Brain },
    { name: 'Hobbies e Lazer', icon: Trophy },
    { name: 'HTML', icon: Code },
    { name: 'Idiomas', icon: Languages },
    { name: 'Ilustração Digital', icon: Paintbrush },
    { name: 'Imersão em IA', icon: Brain },
    { name: 'Importação', icon: Globe },
    { name: 'Inbound Marketing', icon: Megaphone },
    { name: 'Infoprodutos', icon: Package },
    { name: 'Informática', icon: Laptop },
    { name: 'Informática Básica', icon: Laptop },
    { name: 'Inglês', icon: Languages },
    { name: 'Inglês para Negócios', icon: Briefcase },
    { name: 'Instagram Marketing', icon: Camera },
    { name: 'Inteligência Artificial', icon: Brain },
    { name: 'Inteligência Artificial Generativa', icon: Bot },
    { name: 'Inteligência de Mercado', icon: BarChart3 },
    { name: 'Inteligência Emocional', icon: Heart },
    { name: 'Investimentos', icon: LineChart },
    { name: 'Investimentos em Ações', icon: LineChart },
    { name: 'Investimentos Imobiliários', icon: Home },
    { name: 'Italiano', icon: Languages },
    { name: 'Java', icon: Code },
    { name: 'JavaScript', icon: Code },
    { name: 'Jornalismo', icon: FileText },
    { name: 'Jornalismo Digital', icon: Globe },
    { name: 'Kotlin', icon: Code },
    { name: 'Landing Pages', icon: Layout },
    { name: 'Laravel', icon: Code },
    { name: 'Lashes (Cílios)', icon: Eye },
    { name: 'Leilões', icon: DollarSign },
    { name: 'Letras', icon: BookOpen },
    { name: 'Libras', icon: Handshake },
    { name: 'Liderança', icon: Users },
    { name: 'Liderança Estratégica', icon: Target },
    { name: 'Liderança Feminina', icon: Award },
    { name: 'LinkedIn', icon: Users },
    { name: 'Logística', icon: Truck },
    { name: 'Machine Learning', icon: Brain },
    { name: 'Manutenção de Celulares', icon: Smartphone },
    { name: 'Manutenção de Computadores', icon: Laptop },
    { name: 'Manutenção de Equipamentos', icon: Wrench },
    { name: 'Manutenção de Motos', icon: Bike },
    { name: 'Maquiagem', icon: Sparkles },
    { name: 'Maquiagem Artística', icon: Paintbrush },
    { name: 'Maquiagem Profissional', icon: Brush },
    { name: 'Marketing', icon: Megaphone },
    { name: 'Marketing de Afiliados', icon: Share2 },
    { name: 'Marketing de Conteúdo', icon: FileText },
    { name: 'Marketing de Influência', icon: Users },
    { name: 'Marketing Digital', icon: Laptop },
    { name: 'Marketing Pessoal', icon: Award },
    { name: 'Massoterapia', icon: Heart },
    { name: 'Matte Painting', icon: Paintbrush },
    { name: 'Mecânica', icon: Wrench },
    { name: 'Mecânica de Motos', icon: Bike },
    { name: 'Medicina', icon: Stethoscope },
    { name: 'Medicina Veterinária', icon: Heart },
    { name: 'Meditação', icon: Sparkles },
    { name: 'Mercado Financeiro', icon: LineChart },
    { name: 'Mercado Livre', icon: ShoppingBag },
    { name: 'Metodologias Ágeis', icon: Rocket },
    { name: 'Microblading', icon: Eye },
    { name: 'Micropigmentação', icon: Paintbrush },
    { name: 'Mindfulness', icon: Brain },
    { name: 'Mindset', icon: Lightbulb },
    { name: 'Moda', icon: Scissors },
    { name: 'Modelagem 3D', icon: Box },
    { name: 'Modelagem de Sobrancelhas', icon: Eye },
    { name: 'MongoDB', icon: Database },
    { name: 'Motion Design', icon: Film },
    { name: 'Motivação', icon: Rocket },
    { name: 'Música', icon: Music },
    { name: 'Musculação', icon: Dumbbell },
    { name: 'MySQL', icon: Database },
    { name: 'Negociação', icon: Handshake },
    { name: 'Negócios Digitais', icon: Laptop },
    { name: 'Negócios Online', icon: Globe },
    { name: 'Neuromarketing', icon: Brain },
    { name: 'Node.js', icon: Code },
    { name: 'Numerologia', icon: Calculator },
    { name: 'Nutrição', icon: Utensils },
    { name: 'Nutrição Esportiva', icon: Dumbbell },
    { name: 'Odontologia', icon: Stethoscope },
    { name: 'Oratória', icon: Mic },
    { name: 'Organização Pessoal', icon: CheckCircle2 },
    { name: 'Pedagogia', icon: GraduationCap },
    { name: 'Pilates', icon: Activity },
    { name: 'Pinterest Marketing', icon: Image },
    { name: 'PNL (Programação Neurolinguística)', icon: Brain },
    { name: 'Podcast', icon: Mic },
    { name: 'Podologia', icon: Heart },
    { name: 'Power BI', icon: BarChart3 },
    { name: 'PowerPoint', icon: FileText },
    { name: 'Produção de Conteúdo', icon: FileText },
    { name: 'Produção Musical', icon: Music },
    { name: 'Produtividade', icon: CheckCircle2 },
    { name: 'Product Management', icon: Box },
    { name: 'Programação', icon: Code },
    { name: 'Programação em C', icon: Code },
    { name: 'Programação em Python', icon: Code },
    { name: 'Programação para Crianças', icon: Gamepad2 },
    { name: 'Prompt Engineering', icon: Bot },
    { name: 'Psicologia', icon: Brain },
    { name: 'Psicologia Positiva', icon: Heart },
    { name: 'Python', icon: Code },
    { name: 'Python para Data Science', icon: Database },
    { name: 'React', icon: Code },
    { name: 'React Native', icon: Smartphone },
    { name: 'Redes de Computadores', icon: Network },
    { name: 'Redes Sociais', icon: Share2 },
    { name: 'Relacionamentos', icon: Heart },
    { name: 'Remuneração e Benefícios', icon: DollarSign },
    { name: 'Resolução de Conflitos', icon: Users },
    { name: 'Recursos Humanos', icon: Users },
    { name: 'Retenção de Clientes', icon: Users },
    { name: 'Robótica', icon: Bot },
    { name: 'Ruby', icon: Code },
    { name: 'Saúde e Bem-estar', icon: Heart },
    { name: 'Saúde Mental', icon: Brain },
    { name: 'Scrum', icon: Rocket },
    { name: 'Segurança da Informação', icon: Shield },
    { name: 'SEO', icon: Megaphone },
    { name: 'Shopify', icon: Store },
    { name: 'Soft Skills', icon: Users },
    { name: 'SQL', icon: Database },
    { name: 'Streaming', icon: Video },
    { name: 'Sustentabilidade', icon: Leaf },
    { name: 'Swift', icon: Code },
    { name: 'Tableau', icon: BarChart3 },
    { name: 'Tarot', icon: Sparkles },
    { name: 'Teatro', icon: Music },
    { name: 'Tecnologia', icon: Laptop },
    { name: 'Terapias Alternativas', icon: Heart },
    { name: 'TikTok Marketing', icon: Video },
    { name: 'Trabalho em Equipe', icon: Users },
    { name: 'Tráfego Orgânico', icon: Megaphone },
    { name: 'Tráfego Pago', icon: DollarSign },
    { name: 'Turismo', icon: Plane },
    { name: 'TypeScript', icon: Code },
    { name: 'UI/UX Design', icon: Layout },
    { name: 'Unhas e Manicure', icon: Sparkles },
    { name: 'Unhas Artísticas', icon: Paintbrush },
    { name: 'Vendas', icon: DollarSign },
    { name: 'Vendas B2B', icon: Building },
    { name: 'Vendas Consultivas', icon: Users },
    { name: 'Vendas Online', icon: ShoppingBag },
    { name: 'Videomaking', icon: Video },
    { name: 'Visão Estratégica', icon: Target },
    { name: 'Vue.js', icon: Code },
    { name: 'Web Design', icon: Layout },
    { name: 'Webflow', icon: Code },
    { name: 'WhatsApp Business', icon: MessageCircle },
    { name: 'WordPress', icon: Globe },
    { name: 'Yoga', icon: Activity },
    { name: 'YouTube', icon: Youtube },
    { name: 'YouTube Ads', icon: Video },
    { name: 'Zootecnia', icon: Heart },
  ];

  // Filtrar temas baseado na busca
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTopics;
    }
    
    const query = searchQuery.toLowerCase();
    return allTopics.filter(topic => 
      topic.name.toLowerCase().includes(query)
    );
  }, [searchQuery, allTopics]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section 
      id="topics-section" 
      className="w-full py-12 md:py-16 px-4 bg-background relative overflow-hidden"
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF0000]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Cabeçalho */}
        <div className="text-center mb-10 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Todos os Temas
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Explore nossa vasta coleção de {allTopics.length} temas organizados alfabeticamente
          </p>
        </div>

        {/* Barra de Busca */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500 focus:border-[#FF0000] focus:ring-[#FF0000]"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Contador de resultados */}
          {searchQuery && (
            <div className="mt-3 text-center text-sm text-gray-400">
              {filteredTopics.length === 0 
                ? "Nenhum tema encontrado" 
                : `${filteredTopics.length} tema${filteredTopics.length !== 1 ? 's' : ''} encontrado${filteredTopics.length !== 1 ? 's' : ''}`
              }
            </div>
          )}
        </div>

        {/* Grid de Temas */}
        <ScrollArea className="w-full h-[600px] rounded-lg border border-[#333] bg-[#0d0d0d]/50 backdrop-blur-sm">
          <div className="p-6">
            {filteredTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Search className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">Tente buscar por outro termo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredTopics.map((topic, index) => {
                  const Icon = topic.icon;
                  return (
                    <div
                      key={index}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-[#FF0000] hover:bg-[#1a1a1a]/80 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-md bg-[#FF0000]/10 flex items-center justify-center group-hover:bg-[#FF0000]/20 transition-colors">
                        <Icon className="w-5 h-5 text-[#FF0000]" />
                      </div>
                      <span className="text-sm text-white font-medium truncate">
                        {topic.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default ScrollingTopics;
