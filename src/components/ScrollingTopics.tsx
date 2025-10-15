import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, X, TrendingUp, CheckCircle2, Flame, Sparkles, type LucideIcon, 
  Megaphone, Target, PenTool, Share2, Rocket, Search as SearchIcon, 
  Mail, FileText, TrendingUpIcon, Zap, Award, Users, BarChart3, DollarSign, 
  Store, Package, FileStack, ShoppingBag, Video, Globe, Code, Smartphone, 
  Brain, Database, Gamepad2, Bot, Shield, Server, Cloud, Layers, Palette, 
  Film, Sparkle, Layout, Camera, Music, Pencil, Box, Coins, 
  Bitcoin, LineChart, Plane, Calculator, Heart, MessageCircle, BookOpen, 
  UserCircle, Handshake, GraduationCap, PenLine, Lightbulb, Languages, 
  ChefHat, Guitar, Scissors, Hammer, Wrench, Briefcase, Scale, Stethoscope,
  Dumbbell, Utensils, Leaf, Building, Truck, Factory, Activity, 
  Beaker, BookMarked, Cpu, Drill, Eye, Flower2, Footprints, Glasses,
  Headphones, Home, Image, Key, Laptop, Lock, Map as MapIcon, Mic, Paintbrush,
  PieChart, Printer, Radio, Ruler, ShieldCheck, Sparkles as Stars,
  TestTube, ThumbsUp, TreePine, Trophy, Tv, Wifi, Wind, Zap as Energy, Droplets,
  Pickaxe, Sun, Mountain, BookOpenCheck, FileCheck, Flag, Settings, Anchor, Calendar,
  Sword, CircleDot, Navigation, Component, Wallet, Binary, ScanLine, Plug, Gem,
  GraduationCap as Cap, Waves, FlaskConical, Bike, Pizza, Coffee, Paintbrush2,
  CloudRain, Globe2, Speaker, CircuitBoard, Sparkles as Magic, CheckCircle, Hand, Fingerprint,
  Radio as RadioIcon, Zap as Electric, Mountain as Climb, TestTube as Test, Gamepad2 as Game, Recycle, 
  FileText as Document, Network, Wifi as WifiIcon, ServerCog, Flame as Fire, Eye as Vision, Users2, Droplet, Wrench as Tool,
  Image as ImageIcon, Sparkle as Star, Medal, Bot as RobotIcon, PieChart as Chart, Cone, Palette as Paint,
  RefreshCw, Footprints as Foot, Building2, Leaf as Plant, UserCheck, Gauge as Speed, Briefcase as Case,
  Apple, Clock, ShoppingCart, Wine, Play, Timer, Phone, BookText, Accessibility, Volleyball, Ship,
  Brush, Youtube, Crosshair, FlaskRound, Droplets as Water, Car } from "lucide-react";

interface Topic {
  name: string;
  tags: string[];
  trending: boolean;
  icon: LucideIcon;
  category: string;
}

const ScrollingTopics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(50); // Inicialmente mostra 50 itens
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef(Date.now());

  // Estrutura de dados com tags, ícones e categorias em ordem alfabética
  const allTopics: Topic[] = [
    // Destaques (macro categorias)
    { name: 'Programação e Desenvolvimento de Tecnologia', tags: ['programação', 'desenvolvimento', 'tecnologia', 'ti'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Finanças e Investimentos', tags: ['finanças', 'investimentos', 'dinheiro', 'mercado'], trending: true, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Design e Criação de Conteúdo', tags: ['design', 'criação de conteúdo', 'conteúdo', 'criatividade'], trending: true, icon: Palette, category: 'Design e Criação' },
    { name: 'E-commerce e Dropshipping', tags: ['e-commerce', 'dropshipping', 'loja online', 'vendas'], trending: true, icon: ShoppingBag, category: 'Marketing Digital e Vendas' },
    { name: 'Desenvolvimento Pessoal e Produtividade', tags: ['desenvolvimento pessoal', 'produtividade', 'hábitos', 'organização'], trending: true, icon: CheckCircle2, category: 'Desenvolvimento Pessoal' },
    // A
    { name: 'Acessibilidade Digital (WCAG)', tags: ['acessibilidade', 'wcag', 'web', 'inclusão'], trending: false, icon: Eye, category: 'Programação e Tecnologia' },
    { name: 'Acessibilidade Web', tags: ['acessibilidade', 'web', 'inclusão', 'a11y'], trending: false, icon: Eye, category: 'Programação e Tecnologia' },
    { name: 'Aconselhamento Cristão', tags: ['aconselhamento', 'cristão', 'igreja', 'terapia'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Acionamentos Elétricos', tags: ['acionamentos', 'elétricos', 'motores', 'energia'], trending: false, icon: Zap, category: 'Engenharia' },
    { name: 'Acupuntura (Princípios)', tags: ['acupuntura', 'terapia', 'saúde', 'medicina'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    { name: 'Acampamento', tags: ['acampamento', 'camping', 'outdoor', 'aventura'], trending: false, icon: TreePine, category: 'Hobbies e Esportes' },
    { name: 'Adestramento de Cães', tags: ['adestramento', 'cães', 'cachorro', 'pets'], trending: false, icon: Heart, category: 'Hobbies e Animais' },
    { name: 'Administração de Banco de Dados', tags: ['administração', 'banco', 'dados', 'dba'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Administração de Redes', tags: ['administração', 'redes', 'network', 'ti'], trending: false, icon: Wifi, category: 'Programação e Tecnologia' },
    { name: 'Administração de Servidores', tags: ['administração', 'servidores', 'server', 'ti'], trending: false, icon: Server, category: 'Programação e Tecnologia' },
    { name: 'Advocacia Extrajudicial', tags: ['advocacia', 'extrajudicial', 'direito', 'justiça'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Aerografia', tags: ['aerografia', 'pintura', 'arte', 'spray'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Afiação de Facas e Ferramentas', tags: ['afiação', 'facas', 'ferramentas', 'amolador'], trending: false, icon: Wrench, category: 'Habilidades Manuais' },
    { name: 'Afiliado Árbitro', tags: ['afiliado', 'árbitro', 'marketing', 'vendas'], trending: false, icon: DollarSign, category: 'Marketing Digital e Vendas' },
    { name: 'Afiliado Autoridade', tags: ['afiliado', 'autoridade', 'marketing', 'vendas'], trending: false, icon: Award, category: 'Marketing Digital e Vendas' },
    { name: 'Afiliado de Infoprodutos', tags: ['afiliado', 'infoprodutos', 'marketing', 'vendas'], trending: false, icon: Package, category: 'Marketing Digital e Vendas' },
    { name: 'Afiliado de Produtos Físicos', tags: ['afiliado', 'produtos', 'físicos', 'vendas'], trending: false, icon: ShoppingBag, category: 'Marketing Digital e Vendas' },
    { name: 'Agente de Viagens', tags: ['agente', 'viagens', 'turismo', 'travel'], trending: false, icon: Plane, category: 'Turismo e Hotelaria' },
    { name: 'Agilidade Emocional', tags: ['agilidade', 'emocional', 'inteligência', 'emoções'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Agility para Cães', tags: ['agility', 'cães', 'esporte', 'pets'], trending: false, icon: Trophy, category: 'Hobbies e Animais' },
    { name: 'Agricultura de Precisão', tags: ['agricultura', 'precisão', 'tecnologia', 'agro'], trending: false, icon: Leaf, category: 'Agricultura e Meio Ambiente' },
    { name: 'Agricultura Orgânica', tags: ['agricultura', 'orgânica', 'sustentável', 'agro'], trending: false, icon: Leaf, category: 'Agricultura e Meio Ambiente' },
    { name: 'Agrofloresta', tags: ['agrofloresta', 'agroecologia', 'sustentável', 'agro'], trending: false, icon: TreePine, category: 'Agricultura e Meio Ambiente' },
    { name: 'Agronegócio', tags: ['agronegócio', 'agricultura', 'pecuária', 'negócios'], trending: false, icon: Briefcase, category: 'Agricultura e Meio Ambiente' },
    { name: 'Ajustes e Consertos de Roupas', tags: ['ajustes', 'consertos', 'roupas', 'costura'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Alemão', tags: ['alemão', 'idioma', 'língua', 'german'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Alfabetização Lúdica', tags: ['alfabetização', 'lúdica', 'educação', 'infantil'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Alfaiataria', tags: ['alfaiataria', 'costura', 'roupas', 'moda'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Álgebra Linear para Machine Learning', tags: ['álgebra', 'linear', 'machine learning', 'ia'], trending: false, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Algoritmos e Estruturas de Dados', tags: ['algoritmos', 'estruturas', 'dados', 'programação'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Alimentação Natural para Pets', tags: ['alimentação', 'natural', 'pets', 'animais'], trending: false, icon: Heart, category: 'Hobbies e Animais' },
    { name: 'Alquimia', tags: ['alquimia', 'esoterismo', 'mística', 'filosofia'], trending: false, icon: Beaker, category: 'Espiritualidade' },
    { name: 'Alongamento e Flexibilidade', tags: ['alongamento', 'flexibilidade', 'exercício', 'fitness'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Amamentação', tags: ['amamentação', 'bebê', 'maternidade', 'saúde'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Amigurumi', tags: ['amigurumi', 'crochê', 'artesanato', 'brinquedos'], trending: false, icon: Heart, category: 'Arte e Artesanato' },
    { name: 'Análise de Balanços', tags: ['análise', 'balanços', 'contabilidade', 'finanças'], trending: false, icon: PieChart, category: 'Finanças e Investimentos' },
    { name: 'Análise de Crédito', tags: ['análise', 'crédito', 'finanças', 'banco'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Análise de Dados com Google Data Studio', tags: ['análise', 'dados', 'google', 'data studio'], trending: false, icon: BarChart3, category: 'Marketing Digital e Vendas' },
    { name: 'Análise de Dados com Python', tags: ['análise', 'dados', 'python', 'programação'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Análise de Demonstrativos Financeiros', tags: ['análise', 'demonstrativos', 'financeiros', 'contabilidade'], trending: false, icon: PieChart, category: 'Finanças e Investimentos' },
    { name: 'Análise de Elementos Finitos (FEA)', tags: ['análise', 'elementos', 'finitos', 'engenharia'], trending: false, icon: Cpu, category: 'Engenharia' },
    { name: 'Análise de Falhas', tags: ['análise', 'falhas', 'manutenção', 'engenharia'], trending: false, icon: ShieldCheck, category: 'Engenharia' },
    { name: 'Análise de Métricas de Anúncios', tags: ['análise', 'métricas', 'anúncios', 'marketing'], trending: false, icon: BarChart3, category: 'Marketing Digital e Vendas' },
    { name: 'Análise de Métricas e KPIs', tags: ['análise', 'métricas', 'kpis', 'dados'], trending: false, icon: BarChart3, category: 'Marketing Digital e Vendas' },
    { name: 'Análise de Risco Político', tags: ['análise', 'risco', 'político', 'geopolítica'], trending: false, icon: Scale, category: 'Política e Sociedade' },
    { name: 'Análise de Sentimentos com IA', tags: ['análise', 'sentimentos', 'ia', 'nlp'], trending: false, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Análise de Sistemas', tags: ['análise', 'sistemas', 'desenvolvimento', 'ti'], trending: false, icon: Laptop, category: 'Programação e Tecnologia' },
    { name: 'Análise de Viabilidade de Projetos', tags: ['análise', 'viabilidade', 'projetos', 'negócios'], trending: false, icon: PieChart, category: 'Negócios e Empreendedorismo' },
    { name: 'Análise Espacial', tags: ['análise', 'espacial', 'gis', 'geografia'], trending: false, icon: MapIcon, category: 'Ciências e Geografia' },
    { name: 'Análise Fílmica', tags: ['análise', 'fílmica', 'cinema', 'filme'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'Análise Fundamentalista', tags: ['análise', 'fundamentalista', 'ações', 'investimentos'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Análise Heurística', tags: ['análise', 'heurística', 'ux', 'usabilidade'], trending: false, icon: Eye, category: 'Design e Criação' },
    { name: 'Análise Preditiva', tags: ['análise', 'preditiva', 'dados', 'ia'], trending: false, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Análise Swot', tags: ['análise', 'swot', 'estratégia', 'negócios'], trending: false, icon: Target, category: 'Negócios e Empreendedorismo' },
    { name: 'Análise Técnica (Grafista)', tags: ['análise', 'técnica', 'grafista', 'trading'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Análise Transacional', tags: ['análise', 'transacional', 'psicologia', 'comportamento'], trending: false, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Anatomia Humana', tags: ['anatomia', 'humana', 'saúde', 'medicina'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Andragogia (Ensino para Adultos)', tags: ['andragogia', 'ensino', 'adultos', 'educação'], trending: false, icon: GraduationCap, category: 'Educação' },
    { name: 'Angelologia', tags: ['angelologia', 'anjos', 'teologia', 'religião'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Angular', tags: ['angular', 'framework', 'javascript', 'programação'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Animação 2D', tags: ['animação', '2d', 'desenho', 'design'], trending: false, icon: Film, category: 'Design e Criação' },
    { name: 'Animação 3D', tags: ['animação', '3d', 'modelagem', 'design'], trending: false, icon: Box, category: 'Design e Criação' },
    { name: 'Animação de Interfaces com Lottie', tags: ['animação', 'interfaces', 'lottie', 'ux'], trending: false, icon: Sparkle, category: 'Design e Criação' },
    { name: 'Animação de Logos', tags: ['animação', 'logos', 'motion', 'design'], trending: false, icon: Sparkle, category: 'Design e Criação' },
    { name: 'Animação e Motion Graphics', tags: ['animação', 'motion', 'graphics', 'design'], trending: false, icon: Film, category: 'Design e Criação' },
    { name: 'Animações Whiteboard', tags: ['animações', 'whiteboard', 'vídeo', 'explicativo'], trending: false, icon: Pencil, category: 'Design e Criação' },
    { name: 'Antropologia', tags: ['antropologia', 'ciências', 'sociais', 'cultura'], trending: false, icon: Users, category: 'Ciências Humanas' },
    { name: 'Anúncios no Spotify', tags: ['anúncios', 'spotify', 'marketing', 'ads'], trending: false, icon: Music, category: 'Marketing Digital e Vendas' },
    { name: 'Anúncios no Waze', tags: ['anúncios', 'waze', 'marketing', 'ads'], trending: false, icon: MapIcon, category: 'Marketing Digital e Vendas' },
    { name: 'Apache Spark', tags: ['apache', 'spark', 'big data', 'programação'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Apicultura', tags: ['apicultura', 'abelhas', 'mel', 'agro'], trending: false, icon: Flower2, category: 'Agricultura e Meio Ambiente' },
    { name: 'Apologética Cristã', tags: ['apologética', 'cristã', 'teologia', 'religião'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Apometria', tags: ['apometria', 'espiritualidade', 'terapia', 'energia'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Apresentador de TV e WebTV', tags: ['apresentador', 'tv', 'webtv', 'comunicação'], trending: false, icon: Tv, category: 'Comunicação e Mídia' },
    { name: 'Aquarela', tags: ['aquarela', 'pintura', 'arte', 'desenho'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Aquarismo', tags: ['aquarismo', 'aquário', 'peixes', 'pets'], trending: false, icon: Droplets, category: 'Hobbies e Animais' },
    { name: 'Aquapaisagismo', tags: ['aquapaisagismo', 'aquário', 'decoração', 'design'], trending: false, icon: Flower2, category: 'Hobbies e Animais' },
    { name: 'Arbitragem', tags: ['arbitragem', 'direito', 'mediação', 'justiça'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Arduino', tags: ['arduino', 'eletrônica', 'programação', 'iot'], trending: false, icon: Cpu, category: 'Programação e Tecnologia' },
    { name: 'Arquitetura da Informação para Sites', tags: ['arquitetura', 'informação', 'sites', 'ux'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Arquitetura de Conversas (Chatbots)', tags: ['arquitetura', 'conversas', 'chatbots', 'ia'], trending: false, icon: Bot, category: 'Programação e Tecnologia' },
    { name: 'Arquitetura de Software', tags: ['arquitetura', 'software', 'desenvolvimento', 'ti'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Arquivamento de Documentos', tags: ['arquivamento', 'documentos', 'organização', 'gestão'], trending: false, icon: FileText, category: 'Administração' },
    { name: 'Arranjos Florais (Ikebana)', tags: ['arranjos', 'florais', 'ikebana', 'flores'], trending: false, icon: Flower2, category: 'Arte e Artesanato' },
    { name: 'Artesanato com Recicláveis', tags: ['artesanato', 'recicláveis', 'sustentável', 'diy'], trending: false, icon: Leaf, category: 'Arte e Artesanato' },
    { name: 'Arteterapia', tags: ['arteterapia', 'terapia', 'arte', 'saúde'], trending: false, icon: Paintbrush, category: 'Saúde e Bem-Estar' },
    { name: 'Articulação e Dicção', tags: ['articulação', 'dicção', 'fala', 'comunicação'], trending: false, icon: Mic, category: 'Comunicação e Mídia' },
    { name: 'Asana (Gestão de Projetos)', tags: ['asana', 'gestão', 'projetos', 'produtividade'], trending: false, icon: CheckCircle2, category: 'Produtividade' },
    { name: 'Assessoria de Imprensa 2.0', tags: ['assessoria', 'imprensa', 'comunicação', 'pr'], trending: false, icon: Megaphone, category: 'Comunicação e Mídia' },
    { name: 'Assistente Administrativo', tags: ['assistente', 'administrativo', 'escritório', 'gestão'], trending: false, icon: Briefcase, category: 'Administração' },
    { name: 'Assistente Virtual', tags: ['assistente', 'virtual', 'remoto', 'freelancer'], trending: false, icon: Laptop, category: 'Trabalho Remoto' },
    { name: 'Astrologia', tags: ['astrologia', 'zodíaco', 'horóscopo', 'espiritualidade'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Astrofotografia', tags: ['astrofotografia', 'fotografia', 'astronomia', 'estrelas'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Astronomia Amadora', tags: ['astronomia', 'amadora', 'estrelas', 'espaço'], trending: false, icon: Sparkles, category: 'Ciências' },
    { name: 'Atendimento ao Cliente', tags: ['atendimento', 'cliente', 'customer service', 'sac'], trending: false, icon: Users, category: 'Negócios e Empreendedorismo' },
    { name: 'Autenticação de Dois Fatores', tags: ['autenticação', 'dois fatores', '2fa', 'segurança'], trending: false, icon: Lock, category: 'Programação e Tecnologia' },
    { name: 'AutoCAD', tags: ['autocad', 'cad', 'design', 'engenharia'], trending: false, icon: Ruler, category: 'Engenharia' },
    { name: 'Autoconfiança', tags: ['autoconfiança', 'autoestima', 'desenvolvimento', 'pessoal'], trending: false, icon: Award, category: 'Desenvolvimento Pessoal' },
    { name: 'Automação de Marketing', tags: ['automação', 'marketing', 'digital', 'ferramentas'], trending: false, icon: Bot, category: 'Marketing Digital e Vendas' },
    { name: 'Automação de Processos Jurídicos', tags: ['automação', 'processos', 'jurídicos', 'direito'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Automação de Tarefas (RPA)', tags: ['automação', 'tarefas', 'rpa', 'robôs'], trending: false, icon: Bot, category: 'Programação e Tecnologia' },
    { name: 'Automação Industrial (CLP/PLC)', tags: ['automação', 'industrial', 'clp', 'plc'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Automação para PLR', tags: ['automação', 'plr', 'marketing', 'digital'], trending: false, icon: Bot, category: 'Marketing Digital e Vendas' },
    { name: 'Avaliação de Desempenho', tags: ['avaliação', 'desempenho', 'rh', 'gestão'], trending: false, icon: BarChart3, category: 'Recursos Humanos' },
    { name: 'Avaliação de Imóveis', tags: ['avaliação', 'imóveis', 'imobiliário', 'mercado'], trending: false, icon: Home, category: 'Imobiliário' },
    
    // B
    { name: 'Bachata', tags: ['bachata', 'dança', 'ritmo', 'latino'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Badminton', tags: ['badminton', 'esporte', 'raquete', 'peteca'], trending: false, icon: Trophy, category: 'Esportes' },
    { name: 'Ballet Clássico', tags: ['ballet', 'clássico', 'dança', 'arte'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Bambuterapia', tags: ['bambuterapia', 'massagem', 'terapia', 'bambu'], trending: false, icon: Flower2, category: 'Saúde e Bem-Estar' },
    { name: 'Banco de Dados', tags: ['banco', 'dados', 'database', 'sql'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Banco de Dados NoSQL', tags: ['banco', 'dados', 'nosql', 'mongodb'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Banco de Dados SQL', tags: ['banco', 'dados', 'sql', 'mysql'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Barbearia', tags: ['barbearia', 'barber', 'corte', 'cabelo'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Barboterapia', tags: ['barboterapia', 'barba', 'estética', 'masculina'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Barista e Cafés Especiais', tags: ['barista', 'café', 'cafés', 'especiais'], trending: false, icon: Utensils, category: 'Gastronomia' },
    { name: 'Baralho Cigano', tags: ['baralho', 'cigano', 'tarot', 'místico'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Bartender e Mixologia', tags: ['bartender', 'mixologia', 'drinks', 'coquetel'], trending: false, icon: Utensils, category: 'Gastronomia' },
    { name: 'Basquete', tags: ['basquete', 'basketball', 'esporte', 'jogo'], trending: false, icon: Trophy, category: 'Esportes' },
    { name: 'Bateria', tags: ['bateria', 'música', 'instrumento', 'percussão'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Benefícios Flexíveis', tags: ['benefícios', 'flexíveis', 'rh', 'gestão'], trending: false, icon: Award, category: 'Recursos Humanos' },
    { name: 'Berçarista e Recreação Infantil', tags: ['berçarista', 'recreação', 'infantil', 'criança'], trending: false, icon: Heart, category: 'Educação' },
    { name: 'Big Data', tags: ['big data', 'dados', 'analytics', 'análise'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Bioética', tags: ['bioética', 'ética', 'saúde', 'medicina'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Biofísica', tags: ['biofísica', 'física', 'biologia', 'ciência'], trending: false, icon: Beaker, category: 'Ciências' },
    { name: 'Biografias (Escrita)', tags: ['biografias', 'escrita', 'literatura', 'livro'], trending: false, icon: BookOpen, category: 'Literatura e Escrita' },
    { name: 'Biojoias', tags: ['biojoias', 'joias', 'artesanato', 'orgânico'], trending: false, icon: Sparkles, category: 'Arte e Artesanato' },
    { name: 'Biologia', tags: ['biologia', 'ciência', 'vida', 'natureza'], trending: false, icon: Beaker, category: 'Ciências' },
    { name: 'Biologia Marinha', tags: ['biologia', 'marinha', 'oceano', 'vida'], trending: false, icon: Droplets, category: 'Ciências' },
    { name: 'Biologia Molecular', tags: ['biologia', 'molecular', 'genética', 'célula'], trending: false, icon: TestTube, category: 'Ciências' },
    { name: 'Biomimética', tags: ['biomimética', 'inovação', 'natureza', 'design'], trending: false, icon: Leaf, category: 'Ciências' },
    { name: 'Bioquímica', tags: ['bioquímica', 'química', 'biologia', 'ciência'], trending: false, icon: Beaker, category: 'Ciências' },
    { name: 'Biotecnologia', tags: ['biotecnologia', 'tecnologia', 'biologia', 'inovação'], trending: false, icon: TestTube, category: 'Ciências' },
    { name: 'Biscuit', tags: ['biscuit', 'artesanato', 'modelagem', 'arte'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Blockchain', tags: ['blockchain', 'criptomoedas', 'tecnologia', 'bitcoin'], trending: false, icon: Bitcoin, category: 'Programação e Tecnologia' },
    { name: 'Blogging', tags: ['blogging', 'blog', 'conteúdo', 'escrita'], trending: false, icon: PenLine, category: 'Marketing Digital e Vendas' },
    { name: 'Bolero', tags: ['bolero', 'dança', 'música', 'latino'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Bolos Decorados', tags: ['bolos', 'decorados', 'confeitaria', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Bonsai', tags: ['bonsai', 'plantas', 'jardinagem', 'arte'], trending: false, icon: TreePine, category: 'Jardinagem' },
    { name: 'Bordado', tags: ['bordado', 'artesanato', 'costura', 'tecido'], trending: false, icon: Scissors, category: 'Arte e Artesanato' },
    { name: 'Boxe', tags: ['boxe', 'luta', 'esporte', 'fitness'], trending: false, icon: Dumbbell, category: 'Esportes' },
    { name: 'Branding e Gestão de Marca', tags: ['branding', 'marca', 'identidade', 'marketing'], trending: false, icon: Award, category: 'Marketing Digital e Vendas' },
    { name: 'Breakdance', tags: ['breakdance', 'dança', 'hip hop', 'street'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Brigada de Incêndio', tags: ['brigada', 'incêndio', 'segurança', 'prevenção'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'Brinquedos Educativos', tags: ['brinquedos', 'educativos', 'infantil', 'pedagogia'], trending: false, icon: Lightbulb, category: 'Educação' },
    { name: 'Budismo', tags: ['budismo', 'religião', 'espiritualidade', 'filosofia'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Business Design', tags: ['business', 'design', 'negócios', 'estratégia'], trending: false, icon: Briefcase, category: 'Negócios e Empreendedorismo' },
    { name: 'Business Intelligence (BI) para Marketing', tags: ['business intelligence', 'bi', 'marketing', 'dados'], trending: false, icon: BarChart3, category: 'Marketing Digital e Vendas' },
    { name: 'Búzios', tags: ['búzios', 'oráculo', 'místico', 'adivinhação'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    
    // C
    { name: 'C# e .NET', tags: ['c#', '.net', 'programação', 'microsoft'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Cabala', tags: ['cabala', 'esoterismo', 'mística', 'judaísmo'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Cabelo e Penteados Afro', tags: ['cabelo', 'penteados', 'afro', 'beleza'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Cálculo para Machine Learning', tags: ['cálculo', 'machine learning', 'matemática', 'ia'], trending: false, icon: Calculator, category: 'Programação e Tecnologia' },
    { name: 'Cálculos Trabalhistas', tags: ['cálculos', 'trabalhistas', 'rh', 'salário'], trending: false, icon: Calculator, category: 'Recursos Humanos' },
    { name: 'Caligrafia Digital', tags: ['caligrafia', 'digital', 'lettering', 'design'], trending: false, icon: Pencil, category: 'Design e Criação' },
    { name: 'Calistenia', tags: ['calistenia', 'exercício', 'fitness', 'treino'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Câmara Escura (Fotografia)', tags: ['câmara', 'escura', 'fotografia', 'analógica'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Campanhas Eleitorais', tags: ['campanhas', 'eleitorais', 'política', 'marketing'], trending: false, icon: Megaphone, category: 'Política e Sociedade' },
    { name: 'Canva', tags: ['canva', 'design', 'gráfico', 'ferramenta'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Canto e Técnica Vocal', tags: ['canto', 'técnica', 'vocal', 'música'], trending: false, icon: Mic, category: 'Dança e Música' },
    { name: 'Capoeira', tags: ['capoeira', 'luta', 'dança', 'brasil'], trending: false, icon: Music, category: 'Esportes' },
    { name: 'Captação de Investimentos', tags: ['captação', 'investimentos', 'startup', 'funding'], trending: false, icon: DollarSign, category: 'Negócios e Empreendedorismo' },
    { name: 'Captação de Recursos para ONGs', tags: ['captação', 'recursos', 'ongs', 'fundraising'], trending: false, icon: Heart, category: 'Social' },
    { name: 'Caricatura', tags: ['caricatura', 'desenho', 'arte', 'humor'], trending: false, icon: Pencil, category: 'Arte e Artesanato' },
    { name: 'Carpintaria', tags: ['carpintaria', 'madeira', 'marcenaria', 'móveis'], trending: false, icon: Hammer, category: 'Habilidades Manuais' },
    { name: 'Card Sorting', tags: ['card sorting', 'ux', 'arquitetura', 'informação'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Cargos e Salários', tags: ['cargos', 'salários', 'rh', 'remuneração'], trending: false, icon: DollarSign, category: 'Recursos Humanos' },
    { name: 'Carreira e Propósito', tags: ['carreira', 'propósito', 'desenvolvimento', 'profissional'], trending: false, icon: Target, category: 'Desenvolvimento Pessoal' },
    { name: 'Cartografia', tags: ['cartografia', 'mapas', 'geografia', 'gis'], trending: false, icon: MapIcon, category: 'Ciências e Geografia' },
    { name: 'CATIA', tags: ['catia', 'cad', '3d', 'engenharia'], trending: false, icon: Box, category: 'Engenharia' },
    { name: 'Cavaquinho', tags: ['cavaquinho', 'música', 'instrumento', 'cordas'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Cenografia para Eventos', tags: ['cenografia', 'eventos', 'decoração', 'design'], trending: false, icon: Sparkle, category: 'Eventos' },
    { name: 'Cerimonial e Protocolo', tags: ['cerimonial', 'protocolo', 'eventos', 'etiqueta'], trending: false, icon: Award, category: 'Eventos' },
    { name: 'Cerveja Artesanal', tags: ['cerveja', 'artesanal', 'brew', 'bebida'], trending: false, icon: Utensils, category: 'Gastronomia' },
    { name: 'Chá e Infusões', tags: ['chá', 'infusões', 'bebida', 'ervas'], trending: false, icon: Leaf, category: 'Gastronomia' },
    { name: 'Chakras e Energia Corporal', tags: ['chakras', 'energia', 'corporal', 'espiritualidade'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Chamadas Frias (Cold Calling)', tags: ['chamadas', 'frias', 'cold calling', 'vendas'], trending: false, icon: Megaphone, category: 'Marketing Digital e Vendas' },
    { name: 'Charcutaria (Produção de Embutidos)', tags: ['charcutaria', 'embutidos', 'carne', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Chatbots', tags: ['chatbots', 'bots', 'ia', 'automação'], trending: false, icon: Bot, category: 'Programação e Tecnologia' },
    { name: 'Churrasco', tags: ['churrasco', 'barbecue', 'carne', 'grill'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Ciência de Dados', tags: ['ciência', 'dados', 'data science', 'analytics'], trending: false, icon: BarChart3, category: 'Programação e Tecnologia' },
    { name: 'Ciência Política', tags: ['ciência', 'política', 'governo', 'sociedade'], trending: false, icon: BookOpen, category: 'Política e Sociedade' },
    { name: 'Cibersegurança para Usuários', tags: ['cibersegurança', 'segurança', 'usuários', 'internet'], trending: false, icon: Shield, category: 'Programação e Tecnologia' },
    { name: 'Ciclismo (Mountain Bike)', tags: ['ciclismo', 'mountain bike', 'bike', 'esporte'], trending: false, icon: Trophy, category: 'Esportes' },
    { name: 'City Information Modeling (CIM)', tags: ['cim', 'city', 'modeling', 'urbanismo'], trending: false, icon: Building, category: 'Engenharia' },
    { name: 'Clareamento Dental (Caseiro)', tags: ['clareamento', 'dental', 'caseiro', 'dentes'], trending: false, icon: Sparkles, category: 'Saúde e Bem-Estar' },
    { name: 'Climatologia', tags: ['climatologia', 'clima', 'meteorologia', 'ciência'], trending: false, icon: Wind, category: 'Ciências' },
    { name: 'Cloud Computing', tags: ['cloud', 'computing', 'nuvem', 'ti'], trending: false, icon: Cloud, category: 'Programação e Tecnologia' },
    { name: 'Clown e Palhaçaria', tags: ['clown', 'palhaço', 'teatro', 'comédia'], trending: false, icon: Sparkle, category: 'Arte e Cultura' },
    { name: 'Coaching de Carreira', tags: ['coaching', 'carreira', 'desenvolvimento', 'profissional'], trending: false, icon: Target, category: 'Desenvolvimento Pessoal' },
    { name: 'Coaching de Vida', tags: ['coaching', 'vida', 'desenvolvimento', 'pessoal'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Coaching Executivo', tags: ['coaching', 'executivo', 'liderança', 'gestão'], trending: false, icon: Briefcase, category: 'Desenvolvimento Pessoal' },
    { name: 'Cobrança e Recuperação de Crédito', tags: ['cobrança', 'recuperação', 'crédito', 'financeiro'], trending: false, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Coleta de Exames Laboratoriais', tags: ['coleta', 'exames', 'laboratoriais', 'saúde'], trending: false, icon: TestTube, category: 'Saúde e Bem-Estar' },
    { name: 'Color Grading (Correção de Cor)', tags: ['color grading', 'correção', 'cor', 'vídeo'], trending: false, icon: Film, category: 'Design e Criação' },
    { name: 'Colorimetria Capilar', tags: ['colorimetria', 'capilar', 'cabelo', 'cor'], trending: false, icon: Palette, category: 'Moda e Beleza' },
    { name: 'Comandos Elétricos', tags: ['comandos', 'elétricos', 'eletricidade', 'automação'], trending: false, icon: Zap, category: 'Engenharia' },
    { name: 'Comércio Exterior', tags: ['comércio', 'exterior', 'importação', 'exportação'], trending: false, icon: Globe, category: 'Negócios e Empreendedorismo' },
    { name: 'Comida Japonesa (Sushi)', tags: ['comida', 'japonesa', 'sushi', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Como Falar em Público', tags: ['falar', 'público', 'oratória', 'comunicação'], trending: false, icon: Mic, category: 'Comunicação e Mídia' },
    { name: 'Como Vencer a Procrastinação', tags: ['vencer', 'procrastinação', 'produtividade', 'foco'], trending: false, icon: Target, category: 'Desenvolvimento Pessoal' },
    { name: 'Composição de Cenas com Chroma Key', tags: ['composição', 'cenas', 'chroma key', 'vídeo'], trending: false, icon: Film, category: 'Design e Criação' },
    { name: 'Composição Musical', tags: ['composição', 'musical', 'música', 'criar'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Composição Visual', tags: ['composição', 'visual', 'fotografia', 'design'], trending: false, icon: Camera, category: 'Design e Criação' },
    { name: 'Compostagem Doméstica', tags: ['compostagem', 'doméstica', 'sustentável', 'orgânico'], trending: false, icon: Leaf, category: 'Agricultura e Meio Ambiente' },
    { name: 'Compras e Negociação com Fornecedores', tags: ['compras', 'negociação', 'fornecedores', 'supply'], trending: false, icon: Handshake, category: 'Negócios e Empreendedorismo' },
    { name: 'Comunicação Assertiva no Trabalho', tags: ['comunicação', 'assertiva', 'trabalho', 'profissional'], trending: false, icon: MessageCircle, category: 'Desenvolvimento Pessoal' },
    { name: 'Comunicação com Adolescentes', tags: ['comunicação', 'adolescentes', 'educação', 'jovens'], trending: false, icon: Users, category: 'Educação' },
    { name: 'Comunicação Interna', tags: ['comunicação', 'interna', 'empresa', 'corporativo'], trending: false, icon: MessageCircle, category: 'Comunicação e Mídia' },
    { name: 'Comunicação Não-Violenta', tags: ['comunicação', 'não-violenta', 'cnv', 'empatia'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Comunicação para Liderança', tags: ['comunicação', 'liderança', 'gestão', 'líder'], trending: false, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Comunicação Visual', tags: ['comunicação', 'visual', 'design', 'gráfico'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Concursos Públicos', tags: ['concursos', 'públicos', 'estudos', 'prova'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Condicionamento Físico', tags: ['condicionamento', 'físico', 'fitness', 'treino'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Confeitaria', tags: ['confeitaria', 'doces', 'bolos', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Constelação Familiar', tags: ['constelação', 'familiar', 'terapia', 'sistêmica'], trending: false, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Construção de Autoconfiança', tags: ['construção', 'autoconfiança', 'autoestima', 'desenvolvimento'], trending: false, icon: Award, category: 'Desenvolvimento Pessoal' },
    { name: 'Construção Sustentável', tags: ['construção', 'sustentável', 'green building', 'ecológico'], trending: false, icon: Building, category: 'Engenharia' },
    { name: 'Consultoria de Estilo Masculino', tags: ['consultoria', 'estilo', 'masculino', 'moda'], trending: false, icon: Briefcase, category: 'Moda e Beleza' },
    { name: 'Consultoria de Imagem', tags: ['consultoria', 'imagem', 'estilo', 'moda'], trending: false, icon: UserCircle, category: 'Moda e Beleza' },
    { name: 'Consultoria de Vendas', tags: ['consultoria', 'vendas', 'sales', 'negócios'], trending: false, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Contabilidade para Negócios Digitais', tags: ['contabilidade', 'negócios', 'digitais', 'online'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Contabilidade para Investidores', tags: ['contabilidade', 'investidores', 'impostos', 'ir'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Contação de Histórias', tags: ['contação', 'histórias', 'storytelling', 'narrativa'], trending: false, icon: BookOpen, category: 'Arte e Cultura' },
    { name: 'Contingência e Políticas de Anúncios', tags: ['contingência', 'políticas', 'anúncios', 'ads'], trending: false, icon: ShieldCheck, category: 'Marketing Digital e Vendas' },
    { name: 'Contratos (Direito)', tags: ['contratos', 'direito', 'jurídico', 'legal'], trending: false, icon: FileText, category: 'Direito e Jurídico' },
    { name: 'Controladoria', tags: ['controladoria', 'finanças', 'controle', 'gestão'], trending: false, icon: PieChart, category: 'Finanças e Investimentos' },
    { name: 'Copy para Anúncios', tags: ['copy', 'anúncios', 'copywriting', 'ads'], trending: false, icon: PenTool, category: 'Marketing Digital e Vendas' },
    { name: 'Copy para E-mail Marketing', tags: ['copy', 'e-mail', 'marketing', 'newsletter'], trending: false, icon: Mail, category: 'Marketing Digital e Vendas' },
    { name: 'Copy para Lançamentos', tags: ['copy', 'lançamentos', 'launch', 'vendas'], trending: false, icon: Rocket, category: 'Marketing Digital e Vendas' },
    { name: 'Copy para Páginas de Venda', tags: ['copy', 'páginas', 'venda', 'landing page'], trending: false, icon: FileText, category: 'Marketing Digital e Vendas' },
    { name: 'Copy para Redes Sociais', tags: ['copy', 'redes', 'sociais', 'social media'], trending: false, icon: Share2, category: 'Marketing Digital e Vendas' },
    { name: 'Copy para Vídeos (VSL)', tags: ['copy', 'vídeos', 'vsl', 'video sales'], trending: false, icon: Video, category: 'Marketing Digital e Vendas' },
    { name: 'Copywriting', tags: ['copywriting', 'copy', 'escrita', 'persuasão'], trending: false, icon: PenTool, category: 'Marketing Digital e Vendas' },
    { name: 'CorelDRAW', tags: ['coreldraw', 'corel', 'design', 'vetor'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Corrida de Rua', tags: ['corrida', 'rua', 'running', 'esporte'], trending: false, icon: Trophy, category: 'Esportes' },
    { name: 'Corte e Costura', tags: ['corte', 'costura', 'roupas', 'moda'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Corte de Cabelo Feminino', tags: ['corte', 'cabelo', 'feminino', 'cabeleireiro'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Corte de Cabelo Masculino (Degradê)', tags: ['corte', 'cabelo', 'masculino', 'degradê'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Cosméticos Naturais', tags: ['cosméticos', 'naturais', 'beleza', 'orgânico'], trending: false, icon: Leaf, category: 'Moda e Beleza' },
    { name: 'Costura para Iniciantes', tags: ['costura', 'iniciantes', 'básico', 'máquina'], trending: false, icon: Scissors, category: 'Habilidades Manuais' },
    { name: 'Cozinha Básica para Sobrevivência', tags: ['cozinha', 'básica', 'sobrevivência', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Cozinha Congelada (Marmitas Fit)', tags: ['cozinha', 'congelada', 'marmitas', 'fit'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Cozinha Funcional', tags: ['cozinha', 'funcional', 'saúde', 'nutrição'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Cozinha Italiana', tags: ['cozinha', 'italiana', 'pasta', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Cozinha Mexicana', tags: ['cozinha', 'mexicana', 'tacos', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Cozinha Tailandesa', tags: ['cozinha', 'tailandesa', 'thai', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Cozinha Vegana', tags: ['cozinha', 'vegana', 'vegan', 'plant-based'], trending: false, icon: Leaf, category: 'Gastronomia' },
    { name: 'Criação de Agências Digitais (SMMA)', tags: ['criação', 'agências', 'digitais', 'smma'], trending: false, icon: Briefcase, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de APIs RESTful', tags: ['criação', 'apis', 'restful', 'backend'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Criação de Aplicativos', tags: ['criação', 'aplicativos', 'apps', 'mobile'], trending: false, icon: Smartphone, category: 'Programação e Tecnologia' },
    { name: 'Criação de Avatares com IA', tags: ['criação', 'avatares', 'ia', 'design'], trending: false, icon: Brain, category: 'Design e Criação' },
    { name: 'Criação de Chatbots', tags: ['criação', 'chatbots', 'bots', 'automação'], trending: false, icon: Bot, category: 'Programação e Tecnologia' },
    { name: 'Criação de Conteúdo Estratégico', tags: ['criação', 'conteúdo', 'estratégico', 'marketing'], trending: false, icon: FileText, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de Cursos Online', tags: ['criação', 'cursos', 'online', 'ead'], trending: false, icon: GraduationCap, category: 'Educação' },
    { name: 'Criação de E-books', tags: ['criação', 'e-books', 'livros', 'digitais'], trending: false, icon: BookOpen, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de E-commerces', tags: ['criação', 'e-commerces', 'loja', 'online'], trending: false, icon: ShoppingBag, category: 'Programação e Tecnologia' },
    { name: 'Criação de Fontes', tags: ['criação', 'fontes', 'tipografia', 'design'], trending: false, icon: PenLine, category: 'Design e Criação' },
    { name: 'Criação de Infoprodutos', tags: ['criação', 'infoprodutos', 'produtos', 'digitais'], trending: false, icon: Package, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de Jogos', tags: ['criação', 'jogos', 'games', 'desenvolvimento'], trending: false, icon: Gamepad2, category: 'Programação e Tecnologia' },
    { name: 'Criação de Landing Pages', tags: ['criação', 'landing pages', 'páginas', 'conversão'], trending: false, icon: Layout, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de Lojas na Nuvemshop', tags: ['criação', 'lojas', 'nuvemshop', 'e-commerce'], trending: false, icon: Store, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de Lojas na Shopify', tags: ['criação', 'lojas', 'shopify', 'e-commerce'], trending: false, icon: Store, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de Lojas com WooCommerce', tags: ['criação', 'lojas', 'woocommerce', 'wordpress'], trending: false, icon: Store, category: 'Programação e Tecnologia' },
    { name: 'Criação de Mockups', tags: ['criação', 'mockups', 'protótipo', 'design'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Criação de Nomes para Empresas (Naming)', tags: ['criação', 'nomes', 'empresas', 'naming'], trending: false, icon: Lightbulb, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de Personagens', tags: ['criação', 'personagens', 'character design', 'arte'], trending: false, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Criação de Podcasts', tags: ['criação', 'podcasts', 'áudio', 'conteúdo'], trending: false, icon: Mic, category: 'Comunicação e Mídia' },
    { name: 'Criação de Propostas Comerciais', tags: ['criação', 'propostas', 'comerciais', 'vendas'], trending: false, icon: FileText, category: 'Marketing Digital e Vendas' },
    { name: 'Criação de Roteiros para Podcast', tags: ['criação', 'roteiros', 'podcast', 'script'], trending: false, icon: FileText, category: 'Comunicação e Mídia' },
    { name: 'Criação de Vinhetas', tags: ['criação', 'vinhetas', 'áudio', 'vídeo'], trending: false, icon: Music, category: 'Design e Criação' },
    { name: 'Criminologia', tags: ['criminologia', 'crime', 'justiça', 'direito'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Criptomoedas', tags: ['criptomoedas', 'bitcoin', 'crypto', 'blockchain'], trending: false, icon: Bitcoin, category: 'Finanças e Investimentos' },
    { name: 'Cristaloterapia', tags: ['cristaloterapia', 'cristais', 'terapia', 'energia'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Crítica de Cinema', tags: ['crítica', 'cinema', 'filmes', 'análise'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'Crochê', tags: ['crochê', 'artesanato', 'tricô', 'linha'], trending: false, icon: Scissors, category: 'Arte e Artesanato' },
    { name: 'Cromoterapia', tags: ['cromoterapia', 'cores', 'terapia', 'energia'], trending: false, icon: Palette, category: 'Espiritualidade' },
    { name: 'CrossFit (LPO)', tags: ['crossfit', 'lpo', 'fitness', 'treino'], trending: false, icon: Dumbbell, category: 'Esportes' },
    { name: 'CRM e Gestão de Relacionamento', tags: ['crm', 'gestão', 'relacionamento', 'cliente'], trending: false, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'Cuidador de Idosos', tags: ['cuidador', 'idosos', 'saúde', 'assistência'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Cuidador Infantil', tags: ['cuidador', 'infantil', 'criança', 'babá'], trending: false, icon: Heart, category: 'Educação' },
    { name: 'Cuidados com Pássaros', tags: ['cuidados', 'pássaros', 'aves', 'pets'], trending: false, icon: Heart, category: 'Hobbies e Animais' },
    { name: 'Cuidados com Recém-Nascidos', tags: ['cuidados', 'recém-nascidos', 'bebê', 'maternidade'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Cuidados com Répteis', tags: ['cuidados', 'répteis', 'pets', 'exóticos'], trending: false, icon: Heart, category: 'Hobbies e Animais' },
    { name: 'Cuidados com Roedores e Pequenos Mamíferos', tags: ['cuidados', 'roedores', 'mamíferos', 'pets'], trending: false, icon: Heart, category: 'Hobbies e Animais' },
    { name: 'Cuidados Paliativos', tags: ['cuidados', 'paliativos', 'saúde', 'assistência'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Culinária', tags: ['culinária', 'cozinha', 'receitas', 'comida'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Culinária Árabe', tags: ['culinária', 'árabe', 'comida', 'gastronomia'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Culinária Brasileira Regional', tags: ['culinária', 'brasileira', 'regional', 'típica'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Culinária Francesa', tags: ['culinária', 'francesa', 'french', 'gastronomia'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Cultura Organizacional', tags: ['cultura', 'organizacional', 'empresa', 'rh'], trending: false, icon: Users, category: 'Recursos Humanos' },
    { name: 'Curadoria de Conteúdo', tags: ['curadoria', 'conteúdo', 'content', 'curation'], trending: false, icon: FileStack, category: 'Marketing Digital e Vendas' },
    { name: 'Customização de Roupas', tags: ['customização', 'roupas', 'moda', 'diy'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Cutelaria (Fabricação de Facas)', tags: ['cutelaria', 'fabricação', 'facas', 'artesanal'], trending: false, icon: Wrench, category: 'Habilidades Manuais' },
    
    // D
    { name: 'Dança Afro', tags: ['dança', 'afro', 'africana', 'cultura'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Dança Contemporânea', tags: ['dança', 'contemporânea', 'moderna', 'arte'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Dança de Salão', tags: ['dança', 'salão', 'social', 'casal'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Dança de Rua (Hip Hop)', tags: ['dança', 'rua', 'hip hop', 'street'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Dança do Ventre', tags: ['dança', 'ventre', 'belly dance', 'árabe'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Day Trade', tags: ['day trade', 'trading', 'bolsa', 'ações'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Decoração de Festas', tags: ['decoração', 'festas', 'eventos', 'party'], trending: false, icon: Sparkle, category: 'Eventos' },
    { name: 'Decoração de Interiores', tags: ['decoração', 'interiores', 'design', 'casa'], trending: false, icon: Home, category: 'Design e Criação' },
    { name: 'Defesa Pessoal', tags: ['defesa', 'pessoal', 'segurança', 'luta'], trending: false, icon: ShieldCheck, category: 'Esportes' },
    { name: 'Definição de Persona', tags: ['definição', 'persona', 'marketing', 'público'], trending: false, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'DeFi (Finanças Descentralizadas)', tags: ['defi', 'finanças', 'descentralizadas', 'crypto'], trending: false, icon: Bitcoin, category: 'Finanças e Investimentos' },
    { name: 'Demonologia', tags: ['demonologia', 'demônios', 'ocultismo', 'espiritualidade'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Departamento Pessoal', tags: ['departamento', 'pessoal', 'dp', 'rh'], trending: false, icon: Users, category: 'Recursos Humanos' },
    { name: 'Deep Learning', tags: ['deep learning', 'ia', 'machine learning', 'neural'], trending: false, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Deepfake Ético', tags: ['deepfake', 'ético', 'ia', 'vídeo'], trending: false, icon: Film, category: 'Programação e Tecnologia' },
    { name: 'Desenho Artístico', tags: ['desenho', 'artístico', 'arte', 'ilustração'], trending: false, icon: Pencil, category: 'Arte e Artesanato' },
    { name: 'Desenho de Croquis de Moda', tags: ['desenho', 'croquis', 'moda', 'fashion'], trending: false, icon: Pencil, category: 'Moda e Beleza' },
    { name: 'Desenho de Mangá', tags: ['desenho', 'mangá', 'anime', 'japonês'], trending: false, icon: Pencil, category: 'Arte e Artesanato' },
    { name: 'Desenho de Personagens', tags: ['desenho', 'personagens', 'character', 'design'], trending: false, icon: Pencil, category: 'Design e Criação' },
    { name: 'Desenho e Ilustração Digital', tags: ['desenho', 'ilustração', 'digital', 'arte'], trending: false, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Desenho Mecânico', tags: ['desenho', 'mecânico', 'técnico', 'engenharia'], trending: false, icon: Ruler, category: 'Engenharia' },
    { name: 'Desenho Realista a Lápis', tags: ['desenho', 'realista', 'lápis', 'arte'], trending: false, icon: Pencil, category: 'Arte e Artesanato' },
    { name: 'Desenho Técnico com AutoCAD', tags: ['desenho', 'técnico', 'autocad', 'cad'], trending: false, icon: Ruler, category: 'Engenharia' },
    { name: 'Desenvolvimento de Aplicativos', tags: ['desenvolvimento', 'aplicativos', 'apps', 'mobile'], trending: false, icon: Smartphone, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Apps Nativos (Kotlin, Swift)', tags: ['desenvolvimento', 'apps', 'kotlin', 'swift'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Games', tags: ['desenvolvimento', 'games', 'jogos', 'gamedev'], trending: false, icon: Gamepad2, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Games 2D', tags: ['desenvolvimento', 'games', '2d', 'jogos'], trending: false, icon: Gamepad2, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Games 3D', tags: ['desenvolvimento', 'games', '3d', 'jogos'], trending: false, icon: Gamepad2, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Jogos com Unity', tags: ['desenvolvimento', 'jogos', 'unity', 'gamedev'], trending: false, icon: Gamepad2, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Jogos com Unreal Engine', tags: ['desenvolvimento', 'jogos', 'unreal', 'engine'], trending: false, icon: Gamepad2, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Lideranças', tags: ['desenvolvimento', 'lideranças', 'líderes', 'gestão'], trending: false, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Desenvolvimento de Plugins para WordPress', tags: ['desenvolvimento', 'plugins', 'wordpress', 'php'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Smart Contracts', tags: ['desenvolvimento', 'smart contracts', 'blockchain', 'ethereum'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento de Temas para WordPress', tags: ['desenvolvimento', 'temas', 'wordpress', 'themes'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento Infantil', tags: ['desenvolvimento', 'infantil', 'criança', 'educação'], trending: false, icon: Heart, category: 'Educação' },
    { name: 'Desenvolvimento Pessoal', tags: ['desenvolvimento', 'pessoal', 'autoconhecimento', 'crescimento'], trending: true, icon: Target, category: 'Desenvolvimento Pessoal' },
    { name: 'Desenvolvimento Web Back-End', tags: ['desenvolvimento', 'web', 'backend', 'servidor'], trending: false, icon: Server, category: 'Programação e Tecnologia' },
    { name: 'Desenvolvimento Web Front-End', tags: ['desenvolvimento', 'web', 'frontend', 'interface'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Design de Apresentações', tags: ['design', 'apresentações', 'slides', 'powerpoint'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Design de Barba', tags: ['design', 'barba', 'barbearia', 'grooming'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Design de Embalagens', tags: ['design', 'embalagens', 'packaging', 'produto'], trending: false, icon: Box, category: 'Design e Criação' },
    { name: 'Design de Emoções', tags: ['design', 'emoções', 'emocional', 'ux'], trending: false, icon: Heart, category: 'Design e Criação' },
    { name: 'Design de Estampas', tags: ['design', 'estampas', 'pattern', 'moda'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Design de Experiência do Usuário (UX)', tags: ['design', 'experiência', 'usuário', 'ux'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Design de Filtros para Instagram', tags: ['design', 'filtros', 'instagram', 'ar'], trending: false, icon: Camera, category: 'Design e Criação' },
    { name: 'Design de Games', tags: ['design', 'games', 'jogos', 'gamedesign'], trending: false, icon: Gamepad2, category: 'Design e Criação' },
    { name: 'Design de Interação', tags: ['design', 'interação', 'ux', 'interface'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Design de Interfaces (UI)', tags: ['design', 'interfaces', 'ui', 'user interface'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Design de Interiores', tags: ['design', 'interiores', 'decoração', 'arquitetura'], trending: false, icon: Home, category: 'Design e Criação' },
    { name: 'Design de Joias', tags: ['design', 'joias', 'jewelry', 'acessórios'], trending: false, icon: Sparkles, category: 'Design e Criação' },
    { name: 'Design de Landing Pages', tags: ['design', 'landing pages', 'páginas', 'conversão'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Design de Logos', tags: ['design', 'logos', 'logotipos', 'marca'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Design de Marcas', tags: ['design', 'marcas', 'branding', 'identidade'], trending: false, icon: Award, category: 'Design e Criação' },
    { name: 'Design de Mobiliário', tags: ['design', 'mobiliário', 'móveis', 'furniture'], trending: false, icon: Home, category: 'Design e Criação' },
    { name: 'Design de Personagens', tags: ['design', 'personagens', 'character', 'arte'], trending: false, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Design de Serviços', tags: ['design', 'serviços', 'service design', 'ux'], trending: false, icon: Briefcase, category: 'Design e Criação' },
    { name: 'Design de Sistemas (Design Systems)', tags: ['design', 'sistemas', 'design systems', 'ui'], trending: false, icon: Layers, category: 'Design e Criação' },
    { name: 'Design de Sobrancelhas', tags: ['design', 'sobrancelhas', 'estética', 'beleza'], trending: false, icon: Eye, category: 'Moda e Beleza' },
    { name: 'Design Editorial (Revistas, Livros)', tags: ['design', 'editorial', 'revistas', 'livros'], trending: false, icon: BookOpen, category: 'Design e Criação' },
    { name: 'Design Gráfico', tags: ['design', 'gráfico', 'graphic design', 'visual'], trending: true, icon: Palette, category: 'Design e Criação' },
    { name: 'Design Inclusivo', tags: ['design', 'inclusivo', 'acessibilidade', 'a11y'], trending: false, icon: Heart, category: 'Design e Criação' },
    { name: 'Design Instrucional', tags: ['design', 'instrucional', 'educação', 'ead'], trending: false, icon: GraduationCap, category: 'Educação' },
    { name: 'Design para PLRs', tags: ['design', 'plrs', 'plr', 'produtos'], trending: false, icon: Package, category: 'Design e Criação' },
    { name: 'Design para Redes Sociais', tags: ['design', 'redes', 'sociais', 'social media'], trending: false, icon: Share2, category: 'Design e Criação' },
    { name: 'Design Sprint', tags: ['design', 'sprint', 'metodologia', 'ágil'], trending: false, icon: Rocket, category: 'Design e Criação' },
    { name: 'Design Thinking', tags: ['design', 'thinking', 'inovação', 'metodologia'], trending: false, icon: Lightbulb, category: 'Design e Criação' },
    { name: 'Design de Unhas (Nail Design)', tags: ['design', 'unhas', 'nail', 'manicure'], trending: false, icon: Sparkles, category: 'Moda e Beleza' },
    { name: 'Detox de Redes Sociais', tags: ['detox', 'redes', 'sociais', 'bem-estar'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'DevOps e CI/CD', tags: ['devops', 'ci', 'cd', 'automação'], trending: false, icon: Server, category: 'Programação e Tecnologia' },
    { name: 'Diagramação', tags: ['diagramação', 'layout', 'editorial', 'design'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Diálogo e Comunicação Empática', tags: ['diálogo', 'comunicação', 'empática', 'cnv'], trending: false, icon: MessageCircle, category: 'Desenvolvimento Pessoal' },
    { name: 'Dietas (Low Carb, Cetogênica)', tags: ['dietas', 'low carb', 'cetogênica', 'keto'], trending: false, icon: ChefHat, category: 'Saúde e Bem-Estar' },
    { name: 'Dinâmica dos Fluidos Computacional (CFD)', tags: ['dinâmica', 'fluidos', 'cfd', 'engenharia'], trending: false, icon: Wind, category: 'Engenharia' },
    { name: 'Dinâmicas de Grupo', tags: ['dinâmicas', 'grupo', 'team building', 'workshop'], trending: false, icon: Users, category: 'Recursos Humanos' },
    { name: 'Direção de Atores e Não-Atores', tags: ['direção', 'atores', 'não-atores', 'cinema'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'Direção de Arte', tags: ['direção', 'arte', 'cinema', 'design'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Direção de Fotografia (Vídeo)', tags: ['direção', 'fotografia', 'vídeo', 'cinema'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Direção Defensiva e Evasiva', tags: ['direção', 'defensiva', 'evasiva', 'trânsito'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'Direito Administrativo', tags: ['direito', 'administrativo', 'público', 'jurídico'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Direito Ambiental', tags: ['direito', 'ambiental', 'meio ambiente', 'jurídico'], trending: false, icon: Leaf, category: 'Direito e Jurídico' },
    { name: 'Direito Civil', tags: ['direito', 'civil', 'contratos', 'jurídico'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Direito Constitucional', tags: ['direito', 'constitucional', 'constituição', 'jurídico'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Direito Contratual', tags: ['direito', 'contratual', 'contratos', 'jurídico'], trending: false, icon: FileText, category: 'Direito e Jurídico' },
    { name: 'Direito de Família', tags: ['direito', 'família', 'divórcio', 'jurídico'], trending: false, icon: Heart, category: 'Direito e Jurídico' },
    { name: 'Direito do Consumidor', tags: ['direito', 'consumidor', 'cdc', 'jurídico'], trending: false, icon: ShieldCheck, category: 'Direito e Jurídico' },
    { name: 'Direito do Idoso', tags: ['direito', 'idoso', 'estatuto', 'jurídico'], trending: false, icon: Heart, category: 'Direito e Jurídico' },
    { name: 'Direito do Trabalho', tags: ['direito', 'trabalho', 'trabalhista', 'jurídico'], trending: false, icon: Briefcase, category: 'Direito e Jurídico' },
    { name: 'Direito Digital e LGPD', tags: ['direito', 'digital', 'lgpd', 'dados'], trending: false, icon: Lock, category: 'Direito e Jurídico' },
    { name: 'Direito Eleitoral', tags: ['direito', 'eleitoral', 'eleições', 'jurídico'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Direito Empresarial', tags: ['direito', 'empresarial', 'corporativo', 'jurídico'], trending: false, icon: Briefcase, category: 'Direito e Jurídico' },
    { name: 'Direito Imobiliário', tags: ['direito', 'imobiliário', 'imóveis', 'jurídico'], trending: false, icon: Home, category: 'Direito e Jurídico' },
    { name: 'Direito para Concursos', tags: ['direito', 'concursos', 'provas', 'estudo'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Direito Penal', tags: ['direito', 'penal', 'criminal', 'jurídico'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Direito Previdenciário', tags: ['direito', 'previdenciário', 'inss', 'jurídico'], trending: false, icon: Shield, category: 'Direito e Jurídico' },
    { name: 'Direito Tributário', tags: ['direito', 'tributário', 'impostos', 'jurídico'], trending: false, icon: Calculator, category: 'Direito e Jurídico' },
    { name: 'Disciplina Positiva', tags: ['disciplina', 'positiva', 'educação', 'filhos'], trending: false, icon: Heart, category: 'Educação' },
    { name: 'Distribuição de Filmes em Festivais', tags: ['distribuição', 'filmes', 'festivais', 'cinema'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'Distribuição de Música em Plataformas', tags: ['distribuição', 'música', 'plataformas', 'streaming'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Distribuição de Podcast', tags: ['distribuição', 'podcast', 'plataformas', 'streaming'], trending: false, icon: Mic, category: 'Comunicação e Mídia' },
    { name: 'Divi (Criação de Sites)', tags: ['divi', 'criação', 'sites', 'wordpress'], trending: false, icon: Layout, category: 'Programação e Tecnologia' },
    { name: 'DJ (Mixagem e Performance)', tags: ['dj', 'mixagem', 'performance', 'música'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Doces Gourmet para Vender', tags: ['doces', 'gourmet', 'vender', 'confeitaria'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Documentários (Produção)', tags: ['documentários', 'produção', 'cinema', 'vídeo'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'Dog Walker Profissional', tags: ['dog walker', 'passeador', 'cães', 'pets'], trending: false, icon: Heart, category: 'Hobbies e Animais' },
    { name: 'Drenagem Linfática', tags: ['drenagem', 'linfática', 'massagem', 'estética'], trending: false, icon: Flower2, category: 'Saúde e Bem-Estar' },
    { name: 'Dropshipping', tags: ['dropshipping', 'e-commerce', 'vendas', 'online'], trending: true, icon: Package, category: 'Marketing Digital e Vendas' },
    { name: 'Dropshipping Internacional', tags: ['dropshipping', 'internacional', 'importação', 'vendas'], trending: false, icon: Globe, category: 'Marketing Digital e Vendas' },
    { name: 'Dropshipping Nacional', tags: ['dropshipping', 'nacional', 'brasil', 'vendas'], trending: false, icon: Package, category: 'Marketing Digital e Vendas' },
    { name: 'Drones para Mapeamento', tags: ['drones', 'mapeamento', 'aerofotografia', 'survey'], trending: false, icon: Camera, category: 'Tecnologia' },
    { name: 'Duplo Diamante (Double Diamond)', tags: ['duplo', 'diamante', 'double diamond', 'design'], trending: false, icon: Sparkles, category: 'Design e Criação' },
    
    // E
    { name: 'E-commerce', tags: ['e-commerce', 'loja', 'online', 'vendas'], trending: true, icon: ShoppingBag, category: 'Marketing Digital e Vendas' },
    { name: 'E-mail Marketing', tags: ['e-mail', 'marketing', 'newsletter', 'automação'], trending: false, icon: Mail, category: 'Marketing Digital e Vendas' },
    { name: 'E-Social para SST', tags: ['e-social', 'sst', 'segurança', 'trabalho'], trending: false, icon: ShieldCheck, category: 'Recursos Humanos' },
    { name: 'Economia Circular', tags: ['economia', 'circular', 'sustentável', 'reciclagem'], trending: false, icon: Leaf, category: 'Agricultura e Meio Ambiente' },
    { name: 'Edição de Áudio para Podcast', tags: ['edição', 'áudio', 'podcast', 'produção'], trending: false, icon: Headphones, category: 'Comunicação e Mídia' },
    { name: 'Edição de Fotos', tags: ['edição', 'fotos', 'fotografia', 'imagem'], trending: false, icon: Image, category: 'Design e Criação' },
    { name: 'Edição de Vídeo', tags: ['edição', 'vídeo', 'videomaker', 'produção'], trending: false, icon: Film, category: 'Design e Criação' },
    { name: 'Edição de Vídeo com DaVinci Resolve', tags: ['edição', 'vídeo', 'davinci', 'resolve'], trending: false, icon: Film, category: 'Design e Criação' },
    { name: 'Edição de Vídeos no Celular (CapCut)', tags: ['edição', 'vídeos', 'celular', 'capcut'], trending: false, icon: Smartphone, category: 'Design e Criação' },
    { name: 'Educação Ambiental', tags: ['educação', 'ambiental', 'meio ambiente', 'sustentabilidade'], trending: false, icon: TreePine, category: 'Educação' },
    { name: 'Educação Especial e Inclusiva', tags: ['educação', 'especial', 'inclusiva', 'acessibilidade'], trending: false, icon: Heart, category: 'Educação' },
    { name: 'Educação Financeira', tags: ['educação', 'financeira', 'dinheiro', 'finanças'], trending: false, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Educação Parental', tags: ['educação', 'parental', 'filhos', 'pais'], trending: false, icon: Users, category: 'Educação' },
    { name: 'Efeitos Especiais (Maquiagem)', tags: ['efeitos', 'especiais', 'maquiagem', 'sfx'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Efeitos Visuais (VFX)', tags: ['efeitos', 'visuais', 'vfx', 'cinema'], trending: false, icon: Film, category: 'Design e Criação' },
    { name: 'Eficiência Energética Industrial', tags: ['eficiência', 'energética', 'industrial', 'energia'], trending: false, icon: Zap, category: 'Engenharia' },
    { name: 'Egiptologia', tags: ['egiptologia', 'egito', 'história', 'arqueologia'], trending: false, icon: BookOpen, category: 'Ciências Humanas' },
    { name: 'Elaboração de Projetos Sociais', tags: ['elaboração', 'projetos', 'sociais', 'ongs'], trending: false, icon: Heart, category: 'Social' },
    { name: 'Eletricidade Automotiva', tags: ['eletricidade', 'automotiva', 'carro', 'elétrica'], trending: false, icon: Zap, category: 'Automotivo' },
    { name: 'Eletricidade Residencial', tags: ['eletricidade', 'residencial', 'casa', 'instalação'], trending: false, icon: Zap, category: 'Habilidades Manuais' },
    { name: 'Eletrocardiograma', tags: ['eletrocardiograma', 'ecg', 'coração', 'saúde'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    { name: 'Eletroencefalograma', tags: ['eletroencefalograma', 'eeg', 'cérebro', 'saúde'], trending: false, icon: Brain, category: 'Saúde e Bem-Estar' },
    { name: 'Eletrônica Básica', tags: ['eletrônica', 'básica', 'circuitos', 'componentes'], trending: false, icon: Cpu, category: 'Engenharia' },
    { name: 'Eletrônica para Robótica', tags: ['eletrônica', 'robótica', 'robôs', 'automação'], trending: false, icon: Bot, category: 'Programação e Tecnologia' },
    { name: 'Elementor (Criação de Sites)', tags: ['elementor', 'criação', 'sites', 'wordpress'], trending: false, icon: Layout, category: 'Programação e Tecnologia' },
    { name: 'Empreendedorismo Digital', tags: ['empreendedorismo', 'digital', 'negócios', 'online'], trending: false, icon: Rocket, category: 'Negócios e Empreendedorismo' },
    { name: 'Encadernação Artesanal', tags: ['encadernação', 'artesanal', 'livros', 'cadernos'], trending: false, icon: BookOpen, category: 'Arte e Artesanato' },
    { name: 'Endomarketing', tags: ['endomarketing', 'marketing', 'interno', 'empresa'], trending: false, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'Energias Renováveis', tags: ['energias', 'renováveis', 'sustentável', 'solar'], trending: false, icon: Sun, category: 'Engenharia' },
    { name: 'Engenharia de Alimentos', tags: ['engenharia', 'alimentos', 'food', 'tecnologia'], trending: false, icon: Beaker, category: 'Engenharia' },
    { name: 'Engenharia de Confiabilidade', tags: ['engenharia', 'confiabilidade', 'manutenção', 'qualidade'], trending: false, icon: ShieldCheck, category: 'Engenharia' },
    { name: 'Engenharia de Controle e Automação', tags: ['engenharia', 'controle', 'automação', 'robótica'], trending: false, icon: Settings, category: 'Engenharia' },
    { name: 'Engenharia de Materiais', tags: ['engenharia', 'materiais', 'ciência', 'tecnologia'], trending: false, icon: Box, category: 'Engenharia' },
    { name: 'Engenharia de Produção', tags: ['engenharia', 'produção', 'processos', 'gestão'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Engenharia de Software', tags: ['engenharia', 'software', 'desenvolvimento', 'programação'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Engenharia Reversa', tags: ['engenharia', 'reversa', 'análise', 'tecnologia'], trending: false, icon: Search, category: 'Engenharia' },
    { name: 'Engenharia Sísmica', tags: ['engenharia', 'sísmica', 'terremoto', 'estruturas'], trending: false, icon: Mountain, category: 'Engenharia' },
    { name: 'ENEM e Vestibulares', tags: ['enem', 'vestibulares', 'provas', 'estudos'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Enfermagem do Trabalho', tags: ['enfermagem', 'trabalho', 'saúde', 'ocupacional'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Enriquecimento Ambiental para Gatos', tags: ['enriquecimento', 'ambiental', 'gatos', 'pets'], trending: false, icon: Heart, category: 'Hobbies e Animais' },
    { name: 'Ensaios Não Destrutivos', tags: ['ensaios', 'não destrutivos', 'testes', 'qualidade'], trending: false, icon: TestTube, category: 'Engenharia' },
    { name: 'Entalhe em Madeira', tags: ['entalhe', 'madeira', 'escultura', 'artesanato'], trending: false, icon: Hammer, category: 'Arte e Artesanato' },
    { name: 'Entrevistas Comportamentais', tags: ['entrevistas', 'comportamentais', 'rh', 'recrutamento'], trending: false, icon: Users, category: 'Recursos Humanos' },
    { name: 'Entrevistas com Usuários', tags: ['entrevistas', 'usuários', 'ux', 'pesquisa'], trending: false, icon: MessageCircle, category: 'Design e Criação' },
    { name: 'Epidemiologia', tags: ['epidemiologia', 'saúde', 'pública', 'doenças'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    { name: 'Epistemologia (Teoria do Conhecimento)', tags: ['epistemologia', 'teoria', 'conhecimento', 'filosofia'], trending: false, icon: Brain, category: 'Filosofia' },
    { name: 'Equoterapia', tags: ['equoterapia', 'cavalos', 'terapia', 'saúde'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Ergonomia', tags: ['ergonomia', 'postura', 'saúde', 'trabalho'], trending: false, icon: Users, category: 'Saúde e Bem-Estar' },
    { name: 'Escala de Campanhas', tags: ['escala', 'campanhas', 'ads', 'marketing'], trending: false, icon: TrendingUp, category: 'Marketing Digital e Vendas' },
    { name: 'Escalada', tags: ['escalada', 'climbing', 'esporte', 'montanha'], trending: false, icon: Mountain, category: 'Esportes' },
    { name: 'Escatologia', tags: ['escatologia', 'teologia', 'fim', 'profecia'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Escrita Criativa', tags: ['escrita', 'criativa', 'literatura', 'redação'], trending: false, icon: PenLine, category: 'Literatura e Escrita' },
    { name: 'Escrita de Artigos para Blog', tags: ['escrita', 'artigos', 'blog', 'conteúdo'], trending: false, icon: FileText, category: 'Marketing Digital e Vendas' },
    { name: 'Escrita de Ficção', tags: ['escrita', 'ficção', 'literatura', 'romance'], trending: false, icon: BookOpen, category: 'Literatura e Escrita' },
    { name: 'Escrita de Não-Ficção', tags: ['escrita', 'não-ficção', 'livro', 'biografia'], trending: false, icon: BookOpen, category: 'Literatura e Escrita' },
    { name: 'Escrita Fiscal', tags: ['escrita', 'fiscal', 'contabilidade', 'impostos'], trending: false, icon: FileText, category: 'Finanças e Investimentos' },
    { name: 'Escrita para UX (UX Writing)', tags: ['escrita', 'ux', 'ux writing', 'microcopy'], trending: false, icon: PenLine, category: 'Design e Criação' },
    { name: 'Escrita Persuasiva', tags: ['escrita', 'persuasiva', 'copywriting', 'vendas'], trending: false, icon: PenTool, category: 'Marketing Digital e Vendas' },
    { name: 'Escultura em Argila', tags: ['escultura', 'argila', 'cerâmica', 'arte'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Escultura em Balões', tags: ['escultura', 'balões', 'festas', 'decoração'], trending: false, icon: Sparkle, category: 'Arte e Artesanato' },
    { name: 'Escultura Digital', tags: ['escultura', 'digital', '3d', 'zbrush'], trending: false, icon: Box, category: 'Design e Criação' },
    { name: 'Escutatória (Escuta Ativa)', tags: ['escutatória', 'escuta', 'ativa', 'comunicação'], trending: false, icon: Headphones, category: 'Desenvolvimento Pessoal' },
    { name: 'Esgrima', tags: ['esgrima', 'esporte', 'luta', 'espada'], trending: false, icon: Trophy, category: 'Esportes' },
    { name: 'Espanhol', tags: ['espanhol', 'idioma', 'língua', 'spanish'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Espanhol para Negócios', tags: ['espanhol', 'negócios', 'business', 'idioma'], trending: false, icon: Briefcase, category: 'Idiomas' },
    { name: 'Espaços Confinados (NR-33)', tags: ['espaços', 'confinados', 'nr-33', 'segurança'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'Especialização em Vendas para Software (SaaS)', tags: ['especialização', 'vendas', 'software', 'saas'], trending: false, icon: Laptop, category: 'Marketing Digital e Vendas' },
    { name: 'Espiritismo', tags: ['espiritismo', 'religião', 'espiritualidade', 'kardec'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Esportes Eletrônicos (eSports)', tags: ['esportes', 'eletrônicos', 'esports', 'games'], trending: false, icon: Gamepad2, category: 'Esportes' },
    { name: 'Estamparia Manual (Serigrafia, Block Print)', tags: ['estamparia', 'manual', 'serigrafia', 'silk'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Estatística Espacial', tags: ['estatística', 'espacial', 'gis', 'dados'], trending: false, icon: MapIcon, category: 'Ciências' },
    { name: 'Estatística para Ciência de Dados', tags: ['estatística', 'ciência', 'dados', 'analytics'], trending: false, icon: BarChart3, category: 'Programação e Tecnologia' },
    { name: 'Estética Automotiva', tags: ['estética', 'automotiva', 'carro', 'detailing'], trending: false, icon: Sparkle, category: 'Automotivo' },
    { name: 'Estética Corporal', tags: ['estética', 'corporal', 'beleza', 'corpo'], trending: false, icon: Heart, category: 'Moda e Beleza' },
    { name: 'Estética Facial', tags: ['estética', 'facial', 'rosto', 'beleza'], trending: false, icon: Sparkle, category: 'Moda e Beleza' },
    { name: 'Estética (Filosofia da Arte)', tags: ['estética', 'filosofia', 'arte', 'beleza'], trending: false, icon: Paintbrush, category: 'Filosofia' },
    { name: 'Estoicismo', tags: ['estoicismo', 'filosofia', 'sabedoria', 'estoico'], trending: false, icon: BookOpen, category: 'Filosofia' },
    { name: 'Estratégias de Aprovação em Concursos', tags: ['estratégias', 'aprovação', 'concursos', 'estudos'], trending: false, icon: Target, category: 'Educação' },
    { name: 'Estratégias de Conteúdo', tags: ['estratégias', 'conteúdo', 'content', 'marketing'], trending: false, icon: FileText, category: 'Marketing Digital e Vendas' },
    { name: 'Estratégias de Venda para Monetizze', tags: ['estratégias', 'venda', 'monetizze', 'afiliado'], trending: false, icon: DollarSign, category: 'Marketing Digital e Vendas' },
    { name: 'Estruturas de Dados', tags: ['estruturas', 'dados', 'algoritmos', 'programação'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Etiqueta Corporativa', tags: ['etiqueta', 'corporativa', 'profissional', 'comportamento'], trending: false, icon: Briefcase, category: 'Desenvolvimento Pessoal' },
    { name: 'Etiqueta Social', tags: ['etiqueta', 'social', 'comportamento', 'boas maneiras'], trending: false, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Etnografia Digital', tags: ['etnografia', 'digital', 'pesquisa', 'ux'], trending: false, icon: Search, category: 'Design e Criação' },
    { name: 'Exegese Bíblica', tags: ['exegese', 'bíblica', 'teologia', 'interpretação'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Excel (Básico ao Avançado)', tags: ['excel', 'planilhas', 'microsoft', 'dados'], trending: false, icon: FileText, category: 'Produtividade' },
    { name: 'Extensão de Cílios', tags: ['extensão', 'cílios', 'beleza', 'estética'], trending: false, icon: Eye, category: 'Moda e Beleza' },
    
    // F
    { name: 'Facebook Ads', tags: ['facebook', 'ads', 'anúncios', 'marketing'], trending: false, icon: Share2, category: 'Marketing Digital e Vendas' },
    { name: 'Fact-Checking', tags: ['fact-checking', 'verificação', 'fake news', 'jornalismo'], trending: false, icon: CheckCircle2, category: 'Comunicação e Mídia' },
    { name: 'Falar ao Telefone Profissionalmente', tags: ['falar', 'telefone', 'profissionalmente', 'atendimento'], trending: false, icon: Mic, category: 'Comunicação e Mídia' },
    { name: 'Farmacologia (Básica)', tags: ['farmacologia', 'básica', 'medicamentos', 'farmácia'], trending: false, icon: TestTube, category: 'Saúde e Bem-Estar' },
    { name: 'Fechamento de Arquivos para Gráfica', tags: ['fechamento', 'arquivos', 'gráfica', 'design'], trending: false, icon: Printer, category: 'Design e Criação' },
    { name: 'Feltro', tags: ['feltro', 'artesanato', 'tecido', 'crafts'], trending: false, icon: Scissors, category: 'Arte e Artesanato' },
    { name: 'Feng Shui', tags: ['feng shui', 'energia', 'decoração', 'harmonia'], trending: false, icon: Home, category: 'Espiritualidade' },
    { name: 'Ferramentas de IA para Marketing', tags: ['ferramentas', 'ia', 'marketing', 'inteligência artificial'], trending: false, icon: Brain, category: 'Marketing Digital e Vendas' },
    { name: 'Fico (Análise de Crédito)', tags: ['fico', 'análise', 'crédito', 'score'], trending: false, icon: BarChart3, category: 'Finanças e Investimentos' },
    { name: 'Fidelização de Clientes', tags: ['fidelização', 'clientes', 'retenção', 'loyalty'], trending: false, icon: Heart, category: 'Marketing Digital e Vendas' },
    { name: 'Figurinismo para Teatro e Cinema', tags: ['figurinismo', 'teatro', 'cinema', 'moda'], trending: false, icon: Sparkle, category: 'Arte e Cultura' },
    { name: 'Filatelia (Coleção de Selos)', tags: ['filatelia', 'coleção', 'selos', 'hobby'], trending: false, icon: Coins, category: 'Hobbies' },
    { name: 'Filosofia (Clássica e Moderna)', tags: ['filosofia', 'clássica', 'moderna', 'pensamento'], trending: false, icon: BookOpen, category: 'Filosofia' },
    { name: 'Filosofia da Ciência', tags: ['filosofia', 'ciência', 'epistemologia', 'método'], trending: false, icon: Beaker, category: 'Filosofia' },
    { name: 'Filosofia da Linguagem', tags: ['filosofia', 'linguagem', 'semântica', 'comunicação'], trending: false, icon: MessageCircle, category: 'Filosofia' },
    { name: 'Filosofia da Mente', tags: ['filosofia', 'mente', 'consciência', 'pensamento'], trending: false, icon: Brain, category: 'Filosofia' },
    { name: 'Filosofia da Religião', tags: ['filosofia', 'religião', 'teologia', 'fé'], trending: false, icon: BookOpen, category: 'Filosofia' },
    { name: 'Filosofia Política', tags: ['filosofia', 'política', 'estado', 'sociedade'], trending: false, icon: Scale, category: 'Filosofia' },
    { name: 'Finanças Corporativas', tags: ['finanças', 'corporativas', 'empresarial', 'gestão'], trending: false, icon: Briefcase, category: 'Finanças e Investimentos' },
    { name: 'Finanças Pessoais e Organização', tags: ['finanças', 'pessoais', 'organização', 'dinheiro'], trending: true, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Finanças para Casais', tags: ['finanças', 'casais', 'família', 'dinheiro'], trending: false, icon: Heart, category: 'Finanças e Investimentos' },
    { name: 'Finanças para Freelancers', tags: ['finanças', 'freelancers', 'autônomo', 'gestão'], trending: false, icon: Laptop, category: 'Finanças e Investimentos' },
    { name: 'Fintech', tags: ['fintech', 'tecnologia', 'financeira', 'startup'], trending: false, icon: Bitcoin, category: 'Finanças e Investimentos' },
    { name: 'Fisiologia Humana', tags: ['fisiologia', 'humana', 'corpo', 'saúde'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    { name: 'Fisioterapia Desportiva (Princípios)', tags: ['fisioterapia', 'desportiva', 'esporte', 'reabilitação'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Fitoterapia', tags: ['fitoterapia', 'plantas', 'medicinais', 'terapia'], trending: false, icon: Leaf, category: 'Saúde e Bem-Estar' },
    { name: 'FL Studio', tags: ['fl studio', 'música', 'produção', 'daw'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Flexografia', tags: ['flexografia', 'impressão', 'gráfica', 'embalagens'], trending: false, icon: Printer, category: 'Design e Criação' },
    { name: 'Florais de Bach', tags: ['florais', 'bach', 'terapia', 'essências'], trending: false, icon: Flower2, category: 'Espiritualidade' },
    { name: 'Flutter', tags: ['flutter', 'app', 'mobile', 'desenvolvimento'], trending: false, icon: Smartphone, category: 'Programação e Tecnologia' },
    { name: 'Fluxo de Caixa', tags: ['fluxo', 'caixa', 'finanças', 'gestão'], trending: false, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'FMEA (Análise de Modos de Falha e Efeitos)', tags: ['fmea', 'análise', 'falha', 'qualidade'], trending: false, icon: ShieldCheck, category: 'Engenharia' },
    { name: 'Folha de Pagamento', tags: ['folha', 'pagamento', 'rh', 'salário'], trending: false, icon: DollarSign, category: 'Recursos Humanos' },
    { name: 'Fotografia', tags: ['fotografia', 'fotos', 'câmera', 'imagem'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Alimentos', tags: ['fotografia', 'alimentos', 'food', 'comida'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Arquitetura', tags: ['fotografia', 'arquitetura', 'imóveis', 'construção'], trending: false, icon: Building, category: 'Fotografia' },
    { name: 'Fotografia de Casamento', tags: ['fotografia', 'casamento', 'eventos', 'wedding'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Eventos', tags: ['fotografia', 'eventos', 'festas', 'cobertura'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Gestante', tags: ['fotografia', 'gestante', 'maternidade', 'gravidez'], trending: false, icon: Heart, category: 'Fotografia' },
    { name: 'Fotografia de Moda', tags: ['fotografia', 'moda', 'fashion', 'editorial'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Natureza', tags: ['fotografia', 'natureza', 'paisagem', 'wildlife'], trending: false, icon: TreePine, category: 'Fotografia' },
    { name: 'Fotografia de Newborn', tags: ['fotografia', 'newborn', 'recém-nascido', 'bebê'], trending: false, icon: Heart, category: 'Fotografia' },
    { name: 'Fotografia de Paisagem', tags: ['fotografia', 'paisagem', 'landscape', 'natureza'], trending: false, icon: Mountain, category: 'Fotografia' },
    { name: 'Fotografia de Parto', tags: ['fotografia', 'parto', 'nascimento', 'maternidade'], trending: false, icon: Heart, category: 'Fotografia' },
    { name: 'Fotografia de Produtos', tags: ['fotografia', 'produtos', 'e-commerce', 'catalogo'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Retratos', tags: ['fotografia', 'retratos', 'portrait', 'pessoas'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Rua', tags: ['fotografia', 'rua', 'street', 'urbana'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Viagem', tags: ['fotografia', 'viagem', 'travel', 'turismo'], trending: false, icon: Plane, category: 'Fotografia' },
    { name: 'Fotografia com Celular', tags: ['fotografia', 'celular', 'mobile', 'smartphone'], trending: true, icon: Smartphone, category: 'Fotografia' },
    { name: 'Fotografia com Drone', tags: ['fotografia', 'drone', 'aérea', 'imagens'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia Publicitária', tags: ['fotografia', 'publicitária', 'comercial', 'propaganda'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia Sensual (Boudoir)', tags: ['fotografia', 'sensual', 'boudoir', 'ensaio'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotojornalismo', tags: ['fotojornalismo', 'jornalismo', 'notícia', 'reportagem'], trending: false, icon: Camera, category: 'Comunicação e Mídia' },
    { name: 'Francês', tags: ['francês', 'idioma', 'língua', 'french'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Francês para Iniciantes', tags: ['francês', 'iniciantes', 'básico', 'idioma'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Funilaria e Pintura', tags: ['funilaria', 'pintura', 'automotivo', 'carro'], trending: false, icon: Wrench, category: 'Automotivo' },
    { name: 'Funis de Venda', tags: ['funis', 'venda', 'funil', 'marketing'], trending: true, icon: TrendingUp, category: 'Marketing Digital e Vendas' },
    { name: 'Futebol (Técnica e Tática)', tags: ['futebol', 'técnica', 'tática', 'esporte'], trending: false, icon: Trophy, category: 'Esportes' },
    { name: 'Futsal', tags: ['futsal', 'futebol', 'salão', 'esporte'], trending: false, icon: Trophy, category: 'Esportes' },
    
    // G
    { name: 'Gaita', tags: ['gaita', 'música', 'instrumento', 'harmônica'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Gamificação de Produtos', tags: ['gamificação', 'produtos', 'gamification', 'engajamento'], trending: false, icon: Gamepad2, category: 'Design e Criação' },
    { name: 'Gamificação em Marketing', tags: ['gamificação', 'marketing', 'engajamento', 'games'], trending: false, icon: Gamepad2, category: 'Marketing Digital e Vendas' },
    { name: 'Garçom e Etiqueta de Serviço', tags: ['garçom', 'etiqueta', 'serviço', 'restaurante'], trending: false, icon: Utensils, category: 'Gastronomia' },
    { name: 'Gatilhos Mentais', tags: ['gatilhos', 'mentais', 'persuasão', 'vendas'], trending: true, icon: Brain, category: 'Marketing Digital e Vendas' },
    { name: 'Genealogia (Árvore Genealógica)', tags: ['genealogia', 'árvore', 'genealógica', 'família'], trending: false, icon: Users, category: 'Hobbies' },
    { name: 'Genética (Conceitos)', tags: ['genética', 'conceitos', 'dna', 'biologia'], trending: false, icon: TestTube, category: 'Ciências' },
    { name: 'Geografia', tags: ['geografia', 'mundo', 'continentes', 'países'], trending: false, icon: Globe, category: 'Ciências e Geografia' },
    { name: 'Geologia e Mineralogia', tags: ['geologia', 'mineralogia', 'rochas', 'minerais'], trending: false, icon: Pickaxe, category: 'Ciências' },
    { name: 'Geopolítica', tags: ['geopolítica', 'política', 'internacional', 'mundo'], trending: false, icon: Globe, category: 'Política e Sociedade' },
    { name: 'Geoprocessamento', tags: ['geoprocessamento', 'gis', 'mapas', 'geografia'], trending: false, icon: MapIcon, category: 'Ciências e Geografia' },
    { name: 'Gerenciamento de Projetos', tags: ['gerenciamento', 'projetos', 'gestão', 'pmi'], trending: true, icon: Briefcase, category: 'Negócios e Empreendedorismo' },
    { name: 'Gerontologia (Cuidado com Idosos)', tags: ['gerontologia', 'cuidado', 'idosos', 'envelhecimento'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Gestão Ágil de Projetos', tags: ['gestão', 'ágil', 'projetos', 'scrum'], trending: true, icon: Rocket, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão Ambiental', tags: ['gestão', 'ambiental', 'meio ambiente', 'sustentabilidade'], trending: false, icon: Leaf, category: 'Agricultura e Meio Ambiente' },
    { name: 'Gestão da Mudança', tags: ['gestão', 'mudança', 'change', 'transformação'], trending: false, icon: TrendingUp, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão da Qualidade Total (TQM)', tags: ['gestão', 'qualidade', 'tqm', 'processos'], trending: false, icon: Award, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão de Ativos', tags: ['gestão', 'ativos', 'patrimônio', 'investimentos'], trending: false, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Gestão de Bares e Restaurantes', tags: ['gestão', 'bares', 'restaurantes', 'gastronomia'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Gestão de Banca (Trading)', tags: ['gestão', 'banca', 'trading', 'risco'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Gestão de Campanhas Publicitárias', tags: ['gestão', 'campanhas', 'publicitárias', 'ads'], trending: true, icon: Megaphone, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Cargos e Salários', tags: ['gestão', 'cargos', 'salários', 'rh'], trending: false, icon: DollarSign, category: 'Recursos Humanos' },
    { name: 'Gestão de Carreiras', tags: ['gestão', 'carreiras', 'desenvolvimento', 'profissional'], trending: false, icon: Target, category: 'Desenvolvimento Pessoal' },
    { name: 'Gestão de Clientes', tags: ['gestão', 'clientes', 'crm', 'relacionamento'], trending: true, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Comunidades Online', tags: ['gestão', 'comunidades', 'online', 'community'], trending: true, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Conflitos', tags: ['gestão', 'conflitos', 'mediação', 'resolução'], trending: false, icon: ShieldCheck, category: 'Desenvolvimento Pessoal' },
    { name: 'Gestão de Conteúdo', tags: ['gestão', 'conteúdo', 'content', 'marketing'], trending: true, icon: FileText, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Contratos', tags: ['gestão', 'contratos', 'jurídico', 'empresarial'], trending: false, icon: FileText, category: 'Direito e Jurídico' },
    { name: 'Gestão de Crises de Imagem', tags: ['gestão', 'crises', 'imagem', 'reputação'], trending: false, icon: ShieldCheck, category: 'Comunicação e Mídia' },
    { name: 'Gestão de Custos', tags: ['gestão', 'custos', 'finanças', 'despesas'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Gestão de Equipes', tags: ['gestão', 'equipes', 'liderança', 'time'], trending: true, icon: Users, category: 'Recursos Humanos' },
    { name: 'Gestão de Equipes Remotas', tags: ['gestão', 'equipes', 'remotas', 'home office'], trending: true, icon: Laptop, category: 'Recursos Humanos' },
    { name: 'Gestão de Escritórios de Advocacia', tags: ['gestão', 'escritórios', 'advocacia', 'jurídico'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Gestão de Estoques', tags: ['gestão', 'estoques', 'inventário', 'logística'], trending: false, icon: Package, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão de Eventos', tags: ['gestão', 'eventos', 'organização', 'planejamento'], trending: false, icon: Calendar, category: 'Eventos' },
    { name: 'Gestão de Facilities', tags: ['gestão', 'facilities', 'predial', 'manutenção'], trending: false, icon: Building, category: 'Administração' },
    { name: 'Gestão de Frotas', tags: ['gestão', 'frotas', 'veículos', 'logística'], trending: false, icon: Truck, category: 'Administração' },
    { name: 'Gestão de Hospitais', tags: ['gestão', 'hospitais', 'saúde', 'administração'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Gestão de Hotéis', tags: ['gestão', 'hotéis', 'hotelaria', 'hospedagem'], trending: false, icon: Building, category: 'Turismo e Hotelaria' },
    { name: 'Gestão de Indicadores (KPIs)', tags: ['gestão', 'indicadores', 'kpis', 'métricas'], trending: true, icon: BarChart3, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão de Inovação', tags: ['gestão', 'inovação', 'criatividade', 'transformação'], trending: false, icon: Lightbulb, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão de Lojas Virtuais', tags: ['gestão', 'lojas', 'virtuais', 'e-commerce'], trending: true, icon: Store, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Marcas (Branding)', tags: ['gestão', 'marcas', 'branding', 'identidade'], trending: true, icon: Award, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Marcas de Moda', tags: ['gestão', 'marcas', 'moda', 'fashion'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Gestão de Orçamento (Mídia Paga)', tags: ['gestão', 'orçamento', 'mídia', 'paga'], trending: true, icon: DollarSign, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Pessoas', tags: ['gestão', 'pessoas', 'rh', 'recursos humanos'], trending: true, icon: Users, category: 'Recursos Humanos' },
    { name: 'Gestão de Processos de Negócio (BPM)', tags: ['gestão', 'processos', 'bpm', 'negócio'], trending: false, icon: Settings, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão de Produtos', tags: ['gestão', 'produtos', 'product', 'management'], trending: true, icon: Package, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão de Projetos', tags: ['gestão', 'projetos', 'gerenciamento', 'pmi'], trending: true, icon: Briefcase, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão de Projetos com Asana', tags: ['gestão', 'projetos', 'asana', 'ferramenta'], trending: false, icon: CheckCircle2, category: 'Produtividade' },
    { name: 'Gestão de Projetos com Trello', tags: ['gestão', 'projetos', 'trello', 'kanban'], trending: false, icon: Layers, category: 'Produtividade' },
    { name: 'Gestão de Redes Sociais', tags: ['gestão', 'redes', 'sociais', 'social media'], trending: true, icon: Share2, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Reputação Online', tags: ['gestão', 'reputação', 'online', 'imagem'], trending: false, icon: Award, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Restaurantes', tags: ['gestão', 'restaurantes', 'gastronomia', 'administração'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Gestão de Riscos', tags: ['gestão', 'riscos', 'análise', 'prevenção'], trending: false, icon: ShieldCheck, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão de Saúde e Segurança no Trabalho', tags: ['gestão', 'saúde', 'segurança', 'trabalho'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'Gestão de Serviços de TI (ITIL)', tags: ['gestão', 'serviços', 'ti', 'itil'], trending: false, icon: Server, category: 'Programação e Tecnologia' },
    { name: 'Gestão de Tempo com a Matriz de Eisenhower', tags: ['gestão', 'tempo', 'eisenhower', 'produtividade'], trending: false, icon: Target, category: 'Produtividade' },
    { name: 'Gestão de Tráfego para Lançamentos', tags: ['gestão', 'tráfego', 'lançamentos', 'ads'], trending: true, icon: Rocket, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Vendas', tags: ['gestão', 'vendas', 'sales', 'comercial'], trending: true, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Gestão de Voluntários', tags: ['gestão', 'voluntários', 'ongs', 'social'], trending: false, icon: Heart, category: 'Social' },
    { name: 'Gestão do Conhecimento', tags: ['gestão', 'conhecimento', 'km', 'informação'], trending: false, icon: BookOpen, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão do Tempo', tags: ['gestão', 'tempo', 'produtividade', 'organização'], trending: true, icon: Target, category: 'Produtividade' },
    { name: 'Gestão Estratégica', tags: ['gestão', 'estratégica', 'planejamento', 'negócios'], trending: false, icon: Target, category: 'Negócios e Empreendedorismo' },
    { name: 'Gestão Financeira', tags: ['gestão', 'financeira', 'finanças', 'controle'], trending: true, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Gestão Financeira para Pequenas Empresas', tags: ['gestão', 'financeira', 'pequenas', 'empresas'], trending: false, icon: Briefcase, category: 'Finanças e Investimentos' },
    { name: 'Gestão Hoteleira', tags: ['gestão', 'hoteleira', 'hotel', 'hospitalidade'], trending: false, icon: Building, category: 'Turismo e Hotelaria' },
    { name: 'Gestão Pública', tags: ['gestão', 'pública', 'governo', 'administração'], trending: false, icon: Building, category: 'Administração' },
    { name: 'Gestão Tributária', tags: ['gestão', 'tributária', 'impostos', 'tributos'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Git e Github', tags: ['git', 'github', 'versionamento', 'código'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Gnosticismo', tags: ['gnosticismo', 'religião', 'espiritualidade', 'gnose'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Google Ads (Rede de Display)', tags: ['google', 'ads', 'display', 'anúncios'], trending: true, icon: Globe, category: 'Marketing Digital e Vendas' },
    { name: 'Google Ads (Rede de Pesquisa)', tags: ['google', 'ads', 'pesquisa', 'search'], trending: true, icon: Search, category: 'Marketing Digital e Vendas' },
    { name: 'Google Ads para Afiliados', tags: ['google', 'ads', 'afiliados', 'marketing'], trending: true, icon: DollarSign, category: 'Marketing Digital e Vendas' },
    { name: 'Google Analytics 4 (GA4)', tags: ['google', 'analytics', 'ga4', 'métricas'], trending: true, icon: BarChart3, category: 'Marketing Digital e Vendas' },
    { name: 'Google Cloud', tags: ['google', 'cloud', 'nuvem', 'gcp'], trending: false, icon: Cloud, category: 'Programação e Tecnologia' },
    { name: 'Google Docs', tags: ['google', 'docs', 'documentos', 'texto'], trending: false, icon: FileText, category: 'Produtividade' },
    { name: 'Google Meu Negócio', tags: ['google', 'meu', 'negócio', 'local'], trending: true, icon: Store, category: 'Marketing Digital e Vendas' },
    { name: 'Google Sheets (Planilhas)', tags: ['google', 'sheets', 'planilhas', 'dados'], trending: true, icon: FileText, category: 'Produtividade' },
    { name: 'Google Shopping', tags: ['google', 'shopping', 'e-commerce', 'produtos'], trending: true, icon: ShoppingBag, category: 'Marketing Digital e Vendas' },
    { name: 'Google Slides', tags: ['google', 'slides', 'apresentações', 'slides'], trending: false, icon: Layout, category: 'Produtividade' },
    { name: 'Google Tag Manager (GTM)', tags: ['google', 'tag', 'manager', 'gtm'], trending: true, icon: Code, category: 'Marketing Digital e Vendas' },
    { name: 'Grafite e Arte de Rua', tags: ['grafite', 'arte', 'rua', 'street art'], trending: false, icon: Paintbrush, category: 'Arte e Cultura' },
    { name: 'Grafologia', tags: ['grafologia', 'escrita', 'caligrafia', 'análise'], trending: false, icon: PenLine, category: 'Hobbies' },
    { name: 'Grego Koiné', tags: ['grego', 'koiné', 'idioma', 'bíblico'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Growth Hacking', tags: ['growth', 'hacking', 'crescimento', 'startup'], trending: true, icon: Rocket, category: 'Marketing Digital e Vendas' },
    { name: 'GTD (Getting Things Done)', tags: ['gtd', 'getting things done', 'produtividade', 'método'], trending: false, icon: CheckCircle2, category: 'Produtividade' },
    { name: 'Guitarra', tags: ['guitarra', 'música', 'instrumento', 'cordas'], trending: false, icon: Guitar, category: 'Dança e Música' },
    
    // H
    { name: 'Hábito e Disciplina', tags: ['hábito', 'disciplina', 'rotina', 'desenvolvimento'], trending: false, icon: Target, category: 'Desenvolvimento Pessoal' },
    { name: 'Hadoop', tags: ['hadoop', 'big data', 'dados', 'tecnologia'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Hambúrguer Artesanal', tags: ['hambúrguer', 'artesanal', 'burger', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Handebol', tags: ['handebol', 'esporte', 'jogo', 'handball'], trending: false, icon: Trophy, category: 'Esportes' },
    { name: 'Hebraico Bíblico', tags: ['hebraico', 'bíblico', 'idioma', 'hebrew'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Heráldica', tags: ['heráldica', 'brasões', 'símbolos', 'história'], trending: false, icon: Flag, category: 'Hobbies' },
    { name: 'Hermenêutica', tags: ['hermenêutica', 'interpretação', 'texto', 'bíblica'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Hidráulica Residencial', tags: ['hidráulica', 'residencial', 'encanamento', 'água'], trending: false, icon: Wrench, category: 'Habilidades Manuais' },
    { name: 'Hidroginástica', tags: ['hidroginástica', 'piscina', 'exercício', 'água'], trending: false, icon: Droplets, category: 'Saúde e Bem-Estar' },
    { name: 'Hidroponia', tags: ['hidroponia', 'cultivo', 'água', 'plantas'], trending: false, icon: Leaf, category: 'Agricultura e Meio Ambiente' },
    { name: 'Higiene Ocupacional', tags: ['higiene', 'ocupacional', 'saúde', 'trabalho'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'Hinduísmo', tags: ['hinduísmo', 'religião', 'espiritualidade', 'índia'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Hipnose Clínica', tags: ['hipnose', 'clínica', 'terapia', 'hipnoterapia'], trending: false, icon: Brain, category: 'Saúde e Bem-Estar' },
    { name: 'História da Arte', tags: ['história', 'arte', 'cultura', 'artística'], trending: false, icon: Paintbrush, category: 'Arte e Cultura' },
    { name: 'História da Igreja', tags: ['história', 'igreja', 'cristianismo', 'religião'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'História da Moda', tags: ['história', 'moda', 'fashion', 'vestuário'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'História das Religiões', tags: ['história', 'religiões', 'fé', 'espiritualidade'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'História do Brasil', tags: ['história', 'brasil', 'brasileiro', 'país'], trending: false, icon: BookOpen, category: 'Ciências Humanas' },
    { name: 'História do Cinema', tags: ['história', 'cinema', 'filmes', 'movies'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'História Mundial', tags: ['história', 'mundial', 'mundo', 'universal'], trending: false, icon: Globe, category: 'Ciências Humanas' },
    { name: 'Homeopatia (Princípios)', tags: ['homeopatia', 'princípios', 'terapia', 'medicina'], trending: false, icon: TestTube, category: 'Saúde e Bem-Estar' },
    { name: 'Homilética (Pregação)', tags: ['homilética', 'pregação', 'sermão', 'igreja'], trending: false, icon: Mic, category: 'Espiritualidade' },
    { name: 'Homologação e Rescisão', tags: ['homologação', 'rescisão', 'rh', 'trabalhista'], trending: false, icon: FileCheck, category: 'Recursos Humanos' },
    { name: 'Horta em Apartamento', tags: ['horta', 'apartamento', 'urban', 'plantas'], trending: false, icon: Leaf, category: 'Jardinagem' },
    { name: 'Horta Orgânica em Casa', tags: ['horta', 'orgânica', 'casa', 'cultivo'], trending: false, icon: Leaf, category: 'Jardinagem' },
    { name: 'HTML, CSS e JavaScript', tags: ['html', 'css', 'javascript', 'web'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    
    // I
    { name: 'I Ching', tags: ['i ching', 'oráculo', 'sabedoria', 'chinês'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Identidade Visual e Logos', tags: ['identidade', 'visual', 'logos', 'branding'], trending: true, icon: Palette, category: 'Design e Criação' },
    { name: 'Idiomas', tags: ['idiomas', 'línguas', 'aprendizado', 'linguística'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Ifá', tags: ['ifá', 'oráculo', 'candomblé', 'yorubá'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Ikebana (Arranjos Florais Japoneses)', tags: ['ikebana', 'arranjos', 'florais', 'japonês'], trending: false, icon: Flower2, category: 'Arte e Artesanato' },
    { name: 'Iluminação para Fotografia', tags: ['iluminação', 'fotografia', 'luz', 'estúdio'], trending: false, icon: Lightbulb, category: 'Fotografia' },
    { name: 'Iluminação para Vídeo', tags: ['iluminação', 'vídeo', 'luz', 'cinema'], trending: false, icon: Lightbulb, category: 'Design e Criação' },
    { name: 'Ilustração Publicitária', tags: ['ilustração', 'publicitária', 'propaganda', 'arte'], trending: false, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Ilustração Digital', tags: ['ilustração', 'digital', 'desenho', 'arte'], trending: true, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Impressão 3D', tags: ['impressão', '3d', 'tecnologia', 'prototipagem'], trending: false, icon: Box, category: 'Tecnologia' },
    { name: 'Imposto de Renda', tags: ['imposto', 'renda', 'ir', 'declaração'], trending: true, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Inbound Marketing', tags: ['inbound', 'marketing', 'conteúdo', 'atração'], trending: true, icon: Megaphone, category: 'Marketing Digital e Vendas' },
    { name: 'Indústria 4.0', tags: ['indústria', '4.0', 'automação', 'tecnologia'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Influência e Persuasão', tags: ['influência', 'persuasão', 'comunicação', 'vendas'], trending: false, icon: Brain, category: 'Desenvolvimento Pessoal' },
    { name: 'Inglês', tags: ['inglês', 'idioma', 'língua', 'english'], trending: true, icon: Languages, category: 'Idiomas' },
    { name: 'Inglês (Do Básico ao Avançado)', tags: ['inglês', 'básico', 'avançado', 'completo'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Inglês para Entrevistas de Emprego', tags: ['inglês', 'entrevistas', 'emprego', 'carreira'], trending: false, icon: Briefcase, category: 'Idiomas' },
    { name: 'Inglês para Negócios (Business English)', tags: ['inglês', 'negócios', 'business', 'empresarial'], trending: true, icon: Briefcase, category: 'Idiomas' },
    { name: 'Inglês para Viagens', tags: ['inglês', 'viagens', 'turismo', 'travel'], trending: false, icon: Plane, category: 'Idiomas' },
    { name: 'Inovação e Intraempreendedorismo', tags: ['inovação', 'intraempreendedorismo', 'criatividade', 'empresa'], trending: false, icon: Lightbulb, category: 'Negócios e Empreendedorismo' },
    { name: 'Inspeção de Qualidade', tags: ['inspeção', 'qualidade', 'controle', 'normas'], trending: false, icon: CheckCircle2, category: 'Engenharia' },
    { name: 'Instalação de Ar Condicionado', tags: ['instalação', 'ar condicionado', 'climatização', 'hvac'], trending: false, icon: Wind, category: 'Habilidades Manuais' },
    { name: 'Instalação de Som Automotivo', tags: ['instalação', 'som', 'automotivo', 'carro'], trending: false, icon: Radio, category: 'Automotivo' },
    { name: 'Instrumentação Cirúrgica', tags: ['instrumentação', 'cirúrgica', 'saúde', 'cirurgia'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Inteligência Artificial', tags: ['inteligência', 'artificial', 'ia', 'machine learning'], trending: true, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Inteligência Artificial para Desenvolvedores', tags: ['inteligência', 'artificial', 'desenvolvedores', 'ia'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Inteligência Artificial para Designers', tags: ['inteligência', 'artificial', 'designers', 'ia'], trending: true, icon: Palette, category: 'Design e Criação' },
    { name: 'Inteligência Artificial para Negócios', tags: ['inteligência', 'artificial', 'negócios', 'ia'], trending: true, icon: Briefcase, category: 'Negócios e Empreendedorismo' },
    { name: 'Inteligência Artificial para Escritores', tags: ['inteligência', 'artificial', 'escritores', 'ia'], trending: true, icon: PenLine, category: 'Literatura e Escrita' },
    { name: 'Inteligência Competitiva', tags: ['inteligência', 'competitiva', 'mercado', 'análise'], trending: false, icon: SearchIcon, category: 'Negócios e Empreendedorismo' },
    { name: 'Inteligência de Mercado', tags: ['inteligência', 'mercado', 'análise', 'dados'], trending: false, icon: BarChart3, category: 'Negócios e Empreendedorismo' },
    { name: 'Inteligência Emocional', tags: ['inteligência', 'emocional', 'ie', 'emoções'], trending: true, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Inteligência Financeira', tags: ['inteligência', 'financeira', 'dinheiro', 'finanças'], trending: true, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Inteligência Geográfica', tags: ['inteligência', 'geográfica', 'gis', 'localização'], trending: false, icon: MapIcon, category: 'Ciências e Geografia' },
    { name: 'Interpretação de Exames Laboratoriais', tags: ['interpretação', 'exames', 'laboratoriais', 'saúde'], trending: false, icon: TestTube, category: 'Saúde e Bem-Estar' },
    { name: 'Intraempreendedorismo', tags: ['intraempreendedorismo', 'inovação', 'empresa', 'empreender'], trending: false, icon: Lightbulb, category: 'Negócios e Empreendedorismo' },
    { name: 'Introdução Alimentar (BLW)', tags: ['introdução', 'alimentar', 'blw', 'bebê'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Investigação de Acidentes', tags: ['investigação', 'acidentes', 'segurança', 'análise'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'Investigação de Fraudes Corporativas', tags: ['investigação', 'fraudes', 'corporativas', 'auditoria'], trending: false, icon: Search, category: 'Direito e Jurídico' },
    { name: 'Investigação de Paranormalidade', tags: ['investigação', 'paranormalidade', 'fantasmas', 'sobrenatural'], trending: false, icon: Sparkles, category: 'Hobbies' },
    { name: 'Investigação Particular', tags: ['investigação', 'particular', 'detetive', 'investigador'], trending: false, icon: Search, category: 'Segurança' },
    { name: 'Investimentos (Ações, Renda Fixa e Fundos)', tags: ['investimentos', 'ações', 'renda fixa', 'fundos'], trending: true, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Investimentos no Exterior', tags: ['investimentos', 'exterior', 'internacional', 'offshore'], trending: false, icon: Globe, category: 'Finanças e Investimentos' },
    { name: 'Investimentos para Iniciantes', tags: ['investimentos', 'iniciantes', 'começar', 'finanças'], trending: true, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'IoT (Internet das Coisas)', tags: ['iot', 'internet', 'coisas', 'tecnologia'], trending: false, icon: Wifi, category: 'Programação e Tecnologia' },
    { name: 'Iridologia', tags: ['iridologia', 'íris', 'diagnóstico', 'terapia'], trending: false, icon: Eye, category: 'Saúde e Bem-Estar' },
    { name: 'Islamismo', tags: ['islamismo', 'islã', 'religião', 'muçulmano'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'ISO 14001', tags: ['iso', '14001', 'ambiental', 'gestão'], trending: false, icon: Leaf, category: 'Engenharia' },
    { name: 'ISO 9001', tags: ['iso', '9001', 'qualidade', 'gestão'], trending: false, icon: Award, category: 'Engenharia' },
    { name: 'Italiano', tags: ['italiano', 'idioma', 'língua', 'italian'], trending: false, icon: Languages, category: 'Idiomas' },
    
    // J
    { name: 'Japonês', tags: ['japonês', 'idioma', 'língua', 'japanese'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Jardinagem e Paisagismo', tags: ['jardinagem', 'paisagismo', 'plantas', 'jardim'], trending: false, icon: TreePine, category: 'Jardinagem' },
    { name: 'Java para Web', tags: ['java', 'web', 'programação', 'desenvolvimento'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Java para Sistemas Corporativos', tags: ['java', 'sistemas', 'corporativos', 'empresarial'], trending: false, icon: Briefcase, category: 'Programação e Tecnologia' },
    { name: 'Jejum Intermitente', tags: ['jejum', 'intermitente', 'dieta', 'saúde'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    { name: 'Jiu-Jitsu', tags: ['jiu-jitsu', 'luta', 'artes marciais', 'esporte'], trending: false, icon: Dumbbell, category: 'Esportes' },
    { name: 'Jornada do Cliente', tags: ['jornada', 'cliente', 'customer', 'journey'], trending: true, icon: MapIcon, category: 'Marketing Digital e Vendas' },
    { name: 'Jornalismo de Dados', tags: ['jornalismo', 'dados', 'data journalism', 'análise'], trending: false, icon: BarChart3, category: 'Comunicação e Mídia' },
    { name: 'Jornalismo de Moda', tags: ['jornalismo', 'moda', 'fashion', 'editorial'], trending: false, icon: Scissors, category: 'Comunicação e Mídia' },
    { name: 'Jornalismo Digital', tags: ['jornalismo', 'digital', 'online', 'notícias'], trending: false, icon: Globe, category: 'Comunicação e Mídia' },
    { name: 'Jornalismo Investigativo', tags: ['jornalismo', 'investigativo', 'reportagem', 'apuração'], trending: false, icon: Search, category: 'Comunicação e Mídia' },
    { name: 'Judaísmo', tags: ['judaísmo', 'judeu', 'religião', 'torah'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Judô', tags: ['judô', 'luta', 'artes marciais', 'esporte'], trending: false, icon: Dumbbell, category: 'Esportes' },
    
    // K
    { name: 'Kaizen (Melhoria Contínua)', tags: ['kaizen', 'melhoria', 'contínua', 'qualidade'], trending: false, icon: TrendingUp, category: 'Negócios e Empreendedorismo' },
    { name: 'Kanban', tags: ['kanban', 'gestão', 'projetos', 'ágil'], trending: true, icon: Layers, category: 'Produtividade' },
    { name: 'Karatê', tags: ['karatê', 'luta', 'artes marciais', 'esporte'], trending: false, icon: Dumbbell, category: 'Esportes' },
    { name: 'Kirigami', tags: ['kirigami', 'papel', 'arte', 'japonês'], trending: false, icon: Scissors, category: 'Arte e Artesanato' },
    { name: 'Kokedama', tags: ['kokedama', 'plantas', 'jardinagem', 'japonês'], trending: false, icon: Flower2, category: 'Jardinagem' },
    { name: 'Krav Maga', tags: ['krav maga', 'defesa pessoal', 'luta', 'israel'], trending: false, icon: ShieldCheck, category: 'Esportes' },
    
    // L
    { name: 'Laços e Tiaras para Cabelo', tags: ['laços', 'tiaras', 'cabelo', 'artesanato'], trending: false, icon: Sparkle, category: 'Arte e Artesanato' },
    { name: 'Lançamentos de Infoprodutos', tags: ['lançamentos', 'infoprodutos', 'produtos', 'digitais'], trending: true, icon: Rocket, category: 'Marketing Digital e Vendas' },
    { name: 'Lapidação de Gemas', tags: ['lapidação', 'gemas', 'pedras', 'joias'], trending: false, icon: Gem, category: 'Arte e Artesanato' },
    { name: 'Latim Eclesiástico', tags: ['latim', 'eclesiástico', 'igreja', 'idioma'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Lean Manufacturing (Manufatura Enxuta)', tags: ['lean', 'manufacturing', 'produção', 'enxuta'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Lean Startup', tags: ['lean', 'startup', 'metodologia', 'empreendedorismo'], trending: true, icon: Rocket, category: 'Negócios e Empreendedorismo' },
    { name: 'Lean UX', tags: ['lean', 'ux', 'design', 'metodologia'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Leitura de Aura', tags: ['leitura', 'aura', 'energia', 'espiritualidade'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Leitura Dinâmica', tags: ['leitura', 'dinâmica', 'rápida', 'técnica'], trending: false, icon: BookOpen, category: 'Desenvolvimento Pessoal' },
    { name: 'Leitura e Interpretação de Desenho Técnico', tags: ['leitura', 'desenho', 'técnico', 'engenharia'], trending: false, icon: Ruler, category: 'Engenharia' },
    { name: 'Legislação Ambiental', tags: ['legislação', 'ambiental', 'leis', 'meio ambiente'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Legislação Trabalhista e Previdenciária', tags: ['legislação', 'trabalhista', 'previdenciária', 'leis'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Lettering', tags: ['lettering', 'caligrafia', 'escrita', 'arte'], trending: false, icon: PenLine, category: 'Design e Criação' },
    { name: 'Lettering em Paredes', tags: ['lettering', 'paredes', 'muralismo', 'arte'], trending: false, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Libras', tags: ['libras', 'língua', 'sinais', 'acessibilidade'], trending: false, icon: Users, category: 'Idiomas' },
    { name: 'Licenciamento Ambiental', tags: ['licenciamento', 'ambiental', 'meio ambiente', 'gestão'], trending: false, icon: FileCheck, category: 'Engenharia' },
    { name: 'Licitações e Contratos Administrativos', tags: ['licitações', 'contratos', 'administrativos', 'público'], trending: false, icon: FileText, category: 'Direito e Jurídico' },
    { name: 'Liderança', tags: ['liderança', 'gestão', 'líder', 'equipe'], trending: true, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Liderança de Equipes Remotas', tags: ['liderança', 'equipes', 'remotas', 'home office'], trending: true, icon: Laptop, category: 'Recursos Humanos' },
    { name: 'Liderança e Gestão de Equipes', tags: ['liderança', 'gestão', 'equipes', 'time'], trending: true, icon: Users, category: 'Recursos Humanos' },
    { name: 'Linguagem Corporal', tags: ['linguagem', 'corporal', 'body language', 'comunicação'], trending: false, icon: Users, category: 'Comunicação e Mídia' },
    { name: 'Linguagem de Programação R', tags: ['linguagem', 'programação', 'r', 'estatística'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'LinkedIn Ads', tags: ['linkedin', 'ads', 'anúncios', 'b2b'], trending: true, icon: Briefcase, category: 'Marketing Digital e Vendas' },
    { name: 'Linux', tags: ['linux', 'sistema', 'operacional', 'open source'], trending: false, icon: Server, category: 'Programação e Tecnologia' },
    { name: 'Liturgia', tags: ['liturgia', 'igreja', 'culto', 'religião'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Lógica de Programação', tags: ['lógica', 'programação', 'algoritmos', 'código'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Logística e Cadeia de Suprimentos', tags: ['logística', 'cadeia', 'suprimentos', 'supply chain'], trending: false, icon: Truck, category: 'Negócios e Empreendedorismo' },
    { name: 'Logística para E-commerce', tags: ['logística', 'e-commerce', 'entrega', 'fulfillment'], trending: true, icon: Package, category: 'Marketing Digital e Vendas' },
    { name: 'Logística Reversa', tags: ['logística', 'reversa', 'retorno', 'sustentável'], trending: false, icon: Truck, category: 'Engenharia' },
    { name: 'Locução e Dublagem', tags: ['locução', 'dublagem', 'voz', 'áudio'], trending: false, icon: Mic, category: 'Comunicação e Mídia' },
    { name: 'Luto e Perdas', tags: ['luto', 'perdas', 'morte', 'terapia'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    
    // M
    { name: 'Macramê', tags: ['macramê', 'artesanato', 'nós', 'decoração'], trending: false, icon: Scissors, category: 'Arte e Artesanato' },
    { name: 'Maçonaria (História e Filosofia)', tags: ['maçonaria', 'história', 'filosofia', 'sociedade'], trending: false, icon: BookOpen, category: 'Hobbies' },
    { name: 'Mágica e Ilusionismo', tags: ['mágica', 'ilusionismo', 'truques', 'entretenimento'], trending: false, icon: Sparkle, category: 'Arte e Cultura' },
    { name: 'Mamografia', tags: ['mamografia', 'exame', 'saúde', 'mama'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    { name: 'Mandarim', tags: ['mandarim', 'chinês', 'idioma', 'língua'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Manicure e Nail Design', tags: ['manicure', 'nail', 'design', 'unhas'], trending: false, icon: Sparkle, category: 'Moda e Beleza' },
    { name: 'Manipulação de Imagens em Photoshop', tags: ['manipulação', 'imagens', 'photoshop', 'edição'], trending: true, icon: Image, category: 'Design e Criação' },
    { name: 'Manufatura Aditiva (Impressão 3D Industrial)', tags: ['manufatura', 'aditiva', 'impressão', '3d'], trending: false, icon: Box, category: 'Engenharia' },
    { name: 'Manutenção de Celulares', tags: ['manutenção', 'celulares', 'reparo', 'smartphone'], trending: false, icon: Smartphone, category: 'Tecnologia' },
    { name: 'Manutenção de Computadores', tags: ['manutenção', 'computadores', 'reparo', 'hardware'], trending: false, icon: Laptop, category: 'Tecnologia' },
    { name: 'Manutenção de Drones', tags: ['manutenção', 'drones', 'reparo', 'tecnologia'], trending: false, icon: Camera, category: 'Tecnologia' },
    { name: 'Manutenção de Piscinas', tags: ['manutenção', 'piscinas', 'limpeza', 'tratamento'], trending: false, icon: Droplets, category: 'Habilidades Manuais' },
    { name: 'Manutenção de Videogames', tags: ['manutenção', 'videogames', 'consoles', 'reparo'], trending: false, icon: Gamepad2, category: 'Tecnologia' },
    { name: 'Manutenção Elétrica Industrial', tags: ['manutenção', 'elétrica', 'industrial', 'eletricidade'], trending: false, icon: Zap, category: 'Engenharia' },
    { name: 'Manutenção Mecânica Industrial', tags: ['manutenção', 'mecânica', 'industrial', 'máquinas'], trending: false, icon: Settings, category: 'Engenharia' },
    { name: 'Manutenção Preditiva', tags: ['manutenção', 'preditiva', 'preventiva', 'análise'], trending: false, icon: Activity, category: 'Engenharia' },
    { name: 'Mapas Mentais', tags: ['mapas', 'mentais', 'mind map', 'organização'], trending: false, icon: Brain, category: 'Produtividade' },
    { name: 'Maquiagem Artística', tags: ['maquiagem', 'artística', 'makeup', 'arte'], trending: false, icon: Paintbrush, category: 'Moda e Beleza' },
    { name: 'Maquiagem Profissional', tags: ['maquiagem', 'profissional', 'makeup', 'beleza'], trending: false, icon: Sparkle, category: 'Moda e Beleza' },
    { name: 'Marcenaria', tags: ['marcenaria', 'madeira', 'móveis', 'carpintaria'], trending: false, icon: Hammer, category: 'Habilidades Manuais' },
    { name: 'Marcenaria com Paletes', tags: ['marcenaria', 'paletes', 'madeira', 'reciclagem'], trending: false, icon: Hammer, category: 'Habilidades Manuais' },
    { name: 'Marketing B2B (Business-to-Business)', tags: ['marketing', 'b2b', 'business', 'empresarial'], trending: false, icon: Briefcase, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Afiliados', tags: ['marketing', 'afiliados', 'afiliado', 'vendas'], trending: true, icon: DollarSign, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Conteúdo', tags: ['marketing', 'conteúdo', 'content', 'estratégia'], trending: false, icon: FileText, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Experiência', tags: ['marketing', 'experiência', 'experiencial', 'eventos'], trending: false, icon: Sparkle, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Guerrilha', tags: ['marketing', 'guerrilha', 'criativo', 'inovador'], trending: false, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Influência', tags: ['marketing', 'influência', 'influencers', 'creators'], trending: true, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Luxo', tags: ['marketing', 'luxo', 'premium', 'alto padrão'], trending: false, icon: Award, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Nicho', tags: ['marketing', 'nicho', 'segmentação', 'especializado'], trending: true, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Performance', tags: ['marketing', 'performance', 'resultados', 'roi'], trending: true, icon: TrendingUp, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Relacionamento', tags: ['marketing', 'relacionamento', 'crm', 'clientes'], trending: true, icon: Heart, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing de Serviços', tags: ['marketing', 'serviços', 'prestadores', 'negócios'], trending: false, icon: Briefcase, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing Digital', tags: ['marketing', 'digital', 'online', 'internet'], trending: true, icon: Globe, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing Digital para Iniciantes', tags: ['marketing', 'digital', 'iniciantes', 'básico'], trending: false, icon: Rocket, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing Esportivo', tags: ['marketing', 'esportivo', 'esportes', 'patrocínio'], trending: false, icon: Trophy, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing Jurídico Ético', tags: ['marketing', 'jurídico', 'ético', 'advogados'], trending: false, icon: Scale, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Advogados', tags: ['marketing', 'advogados', 'jurídico', 'direito'], trending: false, icon: Scale, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Arquitetos', tags: ['marketing', 'arquitetos', 'arquitetura', 'projeto'], trending: false, icon: Building, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Artistas', tags: ['marketing', 'artistas', 'arte', 'divulgação'], trending: false, icon: Paintbrush, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Delivery', tags: ['marketing', 'delivery', 'entrega', 'restaurante'], trending: true, icon: Utensils, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para E-commerce', tags: ['marketing', 'e-commerce', 'loja', 'online'], trending: true, icon: ShoppingBag, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Fotógrafos', tags: ['marketing', 'fotógrafos', 'fotografia', 'clientes'], trending: false, icon: Camera, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Lançamentos de Música', tags: ['marketing', 'lançamentos', 'música', 'artistas'], trending: false, icon: Music, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Médicos', tags: ['marketing', 'médicos', 'saúde', 'consultório'], trending: false, icon: Stethoscope, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Músicos', tags: ['marketing', 'músicos', 'música', 'carreira'], trending: false, icon: Music, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Negócios Locais', tags: ['marketing', 'negócios', 'locais', 'local'], trending: true, icon: Store, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Prestadores de Serviço', tags: ['marketing', 'prestadores', 'serviço', 'profissionais'], trending: true, icon: Wrench, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Profissionais da Saúde', tags: ['marketing', 'profissionais', 'saúde', 'médicos'], trending: false, icon: Stethoscope, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing para Restaurantes', tags: ['marketing', 'restaurantes', 'gastronomia', 'delivery'], trending: true, icon: ChefHat, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing Político Digital', tags: ['marketing', 'político', 'digital', 'campanha'], trending: false, icon: Flag, category: 'Marketing Digital e Vendas' },
    { name: 'Marketing Sazonal', tags: ['marketing', 'sazonal', 'datas', 'comemorativas'], trending: false, icon: Calendar, category: 'Marketing Digital e Vendas' },
    { name: 'Massagem Modeladora', tags: ['massagem', 'modeladora', 'estética', 'corpo'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Massagem Relaxante', tags: ['massagem', 'relaxante', 'terapia', 'bem-estar'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Massoterapia', tags: ['massoterapia', 'massagem', 'terapia', 'corpo'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Matemática Financeira', tags: ['matemática', 'financeira', 'juros', 'cálculos'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Matemática para o ENEM', tags: ['matemática', 'enem', 'vestibular', 'estudos'], trending: false, icon: Calculator, category: 'Educação' },
    { name: 'Media Training', tags: ['media', 'training', 'mídia', 'comunicação'], trending: false, icon: Tv, category: 'Comunicação e Mídia' },
    { name: 'Mediação e Arbitragem', tags: ['mediação', 'arbitragem', 'conflitos', 'justiça'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Mediação de Conflitos', tags: ['mediação', 'conflitos', 'resolução', 'negociação'], trending: false, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Medicina Chinesa', tags: ['medicina', 'chinesa', 'acupuntura', 'oriental'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    { name: 'Meditação e Mindfulness', tags: ['meditação', 'mindfulness', 'atenção plena', 'bem-estar'], trending: true, icon: Brain, category: 'Desenvolvimento Pessoal' },
    { name: 'Mega Hair', tags: ['mega hair', 'alongamento', 'cabelo', 'beleza'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Melhoria Contínua', tags: ['melhoria', 'contínua', 'kaizen', 'qualidade'], trending: false, icon: TrendingUp, category: 'Negócios e Empreendedorismo' },
    { name: 'Memorização e Aprendizagem Acelerada', tags: ['memorização', 'aprendizagem', 'acelerada', 'estudo'], trending: false, icon: Brain, category: 'Desenvolvimento Pessoal' },
    { name: 'Mentoria Corporativa', tags: ['mentoria', 'corporativa', 'empresa', 'desenvolvimento'], trending: false, icon: Users, category: 'Recursos Humanos' },
    { name: 'Mentoria de Negócios', tags: ['mentoria', 'negócios', 'empreendedorismo', 'consultoria'], trending: true, icon: Briefcase, category: 'Negócios e Empreendedorismo' },
    { name: 'Mercado de Capitais', tags: ['mercado', 'capitais', 'ações', 'investimentos'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Mercado de Criptoativos', tags: ['mercado', 'criptoativos', 'cripto', 'blockchain'], trending: true, icon: Bitcoin, category: 'Finanças e Investimentos' },
    { name: 'Mercado de Opções', tags: ['mercado', 'opções', 'derivativos', 'trading'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Mercado Futuro', tags: ['mercado', 'futuro', 'commodities', 'trading'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Merchandising', tags: ['merchandising', 'ponto', 'venda', 'varejo'], trending: false, icon: Store, category: 'Marketing Digital e Vendas' },
    { name: 'Metafísica', tags: ['metafísica', 'filosofia', 'espiritualidade', 'existência'], trending: false, icon: Sparkles, category: 'Filosofia' },
    { name: 'Método Montessori em Casa', tags: ['método', 'montessori', 'casa', 'educação'], trending: false, icon: Heart, category: 'Educação' },
    { name: 'Metodologias Ágeis', tags: ['metodologias', 'ágeis', 'scrum', 'agile'], trending: true, icon: Rocket, category: 'Programação e Tecnologia' },
    { name: 'Metrologia', tags: ['metrologia', 'medição', 'instrumentos', 'qualidade'], trending: false, icon: Ruler, category: 'Engenharia' },
    { name: 'Mecânica de Automóveis', tags: ['mecânica', 'automóveis', 'carros', 'reparo'], trending: false, icon: Wrench, category: 'Automotivo' },
    { name: 'Mecânica de Motos', tags: ['mecânica', 'motos', 'motocicletas', 'reparo'], trending: false, icon: Wrench, category: 'Automotivo' },
    { name: 'Microagulhamento', tags: ['microagulhamento', 'estética', 'pele', 'tratamento'], trending: false, icon: Activity, category: 'Moda e Beleza' },
    { name: 'Microinterações', tags: ['microinterações', 'ux', 'ui', 'design'], trending: false, icon: Sparkle, category: 'Design e Criação' },
    { name: 'Micropigmentação Labial', tags: ['micropigmentação', 'labial', 'lábios', 'estética'], trending: false, icon: Paintbrush, category: 'Moda e Beleza' },
    { name: 'Micropigmentação de Sobrancelhas', tags: ['micropigmentação', 'sobrancelhas', 'estética', 'beleza'], trending: false, icon: Eye, category: 'Moda e Beleza' },
    { name: 'Midjourney', tags: ['midjourney', 'ia', 'imagens', 'geração'], trending: true, icon: Brain, category: 'Design e Criação' },
    { name: 'Milhas Aéreas', tags: ['milhas', 'aéreas', 'pontos', 'viagens'], trending: false, icon: Plane, category: 'Finanças e Investimentos' },
    { name: 'Minimalismo Digital', tags: ['minimalismo', 'digital', 'desintoxicação', 'tecnologia'], trending: false, icon: Smartphone, category: 'Desenvolvimento Pessoal' },
    { name: 'Mineração de Dados', tags: ['mineração', 'dados', 'data mining', 'análise'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Mineração de Produtos Vencedores', tags: ['mineração', 'produtos', 'vencedores', 'dropshipping'], trending: true, icon: SearchIcon, category: 'Marketing Digital e Vendas' },
    { name: 'Missiologia', tags: ['missiologia', 'missões', 'teologia', 'igreja'], trending: false, icon: Globe, category: 'Espiritualidade' },
    { name: 'Mitologia Comparada', tags: ['mitologia', 'comparada', 'mitos', 'culturas'], trending: false, icon: BookOpen, category: 'Ciências Humanas' },
    { name: 'Mitologia Grega', tags: ['mitologia', 'grega', 'deuses', 'história'], trending: false, icon: BookOpen, category: 'Ciências Humanas' },
    { name: 'Mitologia Nórdica', tags: ['mitologia', 'nórdica', 'vikings', 'deuses'], trending: false, icon: BookOpen, category: 'Ciências Humanas' },
    { name: 'Mixagem e Masterização de Áudio', tags: ['mixagem', 'masterização', 'áudio', 'música'], trending: false, icon: Headphones, category: 'Dança e Música' },
    { name: 'Mobilidade Urbana', tags: ['mobilidade', 'urbana', 'transporte', 'cidade'], trending: false, icon: Bike, category: 'Ciências e Geografia' },
    { name: 'Modelagem 3D', tags: ['modelagem', '3d', 'design', 'criação'], trending: false, icon: Box, category: 'Design e Criação' },
    { name: 'Modelagem 3D com Blender', tags: ['modelagem', '3d', 'blender', 'software'], trending: true, icon: Box, category: 'Design e Criação' },
    { name: 'Modelagem de Roupas', tags: ['modelagem', 'roupas', 'moda', 'costura'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Modelagem de Dados', tags: ['modelagem', 'dados', 'database', 'estrutura'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Modelagem Plus Size', tags: ['modelagem', 'plus size', 'moda', 'inclusiva'], trending: false, icon: Heart, category: 'Moda e Beleza' },
    { name: 'Moda e Estilo', tags: ['moda', 'estilo', 'fashion', 'vestuário'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Moda Íntima', tags: ['moda', 'íntima', 'lingerie', 'underwear'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Moda Infantil', tags: ['moda', 'infantil', 'criança', 'bebê'], trending: false, icon: Heart, category: 'Moda e Beleza' },
    { name: 'Moda Praia', tags: ['moda', 'praia', 'beachwear', 'verão'], trending: false, icon: Droplets, category: 'Moda e Beleza' },
    { name: 'Moda Sustentável', tags: ['moda', 'sustentável', 'ecológica', 'consciente'], trending: false, icon: Leaf, category: 'Moda e Beleza' },
    { name: 'Montanhismo', tags: ['montanhismo', 'escalada', 'montanha', 'aventura'], trending: false, icon: Mountain, category: 'Esportes' },
    { name: 'Mosaico', tags: ['mosaico', 'arte', 'azulejos', 'decoração'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Motion Capture', tags: ['motion', 'capture', 'mocap', 'animação'], trending: false, icon: Video, category: 'Design e Criação' },
    { name: 'Motion Graphics', tags: ['motion', 'graphics', 'animação', 'vídeo'], trending: true, icon: Film, category: 'Design e Criação' },
    { name: 'Muay Thai', tags: ['muay thai', 'luta', 'artes marciais', 'tailandês'], trending: false, icon: Dumbbell, category: 'Esportes' },
    { name: 'Musicoterapia', tags: ['musicoterapia', 'música', 'terapia', 'saúde'], trending: false, icon: Music, category: 'Saúde e Bem-Estar' },
    { name: 'Musculação e Hipertrofia', tags: ['musculação', 'hipertrofia', 'academia', 'treino'], trending: true, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Musculação para Mulheres', tags: ['musculação', 'mulheres', 'feminino', 'treino'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    
    // N
    { name: 'Natação', tags: ['natação', 'piscina', 'esporte', 'natação'], trending: false, icon: Droplets, category: 'Esportes' },
    { name: 'Native Ads (Taboola, Outbrain)', tags: ['native', 'ads', 'taboola', 'outbrain'], trending: false, icon: Globe, category: 'Marketing Digital e Vendas' },
    { name: 'Negociação e Resolução de Conflitos', tags: ['negociação', 'resolução', 'conflitos', 'mediação'], trending: false, icon: Handshake, category: 'Desenvolvimento Pessoal' },
    { name: 'Negociação com Fornecedores', tags: ['negociação', 'fornecedores', 'compras', 'supply'], trending: false, icon: Handshake, category: 'Negócios e Empreendedorismo' },
    { name: 'Neurolinguística', tags: ['neurolinguística', 'linguagem', 'cérebro', 'comunicação'], trending: false, icon: Brain, category: 'Ciências' },
    { name: 'Neuromarketing e Gatilhos Mentais', tags: ['neuromarketing', 'gatilhos', 'mentais', 'persuasão'], trending: true, icon: Brain, category: 'Marketing Digital e Vendas' },
    { name: 'Neuropsicologia', tags: ['neuropsicologia', 'cérebro', 'comportamento', 'psicologia'], trending: false, icon: Brain, category: 'Saúde e Bem-Estar' },
    { name: 'Neurociência e Aprendizagem', tags: ['neurociência', 'aprendizagem', 'cérebro', 'educação'], trending: false, icon: Brain, category: 'Educação' },
    { name: 'NFTs', tags: ['nfts', 'tokens', 'blockchain', 'cripto'], trending: true, icon: Bitcoin, category: 'Finanças e Investimentos' },
    { name: 'No-Code (Desenvolvimento sem Código)', tags: ['no-code', 'desenvolvimento', 'sem código', 'ferramentas'], trending: true, icon: Layout, category: 'Programação e Tecnologia' },
    { name: 'Node.js', tags: ['node.js', 'javascript', 'backend', 'programação'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Normas ABNT', tags: ['normas', 'abnt', 'formatação', 'trabalhos'], trending: false, icon: FileText, category: 'Educação' },
    { name: 'Notion para Produtividade', tags: ['notion', 'produtividade', 'organização', 'ferramenta'], trending: true, icon: Layout, category: 'Produtividade' },
    { name: 'NR-10 (Segurança em Eletricidade)', tags: ['nr-10', 'segurança', 'eletricidade', 'norma'], trending: false, icon: Zap, category: 'Segurança' },
    { name: 'NR-33 (Espaços Confinados)', tags: ['nr-33', 'espaços', 'confinados', 'segurança'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'NR-35 (Trabalho em Altura)', tags: ['nr-35', 'trabalho', 'altura', 'segurança'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'Numerologia', tags: ['numerologia', 'números', 'místico', 'espiritualidade'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Numismática (Coleção de Moedas)', tags: ['numismática', 'coleção', 'moedas', 'hobby'], trending: false, icon: Coins, category: 'Hobbies' },
    { name: 'Nutrição e Dieta Flexível', tags: ['nutrição', 'dieta', 'flexível', 'alimentação'], trending: false, icon: ChefHat, category: 'Saúde e Bem-Estar' },
    { name: 'Nutrição Esportiva', tags: ['nutrição', 'esportiva', 'atletas', 'performance'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Nutrição Funcional', tags: ['nutrição', 'funcional', 'saúde', 'alimentação'], trending: false, icon: Leaf, category: 'Saúde e Bem-Estar' },
    { name: 'NX (Software)', tags: ['nx', 'software', 'cad', 'engenharia'], trending: false, icon: Box, category: 'Engenharia' },
    
    // O
    { name: 'O Jogo da Conquista (Relacionamentos)', tags: ['jogo', 'conquista', 'relacionamentos', 'sedução'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'OBS Studio', tags: ['obs', 'studio', 'streaming', 'gravação'], trending: true, icon: Video, category: 'Comunicação e Mídia' },
    { name: 'Obsidian para Gestão de Conhecimento', tags: ['obsidian', 'gestão', 'conhecimento', 'notas'], trending: false, icon: BookOpen, category: 'Produtividade' },
    { name: 'Onboarding de Novos Colaboradores', tags: ['onboarding', 'novos', 'colaboradores', 'rh'], trending: false, icon: Users, category: 'Recursos Humanos' },
    { name: 'Operador de Empilhadeira', tags: ['operador', 'empilhadeira', 'logística', 'armazém'], trending: false, icon: Truck, category: 'Habilidades Manuais' },
    { name: 'Oratória e Comunicação', tags: ['oratória', 'comunicação', 'falar', 'público'], trending: true, icon: Mic, category: 'Comunicação e Mídia' },
    { name: 'Oratória para Advogados', tags: ['oratória', 'advogados', 'tribunal', 'jurídico'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Orçamento Empresarial', tags: ['orçamento', 'empresarial', 'finanças', 'planejamento'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Orçamento Familiar', tags: ['orçamento', 'familiar', 'finanças', 'casa'], trending: false, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Orçamento Público', tags: ['orçamento', 'público', 'governo', 'gestão'], trending: false, icon: Building, category: 'Administração' },
    { name: 'Organização de Casamentos', tags: ['organização', 'casamentos', 'eventos', 'wedding'], trending: false, icon: Heart, category: 'Eventos' },
    { name: 'Organização de Eventos', tags: ['organização', 'eventos', 'planejamento', 'festas'], trending: false, icon: Calendar, category: 'Eventos' },
    { name: 'Organização de Guarda-Roupa', tags: ['organização', 'guarda-roupa', 'closet', 'roupas'], trending: false, icon: Home, category: 'Desenvolvimento Pessoal' },
    { name: 'Organização de Reuniões Produtivas', tags: ['organização', 'reuniões', 'produtivas', 'eficiência'], trending: false, icon: Users, category: 'Produtividade' },
    { name: 'Origami', tags: ['origami', 'papel', 'arte', 'japonês'], trending: false, icon: Scissors, category: 'Arte e Artesanato' },
    { name: 'Ornitologia (Observação de Pássaros)', tags: ['ornitologia', 'observação', 'pássaros', 'aves'], trending: false, icon: Eye, category: 'Hobbies' },
    { name: 'Ourivesaria', tags: ['ourivesaria', 'joias', 'ouro', 'artesanato'], trending: false, icon: Gem, category: 'Arte e Artesanato' },
    { name: 'Outbound Marketing', tags: ['outbound', 'marketing', 'vendas', 'prospecção'], trending: false, icon: Megaphone, category: 'Marketing Digital e Vendas' },
    { name: 'Ovos de Páscoa Artesanais', tags: ['ovos', 'páscoa', 'artesanais', 'chocolate'], trending: false, icon: Heart, category: 'Gastronomia' },
    
    // P
    { name: 'Pacote Office Completo', tags: ['pacote', 'office', 'microsoft', 'computador'], trending: true, icon: Laptop, category: 'Produtividade' },
    { name: 'Padeiro', tags: ['padeiro', 'pão', 'padaria', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Paisagismo', tags: ['paisagismo', 'jardim', 'plantas', 'design'], trending: false, icon: TreePine, category: 'Jardinagem' },
    { name: 'Paleontologia', tags: ['paleontologia', 'fósseis', 'dinossauros', 'ciência'], trending: false, icon: Pickaxe, category: 'Ciências' },
    { name: 'Panificação', tags: ['panificação', 'pães', 'padaria', 'fermentação'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Panificação com Fermentação Natural', tags: ['panificação', 'fermentação', 'natural', 'sourdough'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Papiloscopia (Identificação de Digitais)', tags: ['papiloscopia', 'identificação', 'digitais', 'perícia'], trending: false, icon: Eye, category: 'Segurança' },
    { name: 'Patchwork', tags: ['patchwork', 'costura', 'quilting', 'artesanato'], trending: false, icon: Scissors, category: 'Arte e Artesanato' },
    { name: 'Patentes', tags: ['patentes', 'propriedade', 'intelectual', 'invenções'], trending: false, icon: FileCheck, category: 'Direito e Jurídico' },
    { name: 'Patrística', tags: ['patrística', 'teologia', 'pais', 'igreja'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'PCM (Planejamento e Controle da Manutenção)', tags: ['pcm', 'planejamento', 'manutenção', 'controle'], trending: false, icon: Settings, category: 'Engenharia' },
    { name: 'PDI (Plano de Desenvolvimento Individual)', tags: ['pdi', 'plano', 'desenvolvimento', 'rh'], trending: false, icon: Target, category: 'Recursos Humanos' },
    { name: 'Pedras Quentes', tags: ['pedras', 'quentes', 'massagem', 'terapia'], trending: false, icon: Sparkle, category: 'Saúde e Bem-Estar' },
    { name: 'Peeling de Diamante', tags: ['peeling', 'diamante', 'estética', 'pele'], trending: false, icon: Sparkle, category: 'Moda e Beleza' },
    { name: 'Penteados Profissionais', tags: ['penteados', 'profissionais', 'cabelo', 'beleza'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Pentest (Testes de Invasão)', tags: ['pentest', 'testes', 'invasão', 'segurança'], trending: false, icon: Shield, category: 'Programação e Tecnologia' },
    { name: 'Perícia Ambiental', tags: ['perícia', 'ambiental', 'meio ambiente', 'análise'], trending: false, icon: Leaf, category: 'Engenharia' },
    { name: 'Perícia Contábil', tags: ['perícia', 'contábil', 'contabilidade', 'auditoria'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Perícia Criminal', tags: ['perícia', 'criminal', 'forense', 'investigação'], trending: false, icon: Search, category: 'Direito e Jurídico' },
    { name: 'Perícia Trabalhista', tags: ['perícia', 'trabalhista', 'jurídico', 'análise'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Permacultura', tags: ['permacultura', 'sustentável', 'agricultura', 'ecologia'], trending: false, icon: TreePine, category: 'Agricultura e Meio Ambiente' },
    { name: 'Personal Chef', tags: ['personal', 'chef', 'cozinheiro', 'culinária'], trending: false, icon: ChefHat, category: 'Gastronomia' },
    { name: 'Personal Organizer', tags: ['personal', 'organizer', 'organização', 'casa'], trending: false, icon: Home, category: 'Desenvolvimento Pessoal' },
    { name: 'Personal Shopper', tags: ['personal', 'shopper', 'compras', 'estilo'], trending: false, icon: ShoppingBag, category: 'Moda e Beleza' },
    { name: 'Personal Stylist', tags: ['personal', 'stylist', 'estilo', 'moda'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Persuasão e Influência', tags: ['persuasão', 'influência', 'comunicação', 'vendas'], trending: true, icon: Brain, category: 'Desenvolvimento Pessoal' },
    { name: 'Pesca Esportiva', tags: ['pesca', 'esportiva', 'pescar', 'hobby'], trending: false, icon: Droplets, category: 'Hobbies e Esportes' },
    { name: 'Pesquisa de Mercado', tags: ['pesquisa', 'mercado', 'análise', 'dados'], trending: false, icon: SearchIcon, category: 'Marketing Digital e Vendas' },
    { name: 'Pesquisa de Palavras-Chave', tags: ['pesquisa', 'palavras-chave', 'seo', 'keywords'], trending: true, icon: Search, category: 'Marketing Digital e Vendas' },
    { name: 'Pesquisa de Satisfação (NPS)', tags: ['pesquisa', 'satisfação', 'nps', 'clientes'], trending: false, icon: BarChart3, category: 'Marketing Digital e Vendas' },
    { name: 'Pesquisa Operacional', tags: ['pesquisa', 'operacional', 'otimização', 'matemática'], trending: false, icon: Calculator, category: 'Engenharia' },
    { name: 'Pet Shop e Banho e Tosa', tags: ['pet', 'shop', 'banho', 'tosa'], trending: false, icon: Heart, category: 'Hobbies e Animais' },
    { name: 'PHP e Laravel', tags: ['php', 'laravel', 'programação', 'web'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Piano e Teclado', tags: ['piano', 'teclado', 'música', 'instrumento'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Pilates', tags: ['pilates', 'exercício', 'postura', 'corpo'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Pilotagem de Drones', tags: ['pilotagem', 'drones', 'voo', 'tecnologia'], trending: false, icon: Camera, category: 'Tecnologia' },
    { name: 'Pintura a Óleo', tags: ['pintura', 'óleo', 'arte', 'tela'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Pintura Digital', tags: ['pintura', 'digital', 'arte', 'desenho'], trending: false, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Pintura em Tela', tags: ['pintura', 'tela', 'arte', 'acrílica'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Pirografia (Desenho com Fogo)', tags: ['pirografia', 'desenho', 'fogo', 'madeira'], trending: false, icon: Flame, category: 'Arte e Artesanato' },
    { name: 'Pixel Art', tags: ['pixel', 'art', 'arte', 'digital'], trending: false, icon: Image, category: 'Design e Criação' },
    { name: 'Pixel de Conversão e API', tags: ['pixel', 'conversão', 'api', 'tracking'], trending: true, icon: Code, category: 'Marketing Digital e Vendas' },
    { name: 'Pizzaiolo', tags: ['pizzaiolo', 'pizza', 'culinária', 'italiano'], trending: false, icon: Pizza, category: 'Gastronomia' },
    { name: 'Planejamento de Aposentadoria', tags: ['planejamento', 'aposentadoria', 'previdência', 'finanças'], trending: false, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Planejamento de Mídia', tags: ['planejamento', 'mídia', 'publicidade', 'marketing'], trending: false, icon: Tv, category: 'Marketing Digital e Vendas' },
    { name: 'Planejamento de Negócios', tags: ['planejamento', 'negócios', 'business plan', 'estratégia'], trending: true, icon: Briefcase, category: 'Negócios e Empreendedorismo' },
    { name: 'Planejamento de Viagens', tags: ['planejamento', 'viagens', 'roteiro', 'turismo'], trending: false, icon: Plane, category: 'Turismo e Hotelaria' },
    { name: 'Planejamento e Controle da Produção (PCP)', tags: ['planejamento', 'controle', 'produção', 'pcp'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Planejamento Estratégico', tags: ['planejamento', 'estratégico', 'gestão', 'negócios'], trending: true, icon: Target, category: 'Negócios e Empreendedorismo' },
    { name: 'Planejamento Estratégico de Marketing', tags: ['planejamento', 'estratégico', 'marketing', 'gestão'], trending: true, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Planejamento Familiar', tags: ['planejamento', 'familiar', 'família', 'filhos'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Planejamento Financeiro', tags: ['planejamento', 'financeiro', 'finanças', 'dinheiro'], trending: true, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Planejamento Sucessório', tags: ['planejamento', 'sucessório', 'herança', 'patrimônio'], trending: false, icon: FileText, category: 'Finanças e Investimentos' },
    { name: 'Planejamento Tributário', tags: ['planejamento', 'tributário', 'impostos', 'tributos'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'PLR (Private Label Rights)', tags: ['plr', 'private label', 'rights', 'produtos'], trending: true, icon: Package, category: 'Marketing Digital e Vendas' },
    { name: 'PNL (Programação Neurolinguística)', tags: ['pnl', 'programação', 'neurolinguística', 'comunicação'], trending: false, icon: Brain, category: 'Desenvolvimento Pessoal' },
    { name: 'Podcasting', tags: ['podcasting', 'podcast', 'áudio', 'produção'], trending: true, icon: Mic, category: 'Comunicação e Mídia' },
    { name: 'Podologia', tags: ['podologia', 'pés', 'unhas', 'saúde'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Poesia', tags: ['poesia', 'poemas', 'literatura', 'escrita'], trending: false, icon: PenLine, category: 'Literatura e Escrita' },
    { name: 'Poker', tags: ['poker', 'cartas', 'jogo', 'estratégia'], trending: false, icon: Coins, category: 'Hobbies' },
    { name: 'Pole Dance', tags: ['pole dance', 'dança', 'fitness', 'esporte'], trending: false, icon: Dumbbell, category: 'Dança e Música' },
    { name: 'Políticas Públicas', tags: ['políticas', 'públicas', 'governo', 'gestão'], trending: false, icon: Building, category: 'Política e Sociedade' },
    { name: 'Polímeros', tags: ['polímeros', 'química', 'materiais', 'ciência'], trending: false, icon: Beaker, category: 'Ciências' },
    { name: 'Pompoarismo', tags: ['pompoarismo', 'saúde', 'feminina', 'exercício'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Portaria e Controle de Acesso', tags: ['portaria', 'controle', 'acesso', 'segurança'], trending: false, icon: Lock, category: 'Segurança' },
    { name: 'Português para Concursos', tags: ['português', 'concursos', 'gramática', 'estudos'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Posicionamento de Marca', tags: ['posicionamento', 'marca', 'branding', 'marketing'], trending: true, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Pós-venda e Fidelização de Clientes', tags: ['pós-venda', 'fidelização', 'clientes', 'retenção'], trending: true, icon: Heart, category: 'Marketing Digital e Vendas' },
    { name: 'Power BI', tags: ['power', 'bi', 'dados', 'visualização'], trending: true, icon: BarChart3, category: 'Programação e Tecnologia' },
    { name: 'PowerPoint e Apresentações de Impacto', tags: ['powerpoint', 'apresentações', 'impacto', 'slides'], trending: false, icon: Layout, category: 'Produtividade' },
    { name: 'Precificação de Produtos e Serviços', tags: ['precificação', 'produtos', 'serviços', 'preço'], trending: true, icon: DollarSign, category: 'Negócios e Empreendedorismo' },
    { name: 'Pregação (Homilética)', tags: ['pregação', 'homilética', 'sermão', 'igreja'], trending: false, icon: Mic, category: 'Espiritualidade' },
    { name: 'Preparação para Desastres Naturais', tags: ['preparação', 'desastres', 'naturais', 'sobrevivência'], trending: false, icon: ShieldCheck, category: 'Segurança' },
    { name: 'Preparatório para OAB', tags: ['preparatório', 'oab', 'exame', 'direito'], trending: false, icon: Scale, category: 'Educação' },
    { name: 'Preparatório para Residência Médica', tags: ['preparatório', 'residência', 'médica', 'medicina'], trending: false, icon: Stethoscope, category: 'Educação' },
    { name: 'Prevenção ao Bullying', tags: ['prevenção', 'bullying', 'escola', 'educação'], trending: false, icon: ShieldCheck, category: 'Educação' },
    { name: 'Prevenção e Combate a Incêndio', tags: ['prevenção', 'combate', 'incêndio', 'segurança'], trending: false, icon: Flame, category: 'Segurança' },
    { name: 'Primeiros Socorros', tags: ['primeiros', 'socorros', 'emergência', 'saúde'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Processamento de Linguagem Natural (PLN)', tags: ['processamento', 'linguagem', 'natural', 'nlp'], trending: false, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Processamento de Sinais', tags: ['processamento', 'sinais', 'engenharia', 'tecnologia'], trending: false, icon: Activity, category: 'Engenharia' },
    { name: 'Procreate', tags: ['procreate', 'desenho', 'ipad', 'arte'], trending: true, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Produção de Cachaça Artesanal', tags: ['produção', 'cachaça', 'artesanal', 'bebida'], trending: false, icon: Utensils, category: 'Gastronomia' },
    { name: 'Produção de Conteúdo para Adultos (OnlyFans)', tags: ['produção', 'conteúdo', 'adultos', 'onlyfans'], trending: false, icon: Video, category: 'Comunicação e Mídia' },
    { name: 'Produção de Curtas-Metragens', tags: ['produção', 'curtas-metragens', 'cinema', 'filme'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'Produção de Documentários', tags: ['produção', 'documentários', 'cinema', 'vídeo'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'Produção de Eventos', tags: ['produção', 'eventos', 'festas', 'organização'], trending: false, icon: Calendar, category: 'Eventos' },
    { name: 'Produção de Funk', tags: ['produção', 'funk', 'música', 'beat'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Produção de Moda', tags: ['produção', 'moda', 'fashion', 'desfile'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Produção de Música Eletrônica', tags: ['produção', 'música', 'eletrônica', 'edm'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Produção de Sertanejo', tags: ['produção', 'sertanejo', 'música', 'country'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Produção de Trap', tags: ['produção', 'trap', 'música', 'beat'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Produção Musical', tags: ['produção', 'musical', 'música', 'studio'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Produção Musical com FL Studio', tags: ['produção', 'musical', 'fl studio', 'daw'], trending: false, icon: Music, category: 'Dança e Música' },
    { name: 'Produtividade e Gestão do Tempo', tags: ['produtividade', 'gestão', 'tempo', 'eficiência'], trending: true, icon: Target, category: 'Produtividade' },
    { name: 'Produtos de Limpeza Ecológicos', tags: ['produtos', 'limpeza', 'ecológicos', 'sustentáveis'], trending: false, icon: Leaf, category: 'Habilidades Manuais' },
    { name: 'Programação (Lógica e Algoritmos)', tags: ['programação', 'lógica', 'algoritmos', 'código'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Programação de Jogos', tags: ['programação', 'jogos', 'games', 'gamedev'], trending: false, icon: Gamepad2, category: 'Programação e Tecnologia' },
    { name: 'Programação Orientada a Objetos', tags: ['programação', 'orientada', 'objetos', 'poo'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Programação para Crianças', tags: ['programação', 'crianças', 'kids', 'coding'], trending: false, icon: Gamepad2, category: 'Educação' },
    { name: 'Projeção Astral', tags: ['projeção', 'astral', 'viagem', 'espiritualidade'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Prompt Engineering', tags: ['prompt', 'engineering', 'ia', 'chatgpt'], trending: true, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Propriedade Intelectual (Registro de Marcas)', tags: ['propriedade', 'intelectual', 'registro', 'marcas'], trending: false, icon: FileCheck, category: 'Direito e Jurídico' },
    { name: 'Prospecção Ativa de Clientes', tags: ['prospecção', 'ativa', 'clientes', 'vendas'], trending: true, icon: Search, category: 'Marketing Digital e Vendas' },
    { name: 'Proteção de Dados (LGPD)', tags: ['proteção', 'dados', 'lgpd', 'privacidade'], trending: true, icon: Lock, category: 'Direito e Jurídico' },
    { name: 'Prototipação de Baixa e Alta Fidelidade', tags: ['prototipação', 'baixa', 'alta', 'fidelidade'], trending: false, icon: Layout, category: 'Design e Criação' },
    { name: 'Prova Social', tags: ['prova', 'social', 'testemunhos', 'marketing'], trending: true, icon: Award, category: 'Marketing Digital e Vendas' },
    { name: 'Psicanálise', tags: ['psicanálise', 'psicologia', 'freud', 'terapia'], trending: false, icon: Brain, category: 'Saúde e Bem-Estar' },
    { name: 'Psicologia Analítica (Jung)', tags: ['psicologia', 'analítica', 'jung', 'inconsciente'], trending: false, icon: Brain, category: 'Saúde e Bem-Estar' },
    { name: 'Psicologia Cognitivo-Comportamental', tags: ['psicologia', 'cognitivo', 'comportamental', 'tcc'], trending: false, icon: Brain, category: 'Saúde e Bem-Estar' },
    { name: 'Psicologia das Cores', tags: ['psicologia', 'cores', 'design', 'marketing'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Psicologia do Consumidor', tags: ['psicologia', 'consumidor', 'comportamento', 'marketing'], trending: false, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'Psicologia do Trader', tags: ['psicologia', 'trader', 'trading', 'emocional'], trending: false, icon: Brain, category: 'Finanças e Investimentos' },
    { name: 'Psicologia Forense', tags: ['psicologia', 'forense', 'criminal', 'justiça'], trending: false, icon: Scale, category: 'Direito e Jurídico' },
    { name: 'Psicologia Organizacional', tags: ['psicologia', 'organizacional', 'empresa', 'rh'], trending: false, icon: Briefcase, category: 'Recursos Humanos' },
    { name: 'Psicologia Positiva', tags: ['psicologia', 'positiva', 'bem-estar', 'felicidade'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Psicologia Social', tags: ['psicologia', 'social', 'comportamento', 'grupo'], trending: false, icon: Users, category: 'Ciências Humanas' },
    { name: 'Psicomotricidade', tags: ['psicomotricidade', 'movimento', 'desenvolvimento', 'infantil'], trending: false, icon: Dumbbell, category: 'Educação' },
    { name: 'Psicopedagogia', tags: ['psicopedagogia', 'aprendizagem', 'educação', 'dificuldades'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Publicidade e Propaganda', tags: ['publicidade', 'propaganda', 'marketing', 'comunicação'], trending: true, icon: Megaphone, category: 'Marketing Digital e Vendas' },
    { name: 'Públicos Semelhantes (Lookalike)', tags: ['públicos', 'semelhantes', 'lookalike', 'ads'], trending: true, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'Python (Do Básico ao Avançado)', tags: ['python', 'básico', 'avançado', 'programação'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Python para Análise de Dados', tags: ['python', 'análise', 'dados', 'data science'], trending: false, icon: BarChart3, category: 'Programação e Tecnologia' },
    { name: 'Python para Finanças (Fintech)', tags: ['python', 'finanças', 'fintech', 'programação'], trending: false, icon: DollarSign, category: 'Programação e Tecnologia' },
    { name: 'Python para Web (Django, Flask)', tags: ['python', 'web', 'django', 'flask'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    
    // Q
    { name: 'Qualidade de Software (QA)', tags: ['qualidade', 'software', 'qa', 'testes'], trending: false, icon: CheckCircle, category: 'Programação e Tecnologia' },
    { name: 'Quiromancia', tags: ['quiromancia', 'leitura', 'mãos', 'espiritualidade'], trending: false, icon: Hand, category: 'Espiritualidade' },
    { name: 'Quiropraxia', tags: ['quiropraxia', 'coluna', 'terapia', 'saúde'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    
    // R
    { name: 'Radialismo', tags: ['radialismo', 'rádio', 'comunicação', 'mídia'], trending: false, icon: RadioIcon, category: 'Comunicação e Mídia' },
    { name: 'Radiestesia e Radiônica', tags: ['radiestesia', 'radiônica', 'energia', 'espiritualidade'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Radiologia (Princípios)', tags: ['radiologia', 'raio-x', 'imagem', 'saúde'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Rapel', tags: ['rapel', 'escalada', 'aventura', 'esporte'], trending: false, icon: Climb, category: 'Hobbies e Esportes' },
    { name: 'Raspberry Pi', tags: ['raspberry', 'pi', 'eletrônica', 'iot'], trending: true, icon: Cpu, category: 'Programação e Tecnologia' },
    { name: 'Raciocínio Lógico', tags: ['raciocínio', 'lógico', 'concursos', 'matemática'], trending: false, icon: Brain, category: 'Educação' },
    { name: 'React Native', tags: ['react', 'native', 'mobile', 'app'], trending: true, icon: Smartphone, category: 'Programação e Tecnologia' },
    { name: 'React.js', tags: ['react', 'javascript', 'frontend', 'web'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Realidade Aumentada (AR)', tags: ['realidade', 'aumentada', 'ar', 'tecnologia'], trending: true, icon: Glasses, category: 'Programação e Tecnologia' },
    { name: 'Realidade Aumentada e Virtual na Indústria', tags: ['ar', 'vr', 'indústria', 'tecnologia'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Realidade Virtual (VR)', tags: ['realidade', 'virtual', 'vr', 'tecnologia'], trending: true, icon: Glasses, category: 'Programação e Tecnologia' },
    { name: 'Recepcionista', tags: ['recepcionista', 'atendimento', 'hotel', 'empresa'], trending: false, icon: Users, category: 'Administração' },
    { name: 'Receitas Fit e Saudáveis', tags: ['receitas', 'fit', 'saudáveis', 'culinária'], trending: false, icon: Apple, category: 'Saúde e Bem-Estar' },
    { name: 'Reciclagem e Economia Circular', tags: ['reciclagem', 'economia', 'circular', 'sustentabilidade'], trending: false, icon: Recycle, category: 'Agricultura e Meio Ambiente' },
    { name: 'Reconhecimento Facial', tags: ['reconhecimento', 'facial', 'ia', 'segurança'], trending: true, icon: Vision, category: 'Programação e Tecnologia' },
    { name: 'Recreação para Festas Infantis', tags: ['recreação', 'festas', 'infantis', 'crianças'], trending: false, icon: Heart, category: 'Entretenimento' },
    { name: 'Recrutamento e Seleção', tags: ['recrutamento', 'seleção', 'rh', 'contratação'], trending: false, icon: Users, category: 'Recursos Humanos' },
    { name: 'Recrutamento e Seleção por Competências', tags: ['recrutamento', 'competências', 'rh', 'seleção'], trending: false, icon: UserCheck, category: 'Recursos Humanos' },
    { name: 'Recuperação de Impostos', tags: ['recuperação', 'impostos', 'tributário', 'fiscal'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'Recursos Humanos', tags: ['recursos', 'humanos', 'rh', 'gestão'], trending: false, icon: Users, category: 'Recursos Humanos' },
    { name: 'Redação', tags: ['redação', 'escrita', 'texto', 'português'], trending: false, icon: PenTool, category: 'Educação' },
    { name: 'Redação Científica', tags: ['redação', 'científica', 'artigos', 'pesquisa'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Redação Oficial e Empresarial', tags: ['redação', 'oficial', 'empresarial', 'documentos'], trending: false, icon: Document, category: 'Administração' },
    { name: 'Redação para Web', tags: ['redação', 'web', 'conteúdo', 'digital'], trending: false, icon: Globe, category: 'Marketing Digital e Vendas' },
    { name: 'Redes de Computadores', tags: ['redes', 'computadores', 'network', 'ti'], trending: false, icon: Network, category: 'Programação e Tecnologia' },
    { name: 'Redes Industriais', tags: ['redes', 'industriais', 'automação', 'fábrica'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Redes Neurais', tags: ['redes', 'neurais', 'ia', 'deep learning'], trending: true, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Reflexologia', tags: ['reflexologia', 'terapia', 'massagem', 'saúde'], trending: false, icon: Hand, category: 'Saúde e Bem-Estar' },
    { name: 'Reflexologia Podal', tags: ['reflexologia', 'podal', 'pés', 'massagem'], trending: false, icon: Foot, category: 'Saúde e Bem-Estar' },
    { name: 'Reforço por Aprendizagem', tags: ['reforço', 'aprendizagem', 'ia', 'machine learning'], trending: false, icon: Brain, category: 'Programação e Tecnologia' },
    { name: 'Refrigeração', tags: ['refrigeração', 'ar condicionado', 'clima', 'manutenção'], trending: false, icon: Wind, category: 'Engenharia' },
    { name: 'Registros Akáshicos', tags: ['registros', 'akáshicos', 'espiritualidade', 'memória'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Reiki', tags: ['reiki', 'energia', 'terapia', 'espiritualidade'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Relações Internacionais', tags: ['relações', 'internacionais', 'diplomacia', 'política'], trending: false, icon: Globe, category: 'Política e Sociedade' },
    { name: 'Relações Públicas Digitais', tags: ['relações', 'públicas', 'digitais', 'comunicação'], trending: false, icon: Megaphone, category: 'Marketing Digital e Vendas' },
    { name: 'Relações Sindicais', tags: ['relações', 'sindicais', 'trabalhista', 'rh'], trending: false, icon: Handshake, category: 'Recursos Humanos' },
    { name: 'Relacionamentos Abusivos (Identificação e Saída)', tags: ['relacionamentos', 'abusivos', 'saúde', 'mental'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Relojoaria', tags: ['relojoaria', 'relógios', 'conserto', 'artesanato'], trending: false, icon: Clock, category: 'Habilidades Manuais' },
    { name: 'Remarketing e Retargeting', tags: ['remarketing', 'retargeting', 'ads', 'marketing'], trending: true, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Remuneração Estratégica', tags: ['remuneração', 'estratégica', 'salários', 'rh'], trending: false, icon: DollarSign, category: 'Recursos Humanos' },
    { name: 'Reparo de Placa-Mãe', tags: ['reparo', 'placa-mãe', 'eletrônica', 'computador'], trending: false, icon: Cpu, category: 'Tecnologia' },
    { name: 'Representante Comercial', tags: ['representante', 'comercial', 'vendas', 'negócios'], trending: false, icon: Case, category: 'Negócios e Empreendedorismo' },
    { name: 'Reprogramação Mental para o Sucesso', tags: ['reprogramação', 'mental', 'sucesso', 'mindset'], trending: false, icon: Brain, category: 'Desenvolvimento Pessoal' },
    { name: 'Resiliência Psicológica', tags: ['resiliência', 'psicológica', 'mental', 'saúde'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Resina Epóxi', tags: ['resina', 'epóxi', 'artesanato', 'arte'], trending: true, icon: Droplet, category: 'Arte e Artesanato' },
    { name: 'Resolução de Conflitos', tags: ['resolução', 'conflitos', 'mediação', 'gestão'], trending: false, icon: Handshake, category: 'Desenvolvimento Pessoal' },
    { name: 'Ressonância Magnética', tags: ['ressonância', 'magnética', 'imagem', 'saúde'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Restauração de Fotos Antigas', tags: ['restauração', 'fotos', 'antigas', 'edição'], trending: false, icon: ImageIcon, category: 'Design e Criação' },
    { name: 'Restauração de Móveis', tags: ['restauração', 'móveis', 'marcenaria', 'artesanato'], trending: false, icon: Hammer, category: 'Habilidades Manuais' },
    { name: 'Restauração de Obras de Arte', tags: ['restauração', 'obras', 'arte', 'conservação'], trending: false, icon: Paint, category: 'Arte e Artesanato' },
    { name: 'Retenção de Clientes (E-commerce)', tags: ['retenção', 'clientes', 'ecommerce', 'fidelização'], trending: true, icon: ShoppingCart, category: 'Marketing Digital e Vendas' },
    { name: 'Revit e Arquitetura Digital', tags: ['revit', 'arquitetura', 'digital', 'bim'], trending: false, icon: Building, category: 'Engenharia' },
    { name: 'Revisão de Textos', tags: ['revisão', 'textos', 'ortografia', 'gramática'], trending: false, icon: FileText, category: 'Educação' },
    { name: 'Revisão Ortográfica e Gramatical', tags: ['revisão', 'ortográfica', 'gramatical', 'português'], trending: false, icon: PenTool, category: 'Educação' },
    { name: 'Reumatologia', tags: ['reumatologia', 'articulações', 'saúde', 'medicina'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Risco e Retorno em Investimentos', tags: ['risco', 'retorno', 'investimentos', 'finanças'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Robótica', tags: ['robótica', 'automação', 'tecnologia', 'engenharia'], trending: true, icon: RobotIcon, category: 'Programação e Tecnologia' },
    { name: 'Robótica Industrial', tags: ['robótica', 'industrial', 'automação', 'fábrica'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Rosacruz', tags: ['rosacruz', 'espiritualidade', 'filosofia', 'ordem'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Roteiro para Cinema e YouTube', tags: ['roteiro', 'cinema', 'youtube', 'vídeo'], trending: true, icon: Film, category: 'Design e Criação' },
    { name: 'Roteiro para Games', tags: ['roteiro', 'games', 'jogos', 'narrativa'], trending: false, icon: Game, category: 'Design e Criação' },
    { name: 'Ruby on Rails', tags: ['ruby', 'rails', 'web', 'programação'], trending: false, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Runas', tags: ['runas', 'oráculo', 'espiritualidade', 'divinação'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    
    // S
    { name: 'Sabonetes Artesanais', tags: ['sabonetes', 'artesanais', 'saboaria', 'artesanato'], trending: false, icon: Droplet, category: 'Arte e Artesanato' },
    { name: 'Salsa', tags: ['salsa', 'dança', 'latina', 'música'], trending: false, icon: Music, category: 'Hobbies e Esportes' },
    { name: 'Salgados para Festas', tags: ['salgados', 'festas', 'culinária', 'catering'], trending: false, icon: ChefHat, category: 'Culinária' },
    { name: 'Samba no Pé', tags: ['samba', 'dança', 'brasileira', 'música'], trending: false, icon: Music, category: 'Hobbies e Esportes' },
    { name: 'Saneamento Básico', tags: ['saneamento', 'básico', 'água', 'engenharia'], trending: false, icon: Droplet, category: 'Engenharia' },
    { name: 'Sapateado', tags: ['sapateado', 'dança', 'tap', 'música'], trending: false, icon: Music, category: 'Hobbies e Esportes' },
    { name: 'Sistemas de Informação Geográfica (SIG/GIS)', tags: ['sig', 'gis', 'geográfica', 'mapeamento'], trending: false, icon: MapIcon, category: 'Programação e Tecnologia' },
    { name: 'Sistemas de Recomendação', tags: ['sistemas', 'recomendação', 'ia', 'machine learning'], trending: true, icon: Target, category: 'Programação e Tecnologia' },
    { name: 'Sistemas Embarcados', tags: ['sistemas', 'embarcados', 'eletrônica', 'programação'], trending: false, icon: Cpu, category: 'Programação e Tecnologia' },
    { name: 'Sistemas Operacionais', tags: ['sistemas', 'operacionais', 'os', 'computador'], trending: false, icon: Laptop, category: 'Programação e Tecnologia' },
    { name: 'Six Sigma', tags: ['six', 'sigma', 'qualidade', 'gestão'], trending: false, icon: Award, category: 'Negócios e Empreendedorismo' },
    { name: 'Skate', tags: ['skate', 'esporte', 'radical', 'street'], trending: false, icon: Zap, category: 'Hobbies e Esportes' },
    { name: 'Sketch (Software de Design)', tags: ['sketch', 'design', 'ui', 'ux'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Sketchup', tags: ['sketchup', '3d', 'modelagem', 'arquitetura'], trending: false, icon: Box, category: 'Design e Criação' },
    { name: 'Smart Cities (Cidades Inteligentes)', tags: ['smart', 'cities', 'cidades', 'inteligentes'], trending: false, icon: Building2, category: 'Tecnologia' },
    { name: 'Sobrevivencialismo Urbano', tags: ['sobrevivencialismo', 'urbano', 'preparação', 'emergência'], trending: false, icon: Shield, category: 'Desenvolvimento Pessoal' },
    { name: 'Sociologia', tags: ['sociologia', 'sociedade', 'ciências', 'sociais'], trending: false, icon: Users, category: 'Ciências Humanas' },
    { name: 'Sociologia da Moda', tags: ['sociologia', 'moda', 'cultura', 'sociedade'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Soldagem', tags: ['soldagem', 'solda', 'metalurgia', 'técnica'], trending: false, icon: Flame, category: 'Engenharia' },
    { name: 'Soldagem Industrial', tags: ['soldagem', 'industrial', 'fábrica', 'metalurgia'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'SolidWorks', tags: ['solidworks', 'cad', '3d', 'engenharia'], trending: false, icon: Box, category: 'Engenharia' },
    { name: 'Som Direto para Cinema', tags: ['som', 'direto', 'cinema', 'áudio'], trending: false, icon: Mic, category: 'Design e Criação' },
    { name: 'Sommelier', tags: ['sommelier', 'vinho', 'bebidas', 'gastronomia'], trending: false, icon: Wine, category: 'Culinária' },
    { name: 'Sono do Bebê', tags: ['sono', 'bebê', 'maternidade', 'saúde'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Sound Design para Games', tags: ['sound', 'design', 'games', 'áudio'], trending: false, icon: Headphones, category: 'Design e Criação' },
    { name: 'SPIN Selling', tags: ['spin', 'selling', 'vendas', 'técnica'], trending: false, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'SQL para Análise de Dados', tags: ['sql', 'análise', 'dados', 'banco'], trending: true, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Stable Diffusion', tags: ['stable', 'diffusion', 'ia', 'imagem'], trending: true, icon: ImageIcon, category: 'Programação e Tecnologia' },
    { name: 'Startups (Criação e Gestão)', tags: ['startups', 'criação', 'gestão', 'empreendedorismo'], trending: true, icon: Rocket, category: 'Negócios e Empreendedorismo' },
    { name: 'Stiletto Dance', tags: ['stiletto', 'dance', 'dança', 'salto'], trending: false, icon: Music, category: 'Hobbies e Esportes' },
    { name: 'Storytelling em UX', tags: ['storytelling', 'ux', 'narrativa', 'design'], trending: false, icon: BookOpen, category: 'Design e Criação' },
    { name: 'Storytelling para Negócios', tags: ['storytelling', 'negócios', 'comunicação', 'vendas'], trending: true, icon: MessageCircle, category: 'Negócios e Empreendedorismo' },
    { name: 'Surf', tags: ['surf', 'esporte', 'praia', 'água'], trending: false, icon: Waves, category: 'Hobbies e Esportes' },
    { name: 'Sucessão Familiar e Patrimonial', tags: ['sucessão', 'familiar', 'patrimonial', 'herança'], trending: false, icon: Users, category: 'Finanças e Investimentos' },
    { name: 'Sucesso do Cliente (Customer Success)', tags: ['sucesso', 'cliente', 'customer', 'success'], trending: true, icon: Award, category: 'Negócios e Empreendedorismo' },
    { name: 'Sustentabilidade e ESG', tags: ['sustentabilidade', 'esg', 'ambiental', 'social'], trending: true, icon: Plant, category: 'Agricultura e Meio Ambiente' },
    { name: 'Swift (Programação iOS)', tags: ['swift', 'ios', 'programação', 'apple'], trending: true, icon: Smartphone, category: 'Programação e Tecnologia' },
    
    // T
    { name: 'Tango', tags: ['tango', 'dança', 'argentina', 'música'], trending: false, icon: Music, category: 'Hobbies e Esportes' },
    { name: 'Tantra', tags: ['tantra', 'espiritualidade', 'energia', 'terapia'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Tanatopraxia (Preparação de Corpos)', tags: ['tanatopraxia', 'preparação', 'corpos', 'funerária'], trending: false, icon: Activity, category: 'Saúde e Bem-Estar' },
    { name: 'Tape Reading', tags: ['tape', 'reading', 'trading', 'bolsa'], trending: false, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Tarot', tags: ['tarot', 'oráculo', 'espiritualidade', 'cartas'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Tatuagem', tags: ['tatuagem', 'tattoo', 'arte', 'corpo'], trending: false, icon: Paintbrush, category: 'Arte e Artesanato' },
    { name: 'Teatro e Improvisação', tags: ['teatro', 'improvisação', 'atuação', 'performance'], trending: false, icon: Film, category: 'Arte e Cultura' },
    { name: 'Teatro de Fantoches', tags: ['teatro', 'fantoches', 'puppet', 'performance'], trending: false, icon: Hand, category: 'Arte e Cultura' },
    { name: 'Técnica Pomodoro', tags: ['técnica', 'pomodoro', 'produtividade', 'gestão'], trending: false, icon: Timer, category: 'Produtividade' },
    { name: 'Técnicas de Apresentação em Reuniões', tags: ['técnicas', 'apresentação', 'reuniões', 'comunicação'], trending: false, icon: Users, category: 'Comunicação e Mídia' },
    { name: 'Técnicas de Estudo', tags: ['técnicas', 'estudo', 'aprendizagem', 'educação'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Técnicas de Facilitação de Grupos', tags: ['técnicas', 'facilitação', 'grupos', 'gestão'], trending: false, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Técnicas de Gravação (Enquadramento)', tags: ['técnicas', 'gravação', 'enquadramento', 'vídeo'], trending: false, icon: Video, category: 'Design e Criação' },
    { name: 'Técnicas de Interrogatório', tags: ['técnicas', 'interrogatório', 'investigação', 'segurança'], trending: false, icon: Shield, category: 'Segurança' },
    { name: 'Técnicas de Negociação em Vendas', tags: ['técnicas', 'negociação', 'vendas', 'comercial'], trending: true, icon: Handshake, category: 'Marketing Digital e Vendas' },
    { name: 'Tecnologia Assistiva', tags: ['tecnologia', 'assistiva', 'acessibilidade', 'inclusão'], trending: false, icon: Accessibility, category: 'Tecnologia' },
    { name: 'Teclado (Instrumento)', tags: ['teclado', 'instrumento', 'música', 'piano'], trending: false, icon: Music, category: 'Música' },
    { name: 'Telecomunicações', tags: ['telecomunicações', 'telefonia', 'redes', 'tecnologia'], trending: false, icon: Phone, category: 'Tecnologia' },
    { name: 'Telemarketing e Televendas', tags: ['telemarketing', 'televendas', 'vendas', 'telefone'], trending: false, icon: Phone, category: 'Marketing Digital e Vendas' },
    { name: 'Telemática', tags: ['telemática', 'telemetria', 'tecnologia', 'veículos'], trending: false, icon: Smartphone, category: 'Tecnologia' },
    { name: 'Teologia', tags: ['teologia', 'religião', 'deus', 'fé'], trending: false, icon: BookText, category: 'Espiritualidade' },
    { name: 'Teologia Bíblica', tags: ['teologia', 'bíblica', 'bíblia', 'estudo'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Teologia Pastoral', tags: ['teologia', 'pastoral', 'igreja', 'ministério'], trending: false, icon: Heart, category: 'Espiritualidade' },
    { name: 'Teologia Sistemática', tags: ['teologia', 'sistemática', 'doutrina', 'estudo'], trending: false, icon: BookOpen, category: 'Espiritualidade' },
    { name: 'Teoria da Relatividade (Conceitos)', tags: ['teoria', 'relatividade', 'física', 'einstein'], trending: false, icon: Sparkles, category: 'Ciências' },
    { name: 'Teoria das Cores', tags: ['teoria', 'cores', 'design', 'arte'], trending: false, icon: Palette, category: 'Design e Criação' },
    { name: 'Teoria dos Jogos', tags: ['teoria', 'jogos', 'estratégia', 'matemática'], trending: false, icon: Target, category: 'Ciências' },
    { name: 'Teoria Musical', tags: ['teoria', 'musical', 'música', 'solfejo'], trending: false, icon: Music, category: 'Música' },
    { name: 'Teosofia', tags: ['teosofia', 'espiritualidade', 'filosofia', 'ocultismo'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Terapia Capilar', tags: ['terapia', 'capilar', 'cabelo', 'tratamento'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Terapia Cognitivo-Comportamental (Fundamentos)', tags: ['terapia', 'cognitivo', 'comportamental', 'tcc'], trending: false, icon: Brain, category: 'Saúde e Bem-Estar' },
    { name: 'Terapia de Casal', tags: ['terapia', 'casal', 'relacionamento', 'psicologia'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Terapia Familiar Sistêmica', tags: ['terapia', 'familiar', 'sistêmica', 'família'], trending: false, icon: Users, category: 'Desenvolvimento Pessoal' },
    { name: 'Terrários e Mini Jardins', tags: ['terrários', 'mini', 'jardins', 'plantas'], trending: false, icon: Plant, category: 'Hobbies e Animais' },
    { name: 'Testamento Vital', tags: ['testamento', 'vital', 'direito', 'saúde'], trending: false, icon: FileText, category: 'Direito e Jurídico' },
    { name: 'Testes A/B e Otimização de Conversão (CRO)', tags: ['testes', 'ab', 'otimização', 'conversão'], trending: true, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Testes de Criativos e Públicos', tags: ['testes', 'criativos', 'públicos', 'ads'], trending: true, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Testes de Invasão (Pentest)', tags: ['testes', 'invasão', 'pentest', 'segurança'], trending: true, icon: Shield, category: 'Programação e Tecnologia' },
    { name: 'Testes de Usabilidade', tags: ['testes', 'usabilidade', 'ux', 'design'], trending: false, icon: Eye, category: 'Design e Criação' },
    { name: 'Testes Psicológicos para Seleção', tags: ['testes', 'psicológicos', 'seleção', 'rh'], trending: false, icon: Brain, category: 'Recursos Humanos' },
    { name: 'Tênis', tags: ['tênis', 'esporte', 'raquete', 'quadra'], trending: false, icon: Trophy, category: 'Hobbies e Esportes' },
    { name: 'Tênis de Mesa', tags: ['tênis', 'mesa', 'ping pong', 'esporte'], trending: false, icon: Trophy, category: 'Hobbies e Esportes' },
    { name: 'TikTok Ads', tags: ['tiktok', 'ads', 'anúncios', 'social'], trending: true, icon: Video, category: 'Marketing Digital e Vendas' },
    { name: 'Tingimento Natural de Tecidos', tags: ['tingimento', 'natural', 'tecidos', 'artesanato'], trending: false, icon: Droplet, category: 'Arte e Artesanato' },
    { name: 'Tipografia', tags: ['tipografia', 'fontes', 'design', 'letras'], trending: false, icon: PenTool, category: 'Design e Criação' },
    { name: 'Tiro com Arco', tags: ['tiro', 'arco', 'esporte', 'archery'], trending: false, icon: Target, category: 'Hobbies e Esportes' },
    { name: 'Tomografia Computadorizada', tags: ['tomografia', 'computadorizada', 'imagem', 'saúde'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Topografia', tags: ['topografia', 'mapeamento', 'terreno', 'engenharia'], trending: false, icon: MapIcon, category: 'Engenharia' },
    { name: 'Torno de Oleiro', tags: ['torno', 'oleiro', 'cerâmica', 'artesanato'], trending: false, icon: CircleDot, category: 'Arte e Artesanato' },
    { name: 'Trading Esportivo', tags: ['trading', 'esportivo', 'apostas', 'investimentos'], trending: false, icon: Trophy, category: 'Finanças e Investimentos' },
    { name: 'Tradução e Adaptação de PLRs', tags: ['tradução', 'adaptação', 'plrs', 'conteúdo'], trending: false, icon: Languages, category: 'Trabalho Remoto' },
    { name: 'Tradução Literária', tags: ['tradução', 'literária', 'livros', 'idiomas'], trending: false, icon: BookOpen, category: 'Idiomas' },
    { name: 'Tradução Técnica', tags: ['tradução', 'técnica', 'documentos', 'idiomas'], trending: false, icon: FileText, category: 'Idiomas' },
    { name: 'Tráfego Direto', tags: ['tráfego', 'direto', 'marketing', 'digital'], trending: false, icon: Rocket, category: 'Marketing Digital e Vendas' },
    { name: 'Tráfego Orgânico', tags: ['tráfego', 'orgânico', 'seo', 'marketing'], trending: false, icon: Plant, category: 'Marketing Digital e Vendas' },
    { name: 'Tráfego Pago', tags: ['tráfego', 'pago', 'ads', 'marketing'], trending: true, icon: DollarSign, category: 'Marketing Digital e Vendas' },
    { name: 'Tráfego para Afiliados', tags: ['tráfego', 'afiliados', 'marketing', 'vendas'], trending: false, icon: Target, category: 'Marketing Digital e Vendas' },
    { name: 'Tráfego para Delivery', tags: ['tráfego', 'delivery', 'restaurante', 'marketing'], trending: false, icon: Utensils, category: 'Marketing Digital e Vendas' },
    { name: 'Tráfego para E-commerce', tags: ['tráfego', 'ecommerce', 'loja', 'vendas'], trending: true, icon: ShoppingCart, category: 'Marketing Digital e Vendas' },
    { name: 'Tráfego para Lançamentos', tags: ['tráfego', 'lançamentos', 'marketing', 'infoprodutos'], trending: true, icon: Rocket, category: 'Marketing Digital e Vendas' },
    { name: 'Tráfego para Negócios Locais', tags: ['tráfego', 'negócios', 'locais', 'marketing'], trending: false, icon: Store, category: 'Marketing Digital e Vendas' },
    { name: 'Tranças e Penteados Afro', tags: ['tranças', 'penteados', 'afro', 'cabelo'], trending: false, icon: Scissors, category: 'Moda e Beleza' },
    { name: 'Transmissão Ao Vivo (Streaming)', tags: ['transmissão', 'vivo', 'streaming', 'live'], trending: true, icon: Play, category: 'Comunicação e Mídia' },
    { name: 'Transporte de Cargas Perigosas', tags: ['transporte', 'cargas', 'perigosas', 'logística'], trending: false, icon: Truck, category: 'Logística' },
    { name: 'Trap (Produção Musical)', tags: ['trap', 'produção', 'musical', 'hip hop'], trending: false, icon: Music, category: 'Música' },
    { name: 'Tratamento de Água e Esgoto', tags: ['tratamento', 'água', 'esgoto', 'saneamento'], trending: false, icon: Water, category: 'Engenharia' },
    { name: 'Tratamento de Imagem para E-commerce', tags: ['tratamento', 'imagem', 'ecommerce', 'fotografia'], trending: false, icon: ImageIcon, category: 'Design e Criação' },
    { name: 'Tratamento de Pele em Photoshop', tags: ['tratamento', 'pele', 'photoshop', 'retoque'], trending: false, icon: Paintbrush, category: 'Design e Criação' },
    { name: 'Tratamento de Resíduos', tags: ['tratamento', 'resíduos', 'reciclagem', 'meio ambiente'], trending: false, icon: Recycle, category: 'Agricultura e Meio Ambiente' },
    { name: 'Treinamento de Força', tags: ['treinamento', 'força', 'musculação', 'fitness'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Treinamento Funcional', tags: ['treinamento', 'funcional', 'exercício', 'fitness'], trending: false, icon: Dumbbell, category: 'Saúde e Bem-Estar' },
    { name: 'Treinamento para Terceira Idade', tags: ['treinamento', 'terceira', 'idade', 'idosos'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    { name: 'Trekking', tags: ['trekking', 'trilha', 'caminhada', 'outdoor'], trending: false, icon: Climb, category: 'Hobbies e Esportes' },
    { name: 'Trello (Gestão de Projetos)', tags: ['trello', 'gestão', 'projetos', 'produtividade'], trending: false, icon: CheckCircle, category: 'Produtividade' },
    { name: 'Triathlon', tags: ['triathlon', 'triatlo', 'esporte', 'corrida'], trending: false, icon: Trophy, category: 'Hobbies e Esportes' },
    { name: 'Tricologia (Saúde Capilar)', tags: ['tricologia', 'saúde', 'capilar', 'cabelo'], trending: false, icon: Scissors, category: 'Saúde e Bem-Estar' },
    { name: 'Tricô', tags: ['tricô', 'artesanato', 'agulha', 'lã'], trending: false, icon: Scissors, category: 'Arte e Artesanato' },
    { name: 'Turismo e Hotelaria', tags: ['turismo', 'hotelaria', 'viagem', 'hospedagem'], trending: false, icon: Plane, category: 'Turismo e Hotelaria' },
    { name: 'Twerk', tags: ['twerk', 'dança', 'movimento', 'fitness'], trending: false, icon: Music, category: 'Hobbies e Esportes' },
    { name: 'Twitter (X) Ads', tags: ['twitter', 'x', 'ads', 'anúncios'], trending: false, icon: Share2, category: 'Marketing Digital e Vendas' },
    { name: 'TypeScript', tags: ['typescript', 'javascript', 'programação', 'web'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    
    // U
    { name: 'Ufologia', tags: ['ufologia', 'ovni', 'ufo', 'extraterrestre'], trending: false, icon: Sparkles, category: 'Mistérios' },
    { name: 'UI Design (Design de Interfaces)', tags: ['ui', 'design', 'interfaces', 'visual'], trending: true, icon: Layout, category: 'Design e Criação' },
    { name: 'Ukulele', tags: ['ukulele', 'instrumento', 'música', 'cordas'], trending: false, icon: Music, category: 'Música' },
    { name: 'Ultrassonografia', tags: ['ultrassonografia', 'ultrassom', 'imagem', 'saúde'], trending: false, icon: Stethoscope, category: 'Saúde e Bem-Estar' },
    { name: 'Upcycling de Roupas', tags: ['upcycling', 'roupas', 'sustentável', 'moda'], trending: false, icon: Recycle, category: 'Moda e Beleza' },
    { name: 'UX Design (Experiência do Usuário)', tags: ['ux', 'design', 'experiência', 'usuário'], trending: true, icon: Eye, category: 'Design e Criação' },
    { name: 'UX Writing (Escrita para UX)', tags: ['ux', 'writing', 'escrita', 'conteúdo'], trending: true, icon: PenTool, category: 'Design e Criação' },
    
    // V
    { name: 'Valuation de Empresas', tags: ['valuation', 'empresas', 'avaliação', 'finanças'], trending: false, icon: Calculator, category: 'Finanças e Investimentos' },
    { name: 'VBA para Automação no Excel', tags: ['vba', 'automação', 'excel', 'programação'], trending: false, icon: FileStack, category: 'Programação e Tecnologia' },
    { name: 'Velas Artesanais', tags: ['velas', 'artesanais', 'artesanato', 'decoração'], trending: false, icon: Flame, category: 'Arte e Artesanato' },
    { name: 'Velas em Gel', tags: ['velas', 'gel', 'artesanato', 'decoração'], trending: false, icon: Flame, category: 'Arte e Artesanato' },
    { name: 'Vendas de Alto Valor (High Ticket)', tags: ['vendas', 'alto', 'valor', 'high ticket'], trending: true, icon: DollarSign, category: 'Marketing Digital e Vendas' },
    { name: 'Vendas de Consórcios', tags: ['vendas', 'consórcios', 'financiamento', 'negócios'], trending: false, icon: Handshake, category: 'Finanças e Investimentos' },
    { name: 'Vendas de Planos de Saúde', tags: ['vendas', 'planos', 'saúde', 'seguros'], trending: false, icon: Heart, category: 'Negócios e Empreendedorismo' },
    { name: 'Vendas de Seguros', tags: ['vendas', 'seguros', 'corretagem', 'negócios'], trending: false, icon: Shield, category: 'Negócios e Empreendedorismo' },
    { name: 'Vendas de Veículos', tags: ['vendas', 'veículos', 'carros', 'automóveis'], trending: false, icon: Car, category: 'Negócios e Empreendedorismo' },
    { name: 'Vendas Diretas (Marketing Multinível)', tags: ['vendas', 'diretas', 'multinível', 'mmn'], trending: false, icon: Users, category: 'Marketing Digital e Vendas' },
    { name: 'Vendas em Marketplaces (Amazon, Mercado Livre)', tags: ['vendas', 'marketplaces', 'amazon', 'mercado livre'], trending: true, icon: ShoppingCart, category: 'Marketing Digital e Vendas' },
    { name: 'Vendas Online', tags: ['vendas', 'online', 'ecommerce', 'digital'], trending: true, icon: ShoppingCart, category: 'Marketing Digital e Vendas' },
    { name: 'Vendedor Externo', tags: ['vendedor', 'externo', 'campo', 'comercial'], trending: false, icon: Briefcase, category: 'Negócios e Empreendedorismo' },
    { name: 'Veleiro e Navegação', tags: ['veleiro', 'navegação', 'barco', 'vela'], trending: false, icon: Ship, category: 'Hobbies e Esportes' },
    { name: 'Vigilância Patrimonial', tags: ['vigilância', 'patrimonial', 'segurança', 'proteção'], trending: false, icon: Shield, category: 'Segurança' },
    { name: 'Vinhos e Sommelier', tags: ['vinhos', 'sommelier', 'degustação', 'enologia'], trending: false, icon: Wine, category: 'Culinária' },
    { name: 'Violino', tags: ['violino', 'instrumento', 'música', 'cordas'], trending: false, icon: Music, category: 'Música' },
    { name: 'Violão', tags: ['violão', 'instrumento', 'música', 'cordas'], trending: false, icon: Guitar, category: 'Música' },
    { name: 'Visagismo', tags: ['visagismo', 'beleza', 'estilo', 'visual'], trending: false, icon: Eye, category: 'Moda e Beleza' },
    { name: 'Visual Merchandising', tags: ['visual', 'merchandising', 'vitrine', 'varejo'], trending: false, icon: Store, category: 'Negócios e Empreendedorismo' },
    { name: 'Visão Computacional', tags: ['visão', 'computacional', 'ia', 'opencv'], trending: true, icon: Eye, category: 'Programação e Tecnologia' },
    { name: 'Vitrinismo', tags: ['vitrinismo', 'vitrine', 'visual', 'loja'], trending: false, icon: Store, category: 'Negócios e Empreendedorismo' },
    { name: 'Viver de Renda', tags: ['viver', 'renda', 'passiva', 'investimentos'], trending: true, icon: DollarSign, category: 'Finanças e Investimentos' },
    { name: 'Viver de YouTube', tags: ['viver', 'youtube', 'criador', 'conteúdo'], trending: true, icon: Youtube, category: 'Marketing Digital e Vendas' },
    { name: 'Voice User Interface (VUI) Design', tags: ['voice', 'vui', 'design', 'voz'], trending: false, icon: Mic, category: 'Design e Criação' },
    { name: 'Vôlei', tags: ['vôlei', 'voleibol', 'esporte', 'quadra'], trending: false, icon: Volleyball, category: 'Hobbies e Esportes' },
    { name: 'Vue.js', tags: ['vue', 'javascript', 'framework', 'web'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    
    // W
    { name: 'Waze Ads', tags: ['waze', 'ads', 'anúncios', 'localização'], trending: false, icon: MapIcon, category: 'Marketing Digital e Vendas' },
    { name: 'Web Design Responsivo', tags: ['web', 'design', 'responsivo', 'mobile'], trending: true, icon: Smartphone, category: 'Design e Criação' },
    { name: 'Web Scraping para Inteligência de Mercado', tags: ['web', 'scraping', 'dados', 'mercado'], trending: false, icon: Database, category: 'Programação e Tecnologia' },
    { name: 'Webinars e Eventos Online', tags: ['webinars', 'eventos', 'online', 'digital'], trending: true, icon: Video, category: 'Marketing Digital e Vendas' },
    { name: 'Wicca e Paganismo', tags: ['wicca', 'paganismo', 'espiritualidade', 'magia'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'WordPress (Criação e Customização)', tags: ['wordpress', 'site', 'blog', 'cms'], trending: true, icon: Globe, category: 'Programação e Tecnologia' },
    
    // X
    { name: 'Xadrez', tags: ['xadrez', 'jogo', 'estratégia', 'tabuleiro'], trending: false, icon: Target, category: 'Hobbies e Esportes' },
    { name: 'Xamanismo', tags: ['xamanismo', 'espiritualidade', 'cura', 'ritual'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    
    // Y
    { name: 'Yoga', tags: ['yoga', 'meditação', 'exercício', 'bem-estar'], trending: false, icon: Heart, category: 'Saúde e Bem-Estar' },
    
    // Z
    { name: 'Zouk', tags: ['zouk', 'dança', 'música', 'brasil'], trending: false, icon: Music, category: 'Hobbies e Esportes' },
    { name: 'Zumba', tags: ['zumba', 'dança', 'fitness', 'exercício'], trending: false, icon: Music, category: 'Hobbies e Esportes' },
  ];

  // Função para normalizar texto (remove acentos e converte para lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Filtro inteligente
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return allTopics;

    const normalizedQuery = normalizeText(searchQuery);
    
    return allTopics.filter((topic) => {
      const nameMatch = normalizeText(topic.name).includes(normalizedQuery);
      const tagMatch = topic.tags.some(tag => 
        normalizeText(tag).includes(normalizedQuery)
      );
      return nameMatch || tagMatch;
    });
  }, [searchQuery, allTopics]);

  // Separar tópicos em alta (ordem específica) e ordem alfabética
  const TRENDING_ORDER = [
    'Marketing Digital',
    'Programação e Desenvolvimento de Tecnologia',
    'Idiomas',
    'Inteligência Artificial',
    'Desenvolvimento Pessoal e Produtividade',
    'Tráfego Pago',
    'Marketing de Afiliados',
    'Finanças e Investimentos',
    'Design e Criação de Conteúdo',
    'E-commerce e Dropshipping',
  ];

  const TRENDING_SET = new Set(TRENDING_ORDER);

  const trendingTopics = useMemo(() => {
    const topicsByName: Record<string, Topic> = {};
    filteredTopics.forEach(t => {
      topicsByName[t.name] = t;
    });
    return TRENDING_ORDER
      .map(name => topicsByName[name])
      .filter((t): t is Topic => t !== undefined);
  }, [filteredTopics]);

  const alphabeticalTopics = useMemo(() =>
    filteredTopics
      .filter(t => !TRENDING_SET.has(t.name))
      .sort((a, b) => a.name.localeCompare(b.name)),
    [filteredTopics]
  );

  const hasResults = filteredTopics.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  // Carregar mais itens conforme o usuário rola
  const loadMore = useCallback(() => {
    if (isLoadingMore) return;
    
    const totalItems = isSearching ? filteredTopics.length : allTopics.length;
    if (visibleCount >= totalItems) return;

    setIsLoadingMore(true);
    lastScrollTime.current = Date.now();
    
    // Simula um pequeno delay para não sobrecarregar
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 50, totalItems));
      setIsLoadingMore(false);
    }, 100);
  }, [visibleCount, isLoadingMore, filteredTopics.length, allTopics.length, isSearching]);

  // Intersection Observer para detectar quando chegar perto do final
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5, rootMargin: "200px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  // Detectar quando o usuário para de rolar
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;
      
      // Se passou mais de 2 segundos sem rolar, para de carregar
      if (timeSinceLastScroll > 2000 && isLoadingMore) {
        setIsLoadingMore(false);
      }
    };

    const interval = setInterval(checkInactivity, 1000);
    return () => clearInterval(interval);
  }, [isLoadingMore]);

  // Reset visibleCount quando a busca muda
  useEffect(() => {
    if (isSearching) {
      // Na busca, prioriza mostrando todos os resultados relevantes
      setVisibleCount(filteredTopics.length);
    } else {
      setVisibleCount(50);
    }
  }, [searchQuery, isSearching, filteredTopics.length]);

  // Determina quais tópicos mostrar baseado no visibleCount
  const visibleTrendingTopics = useMemo(() => 
    isSearching 
      ? trendingTopics 
      : trendingTopics.slice(0, visibleCount),
    [trendingTopics, visibleCount, isSearching]
  );

  const visibleAlphabeticalTopics = useMemo(() => {
    if (isSearching) return alphabeticalTopics;
    
    const remainingCount = visibleCount - trendingTopics.length;
    // Limita a 100 temas no máximo
    const maxTopics = 100;
    return remainingCount > 0 ? alphabeticalTopics.slice(0, Math.min(remainingCount, maxTopics)) : [];
  }, [alphabeticalTopics, visibleCount, trendingTopics.length, isSearching]);

  const hasMoreToLoad = visibleCount < (isSearching ? filteredTopics.length : allTopics.length);

  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-5 bg-[hsl(var(--arsenal-bg))] flex justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6 md:mb-10 space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-1.5 md:gap-2 bg-primary/10 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-2">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            Conteúdo da Comunidade
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-[hsl(var(--arsenal-text))] animate-fade-in-up">
            Explore nosso <span className="text-[#FF0000]">arsenal</span> de conhecimento.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
            São +20.000 cursos, organizados nos temas abaixo. Encontre a área que você quer dominar.
          </p>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4 md:mb-8 relative max-w-xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary group-focus-within:text-primary transition-colors pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Pesquisar por um tema ex: Marketing, Inglês, Programação..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-12 pr-10 md:pr-12 h-11 md:h-14 text-sm md:text-base bg-[hsl(var(--arsenal-card))] text-[hsl(var(--arsenal-text))] backdrop-blur-sm border-2 border-[#2a2a2a] focus:border-[#00FF00] focus:ring-2 focus:ring-[#00FF00]/20 transition-all duration-300 shadow-md hover:shadow-lg md:shadow-lg md:hover:shadow-xl rounded-lg md:rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-primary/10 p-1 md:p-1.5 rounded-md md:rounded-lg transition-all duration-200 touch-manipulation"
                aria-label="Limpar busca"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Contador de Resultados */}
        {isSearching && (
          <div className="mb-3 md:mb-4 text-center">
            {hasResults ? (
              <div className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-primary/90 bg-primary/5 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                {filteredTopics.length} resultado{filteredTopics.length !== 1 ? 's' : ''}
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-destructive/90 bg-destructive/5 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                <X className="w-3 h-3 md:w-4 md:h-4" />
                Nenhum resultado
              </div>
            )}
          </div>
        )}

        {/* Indicador de Scroll Animado */}
        {hasResults && (
          <div className="flex flex-col items-center justify-center gap-2 mb-3 md:mb-4">
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-primary/80 font-medium">
              <span>Deslize para explorar todo o conteúdo</span>
            </div>
            <div className="flex gap-1 animate-bounce">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <svg className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Container de Scroll */}
        <div 
          className="h-[450px] md:h-[500px] lg:h-[550px] w-full relative rounded-xl md:rounded-2xl bg-[hsl(var(--arsenal-card))] border-2 border-border md:border-2 md:border-border shadow-lg md:shadow-glow backdrop-blur-sm overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[hsl(var(--arsenal-bg))] via-[hsl(var(--arsenal-bg))]/50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[hsl(var(--arsenal-bg))] via-[hsl(var(--arsenal-bg))]/50 to-transparent pointer-events-none z-10"></div>
          
          <ScrollArea className="h-full w-full scroll-smooth [&>div>div]:!overflow-x-hidden [&_[data-radix-scroll-area-viewport]]:!overflow-x-hidden">
            <div className="p-5 md:p-6 lg:p-8 pb-8 md:pb-10">
              {!hasResults ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center space-y-3 md:space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                    <Search className="relative w-12 h-12 md:w-16 md:h-16 text-primary opacity-50" />
                  </div>
                  <div className="space-y-2 px-4">
                    <p className="text-lg md:text-xl font-semibold text-[hsl(var(--arsenal-text))]">
                      Nenhum tema encontrado para "{searchQuery}"
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground max-w-sm">
                      Busque por temas como <span className="text-primary font-medium">programação</span>, 
                      <span className="text-primary font-medium"> marketing digital</span> ou 
                      <span className="text-primary font-medium"> design gráfico</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 md:space-y-8">
                  {/* Seção Em Alta */}
                  {visibleTrendingTopics.length > 0 && (
                  <div className="space-y-3 md:space-y-4">
                      <div className="flex items-center gap-2 md:gap-3 pb-2 md:pb-3 border-b border-primary/20 md:border-b-2 md:border-primary/30">
                        <div className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/25 to-primary/15">
                          <Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-[hsl(var(--arsenal-text))]">Temas em Alta</h3>
                          <p className="text-[10px] md:text-xs text-primary/70">Temas de cursos mais procurados</p>
                        </div>
                      </div>
                      <div className="grid gap-2.5 md:gap-3">
                        {visibleTrendingTopics.map((topic, index) => {
                          const Icon = topic.icon;
                          return (
                            <div
                              key={`trending-${index}`}
                              className="group relative flex items-center gap-3 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-xl bg-[#1a1a1a] border-2 border-[#2a2a2a] active:scale-[0.98] md:hover:border-[#FF0000] md:hover:shadow-md transition-all duration-200 cursor-pointer touch-manipulation min-h-[48px] md:min-h-[60px]"
                              role="button"
                              tabIndex={0}
                              aria-label={`Ver tópico ${topic.name}`}
                            >
                              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-lg bg-transparent transition-all duration-200 flex-shrink-0">
                                <Icon className="w-5 h-5 md:w-5 md:h-5 text-[#FF0000]" />
                              </div>
                              <span className="text-sm md:text-base font-medium text-[#FFFFFF] transition-colors flex-1 text-left leading-snug">
                                {topic.name}
                              </span>
                              <CheckCircle2 className="w-5 h-5 md:w-5 md:h-5 text-[#FF0000]/40 md:group-hover:text-[#FF0000]/70 transition-colors flex-shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Seção Todos os Tópicos */}
                  {visibleAlphabeticalTopics.length > 0 && (
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-center gap-2 md:gap-3 pb-2 md:pb-3 border-b border-border/30 md:border-b-2 md:border-border/50">
                        <div className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-secondary/80">
                          <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-[hsl(var(--arsenal-text))]">
                            {visibleTrendingTopics.length > 0 ? 'Todos os Temas' : 'Temas Disponíveis'}
                          </h3>
                          <p className="text-[10px] md:text-xs text-muted-foreground">Cada tema possui diversos cursos</p>
                        </div>
                      </div>
                      <div className="grid gap-2 md:gap-2">
                        {visibleAlphabeticalTopics.map((topic, index) => {
                          const Icon = topic.icon;
                          return (
                            <div
                              key={`alpha-${index}`}
                              className="group flex items-center gap-3 md:gap-3 p-3 md:p-3.5 rounded-xl md:rounded-xl bg-[#1a1a1a] active:scale-[0.99] border-2 border-[#2a2a2a] md:hover:border-[#FF0000] md:hover:shadow-md transition-all duration-200 cursor-pointer touch-manipulation min-h-[48px] md:min-h-[52px]"
                              role="button"
                              tabIndex={0}
                              aria-label={`Ver tópico ${topic.name}`}
                            >
                              <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-lg bg-transparent transition-colors flex-shrink-0">
                                <Icon className="w-4 h-4 md:w-4 md:h-4 text-[#FF0000] transition-colors" />
                              </div>
                              <span className="text-sm md:text-base text-[#FFFFFF] transition-colors flex-1 text-left leading-snug">
                                {topic.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Observer target para lazy loading */}
                  {hasMoreToLoad && !isSearching && (
                    <div 
                      ref={observerTarget} 
                      className="w-full py-4 flex items-center justify-center"
                    >
                      {isLoadingMore && (
                        <div className="text-sm text-muted-foreground animate-pulse">
                          Carregando mais temas...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <ScrollBar 
              orientation="vertical" 
              className="z-20 w-2.5 md:w-3 !opacity-100 bg-muted/20 hover:bg-muted/30 transition-colors"
            />
          </ScrollArea>
        </div>

      </div>
    </section>
  );
};

export default ScrollingTopics;
