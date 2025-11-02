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
  Brush, Youtube, Crosshair, FlaskRound, Droplets as Water, Car, Smile } from "lucide-react";

interface Topic {
  name: string;
  tags: string[];
  trending: boolean;
  icon: LucideIcon;
  category: string;
}

const ScrollingTopics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef(Date.now());

  // Estrutura de dados com tags, ícones e categorias em ordem alfabética
  const allTopics: Topic[] = [
    // Temas em Alta (mantidos sem alteração)
    { name: 'Programação e Desenvolvimento de Tecnologia', tags: ['programação', 'desenvolvimento', 'tecnologia', 'ti'], trending: true, icon: Code, category: 'Programação e Tecnologia' },
    { name: 'Finanças e Investimentos', tags: ['finanças', 'investimentos', 'dinheiro', 'mercado'], trending: true, icon: LineChart, category: 'Finanças e Investimentos' },
    { name: 'Design e Criação de Conteúdo', tags: ['design', 'criação de conteúdo', 'conteúdo', 'criatividade'], trending: true, icon: Palette, category: 'Design e Criação' },
    { name: 'E-commerce e Dropshipping', tags: ['e-commerce', 'dropshipping', 'loja online', 'vendas'], trending: true, icon: ShoppingBag, category: 'Marketing Digital e Vendas' },
    { name: 'Desenvolvimento Pessoal e Produtividade', tags: ['desenvolvimento pessoal', 'produtividade', 'hábitos', 'organização'], trending: true, icon: CheckCircle2, category: 'Desenvolvimento Pessoal' },
    // Todos os Temas (ordem alfabética) - 344 temas
    { name: 'Administração', tags: ['administração', 'gestão', 'negócios'], trending: false, icon: Briefcase, category: 'Negócios' },
    { name: 'Administração de Empresas', tags: ['administração', 'empresas', 'gestão'], trending: false, icon: Building, category: 'Negócios' },
    { name: 'Administração Pública', tags: ['administração', 'pública', 'governo'], trending: false, icon: Building2, category: 'Administração' },
    { name: 'Adobe After Effects', tags: ['after effects', 'adobe', 'vídeo', 'edição'], trending: false, icon: Film, category: 'Design' },
    { name: 'Adobe Illustrator', tags: ['illustrator', 'adobe', 'design', 'vetorial'], trending: false, icon: Palette, category: 'Design' },
    { name: 'Adobe Photoshop', tags: ['photoshop', 'adobe', 'design', 'imagem'], trending: false, icon: Image, category: 'Design' },
    { name: 'Adobe Premiere', tags: ['premiere', 'adobe', 'vídeo', 'edição'], trending: false, icon: Video, category: 'Design' },
    { name: 'Agronegócio', tags: ['agronegócio', 'agricultura', 'negócios'], trending: false, icon: Leaf, category: 'Agricultura' },
    { name: 'Alemão', tags: ['alemão', 'idioma', 'língua'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Análise de Dados', tags: ['análise', 'dados', 'data'], trending: false, icon: BarChart3, category: 'Tecnologia' },
    { name: 'Análise de Dados Estatísticos', tags: ['análise', 'estatística', 'dados'], trending: false, icon: PieChart, category: 'Tecnologia' },
    { name: 'Análise e Desenvolvimento de Sistemas', tags: ['análise', 'sistemas', 'desenvolvimento'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Animais de Estimação', tags: ['animais', 'pets', 'estimação'], trending: false, icon: Heart, category: 'Animais' },
    { name: 'Animais e Pets', tags: ['animais', 'pets', 'cuidados'], trending: false, icon: Heart, category: 'Animais' },
    { name: 'Aplicativos Mobile', tags: ['aplicativos', 'mobile', 'apps'], trending: false, icon: Smartphone, category: 'Tecnologia' },
    { name: 'Aromaterapia', tags: ['aromaterapia', 'terapia', 'óleos'], trending: false, icon: Flower2, category: 'Saúde' },
    { name: 'Arquitetura', tags: ['arquitetura', 'construção', 'design'], trending: false, icon: Building, category: 'Arquitetura' },
    { name: 'Arquitetura de Software', tags: ['arquitetura', 'software', 'sistemas'], trending: false, icon: Layers, category: 'Tecnologia' },
    { name: 'Arquitetura e Urbanismo', tags: ['arquitetura', 'urbanismo', 'cidades'], trending: false, icon: Building2, category: 'Arquitetura' },
    { name: 'Arte Digital', tags: ['arte', 'digital', 'design'], trending: false, icon: Paintbrush, category: 'Arte' },
    { name: 'Arte e Cultura', tags: ['arte', 'cultura', 'criatividade'], trending: false, icon: Palette, category: 'Arte' },
    { name: 'Artes Visuais', tags: ['artes', 'visuais', 'design'], trending: false, icon: Eye, category: 'Arte' },
    { name: 'Assertividade', tags: ['assertividade', 'comunicação', 'habilidades'], trending: false, icon: MessageCircle, category: 'Desenvolvimento Pessoal' },
    { name: 'Astrologia', tags: ['astrologia', 'horóscopo', 'zodíaco'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Audiobooks', tags: ['audiobooks', 'livros', 'áudio'], trending: false, icon: Headphones, category: 'Educação' },
    { name: 'Audiovisual', tags: ['audiovisual', 'vídeo', 'produção'], trending: false, icon: Video, category: 'Mídia' },
    { name: 'Automação', tags: ['automação', 'tecnologia', 'processos'], trending: false, icon: Settings, category: 'Tecnologia' },
    { name: 'Automação de Processos', tags: ['automação', 'processos', 'eficiência'], trending: false, icon: Zap, category: 'Tecnologia' },
    { name: 'Automação Residencial', tags: ['automação', 'residencial', 'casa'], trending: false, icon: Home, category: 'Tecnologia' },
    { name: 'Autoconhecimento', tags: ['autoconhecimento', 'desenvolvimento', 'pessoal'], trending: false, icon: UserCircle, category: 'Desenvolvimento Pessoal' },
    { name: 'Barbeiro', tags: ['barbeiro', 'barba', 'beleza'], trending: false, icon: Scissors, category: 'Beleza' },
    { name: 'Beleza e Estética', tags: ['beleza', 'estética', 'cuidados'], trending: false, icon: Sparkles, category: 'Beleza' },
    { name: 'Bem-estar', tags: ['bem-estar', 'saúde', 'qualidade de vida'], trending: false, icon: Heart, category: 'Saúde' },
    { name: 'Big Data', tags: ['big data', 'dados', 'análise'], trending: false, icon: Database, category: 'Tecnologia' },
    { name: 'Biomedicina', tags: ['biomedicina', 'saúde', 'medicina'], trending: false, icon: Stethoscope, category: 'Saúde' },
    { name: 'Blockchain', tags: ['blockchain', 'cripto', 'tecnologia'], trending: false, icon: Bitcoin, category: 'Tecnologia' },
    { name: 'Branding', tags: ['branding', 'marca', 'marketing'], trending: false, icon: Award, category: 'Marketing' },
    { name: 'Business Intelligence', tags: ['business intelligence', 'bi', 'dados'], trending: false, icon: BarChart3, category: 'Negócios' },
    { name: 'Cabeleireiro', tags: ['cabeleireiro', 'cabelo', 'beleza'], trending: false, icon: Scissors, category: 'Beleza' },
    { name: 'Caligrafia', tags: ['caligrafia', 'escrita', 'arte'], trending: false, icon: PenTool, category: 'Arte' },
    { name: 'ChatGPT', tags: ['chatgpt', 'ia', 'inteligência artificial'], trending: false, icon: Bot, category: 'Tecnologia' },
    { name: 'Ciência de Dados', tags: ['ciência', 'dados', 'data science'], trending: false, icon: Database, category: 'Tecnologia' },
    { name: 'Ciências Biológicas', tags: ['ciências', 'biologia', 'natureza'], trending: false, icon: Leaf, category: 'Ciências' },
    { name: 'Ciências Contábeis', tags: ['ciências', 'contábeis', 'contabilidade'], trending: false, icon: Calculator, category: 'Finanças' },
    { name: 'Cinema', tags: ['cinema', 'filme', 'produção'], trending: false, icon: Film, category: 'Arte' },
    { name: 'Cloud Computing', tags: ['cloud', 'computação', 'nuvem'], trending: false, icon: Cloud, category: 'Tecnologia' },
    { name: 'Coaching', tags: ['coaching', 'desenvolvimento', 'mentoria'], trending: false, icon: Target, category: 'Desenvolvimento Pessoal' },
    { name: 'Coaching de Carreira', tags: ['coaching', 'carreira', 'profissional'], trending: false, icon: Briefcase, category: 'Carreira' },
    { name: 'Cobrança e Recuperação de Crédito', tags: ['cobrança', 'crédito', 'finanças'], trending: false, icon: DollarSign, category: 'Finanças' },
    { name: 'Comércio Exterior', tags: ['comércio', 'exterior', 'importação'], trending: false, icon: Globe, category: 'Negócios' },
    { name: 'Comunicação', tags: ['comunicação', 'fala', 'expressão'], trending: false, icon: MessageCircle, category: 'Comunicação' },
    { name: 'Comunicação Assertiva', tags: ['comunicação', 'assertiva', 'habilidades'], trending: false, icon: MessageCircle, category: 'Comunicação' },
    { name: 'Comunicação Corporativa', tags: ['comunicação', 'corporativa', 'empresarial'], trending: false, icon: Briefcase, category: 'Comunicação' },
    { name: 'Concursos Públicos', tags: ['concursos', 'públicos', 'estudos'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Confeitaria', tags: ['confeitaria', 'doces', 'culinária'], trending: false, icon: ChefHat, category: 'Culinária' },
    { name: 'Confeitaria Artística', tags: ['confeitaria', 'artística', 'decoração'], trending: false, icon: ChefHat, category: 'Culinária' },
    { name: 'Consultoria', tags: ['consultoria', 'negócios', 'gestão'], trending: false, icon: Briefcase, category: 'Negócios' },
    { name: 'Contabilidade', tags: ['contabilidade', 'finanças', 'impostos'], trending: false, icon: Calculator, category: 'Finanças' },
    { name: 'Contabilidade Digital', tags: ['contabilidade', 'digital', 'tecnologia'], trending: false, icon: Calculator, category: 'Finanças' },
    { name: 'Copywriting', tags: ['copywriting', 'escrita', 'marketing'], trending: false, icon: PenTool, category: 'Marketing' },
    { name: 'Criação de Conteúdo', tags: ['criação', 'conteúdo', 'marketing'], trending: false, icon: FileText, category: 'Marketing' },
    { name: 'Criação de Documentários', tags: ['documentários', 'vídeo', 'produção'], trending: false, icon: Film, category: 'Mídia' },
    { name: 'Criptomoedas', tags: ['criptomoedas', 'bitcoin', 'cripto'], trending: false, icon: Bitcoin, category: 'Finanças' },
    { name: 'CRM (Gestão de Relacionamento)', tags: ['crm', 'gestão', 'clientes'], trending: false, icon: Users, category: 'Negócios' },
    { name: 'CSS', tags: ['css', 'web', 'design'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Culinária', tags: ['culinária', 'cozinha', 'receitas'], trending: false, icon: ChefHat, category: 'Culinária' },
    { name: 'Culinária Fit', tags: ['culinária', 'fit', 'saudável'], trending: false, icon: Apple, category: 'Culinária' },
    { name: 'Culinária Vegana', tags: ['culinária', 'vegana', 'vegetariana'], trending: false, icon: Leaf, category: 'Culinária' },
    { name: 'Cybersecurity', tags: ['cybersecurity', 'segurança', 'tecnologia'], trending: false, icon: Shield, category: 'Tecnologia' },
    { name: 'Dança', tags: ['dança', 'arte', 'movimento'], trending: false, icon: Music, category: 'Arte' },
    { name: 'Data Science', tags: ['data science', 'dados', 'ciência'], trending: false, icon: Database, category: 'Tecnologia' },
    { name: 'Deep Learning', tags: ['deep learning', 'ia', 'machine learning'], trending: false, icon: Brain, category: 'Tecnologia' },
    { name: 'Design', tags: ['design', 'criação', 'arte'], trending: false, icon: Palette, category: 'Design' },
    { name: 'Design de Interiores', tags: ['design', 'interiores', 'decoração'], trending: false, icon: Home, category: 'Design' },
    { name: 'Design de Produto', tags: ['design', 'produto', 'criação'], trending: false, icon: Package, category: 'Design' },
    { name: 'Design de Sobrancelhas', tags: ['design', 'sobrancelhas', 'beleza'], trending: false, icon: Eye, category: 'Beleza' },
    { name: 'Design Gráfico', tags: ['design', 'gráfico', 'visual'], trending: false, icon: Palette, category: 'Design' },
    { name: 'Design Thinking', tags: ['design thinking', 'inovação', 'criatividade'], trending: false, icon: Lightbulb, category: 'Negócios' },
    { name: 'Desenvolvimento de Aplicativos', tags: ['desenvolvimento', 'aplicativos', 'apps'], trending: false, icon: Smartphone, category: 'Tecnologia' },
    { name: 'Desenvolvimento de Jogos', tags: ['desenvolvimento', 'jogos', 'games'], trending: false, icon: Gamepad2, category: 'Tecnologia' },
    { name: 'Desenvolvimento de Pessoas', tags: ['desenvolvimento', 'pessoas', 'rh'], trending: false, icon: Users, category: 'RH' },
    { name: 'Desenvolvimento Mobile', tags: ['desenvolvimento', 'mobile', 'apps'], trending: false, icon: Smartphone, category: 'Tecnologia' },
    { name: 'Desenvolvimento Organizacional', tags: ['desenvolvimento', 'organizacional', 'empresas'], trending: false, icon: Building, category: 'Negócios' },
    { name: 'Desenvolvimento Pessoal', tags: ['desenvolvimento', 'pessoal', 'crescimento'], trending: false, icon: UserCircle, category: 'Desenvolvimento Pessoal' },
    { name: 'Desenvolvimento Web', tags: ['desenvolvimento', 'web', 'programação'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'DevOps', tags: ['devops', 'tecnologia', 'desenvolvimento'], trending: false, icon: Server, category: 'Tecnologia' },
    { name: 'Direito', tags: ['direito', 'lei', 'justiça'], trending: false, icon: Scale, category: 'Direito' },
    { name: 'Direito Digital', tags: ['direito', 'digital', 'tecnologia'], trending: false, icon: Scale, category: 'Direito' },
    { name: 'Direito do Trabalho', tags: ['direito', 'trabalho', 'trabalhista'], trending: false, icon: Briefcase, category: 'Direito' },
    { name: 'Direito Empresarial', tags: ['direito', 'empresarial', 'negócios'], trending: false, icon: Building, category: 'Direito' },
    { name: 'Direito Tributário', tags: ['direito', 'tributário', 'impostos'], trending: false, icon: Calculator, category: 'Direito' },
    { name: 'Documentários', tags: ['documentários', 'vídeo', 'produção'], trending: false, icon: Film, category: 'Mídia' },
    { name: 'Dropshipping', tags: ['dropshipping', 'e-commerce', 'vendas'], trending: false, icon: Package, category: 'E-commerce' },
    { name: 'E-commerce', tags: ['e-commerce', 'loja online', 'vendas'], trending: false, icon: ShoppingCart, category: 'E-commerce' },
    { name: 'Economia', tags: ['economia', 'finanças', 'mercado'], trending: false, icon: LineChart, category: 'Finanças' },
    { name: 'Edição de Áudio', tags: ['edição', 'áudio', 'som'], trending: false, icon: Music, category: 'Mídia' },
    { name: 'Edição de Vídeo', tags: ['edição', 'vídeo', 'produção'], trending: false, icon: Video, category: 'Mídia' },
    { name: 'Edição de Vídeos com IA', tags: ['edição', 'vídeo', 'ia'], trending: false, icon: Video, category: 'Mídia' },
    { name: 'Educação Financeira', tags: ['educação', 'financeira', 'dinheiro'], trending: false, icon: DollarSign, category: 'Finanças' },
    { name: 'Educação Física', tags: ['educação', 'física', 'esportes'], trending: false, icon: Dumbbell, category: 'Saúde' },
    { name: 'Eletrônica', tags: ['eletrônica', 'tecnologia', 'circuitos'], trending: false, icon: Cpu, category: 'Tecnologia' },
    { name: 'Emagrecimento', tags: ['emagrecimento', 'saúde', 'dieta'], trending: false, icon: Activity, category: 'Saúde' },
    { name: 'Empreendedorismo', tags: ['empreendedorismo', 'negócios', 'startup'], trending: false, icon: Rocket, category: 'Negócios' },
    { name: 'Empreendedorismo Digital', tags: ['empreendedorismo', 'digital', 'online'], trending: false, icon: Laptop, category: 'Negócios' },
    { name: 'Empreendedorismo Feminino', tags: ['empreendedorismo', 'feminino', 'mulheres'], trending: false, icon: Users2, category: 'Negócios' },
    { name: 'Enfermagem', tags: ['enfermagem', 'saúde', 'cuidados'], trending: false, icon: Stethoscope, category: 'Saúde' },
    { name: 'Engenharia', tags: ['engenharia', 'tecnologia', 'construção'], trending: false, icon: Wrench, category: 'Engenharia' },
    { name: 'Engenharia Civil', tags: ['engenharia', 'civil', 'construção'], trending: false, icon: Building, category: 'Engenharia' },
    { name: 'Engenharia de Dados', tags: ['engenharia', 'dados', 'data'], trending: false, icon: Database, category: 'Tecnologia' },
    { name: 'Engenharia de Produção', tags: ['engenharia', 'produção', 'processos'], trending: false, icon: Factory, category: 'Engenharia' },
    { name: 'Engenharia de Software', tags: ['engenharia', 'software', 'programação'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Espanhol', tags: ['espanhol', 'idioma', 'língua'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Espiritualidade', tags: ['espiritualidade', 'autoconhecimento', 'energia'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Estética Automotiva', tags: ['estética', 'automotiva', 'carro'], trending: false, icon: Car, category: 'Automotivo' },
    { name: 'Estética Facial', tags: ['estética', 'facial', 'beleza'], trending: false, icon: Sparkles, category: 'Beleza' },
    { name: 'Estratégia de Negócios', tags: ['estratégia', 'negócios', 'gestão'], trending: false, icon: Target, category: 'Negócios' },
    { name: 'Ética Profissional', tags: ['ética', 'profissional', 'valores'], trending: false, icon: Shield, category: 'Carreira' },
    { name: 'Excel', tags: ['excel', 'planilhas', 'microsoft'], trending: false, icon: BarChart3, category: 'Produtividade' },
    { name: 'Excel Avançado', tags: ['excel', 'avançado', 'planilhas'], trending: false, icon: BarChart3, category: 'Produtividade' },
    { name: 'Extensão de Cílios', tags: ['extensão', 'cílios', 'beleza'], trending: false, icon: Eye, category: 'Beleza' },
    { name: 'Facebook Ads', tags: ['facebook', 'ads', 'marketing'], trending: false, icon: Megaphone, category: 'Marketing' },
    { name: 'Farmácia', tags: ['farmácia', 'saúde', 'medicamentos'], trending: false, icon: Stethoscope, category: 'Saúde' },
    { name: 'Finanças', tags: ['finanças', 'dinheiro', 'investimentos'], trending: false, icon: DollarSign, category: 'Finanças' },
    { name: 'Finanças Corporativas', tags: ['finanças', 'corporativas', 'empresarial'], trending: false, icon: Building, category: 'Finanças' },
    { name: 'Finanças Pessoais', tags: ['finanças', 'pessoais', 'dinheiro'], trending: false, icon: Wallet, category: 'Finanças' },
    { name: 'Fisioterapia', tags: ['fisioterapia', 'saúde', 'reabilitação'], trending: false, icon: Activity, category: 'Saúde' },
    { name: 'Fitness', tags: ['fitness', 'saúde', 'exercícios'], trending: false, icon: Dumbbell, category: 'Saúde' },
    { name: 'Fotografia', tags: ['fotografia', 'foto', 'imagem'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia de Produtos', tags: ['fotografia', 'produtos', 'comercial'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Fotografia Profissional', tags: ['fotografia', 'profissional', 'câmera'], trending: false, icon: Camera, category: 'Fotografia' },
    { name: 'Francês', tags: ['francês', 'idioma', 'língua'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Freelancer', tags: ['freelancer', 'autônomo', 'trabalho'], trending: false, icon: Briefcase, category: 'Carreira' },
    { name: 'Front-end', tags: ['front-end', 'web', 'programação'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Funil de Vendas', tags: ['funil', 'vendas', 'marketing'], trending: false, icon: Target, category: 'Marketing' },
    { name: 'Funil Gamificado', tags: ['funil', 'gamificado', 'marketing'], trending: false, icon: Gamepad2, category: 'Marketing' },
    { name: 'Gastronomia', tags: ['gastronomia', 'culinária', 'cozinha'], trending: false, icon: ChefHat, category: 'Culinária' },
    { name: 'Gemini (Google IA)', tags: ['gemini', 'google', 'ia'], trending: false, icon: Bot, category: 'Tecnologia' },
    { name: 'Gestão Ambiental', tags: ['gestão', 'ambiental', 'sustentabilidade'], trending: false, icon: Leaf, category: 'Meio Ambiente' },
    { name: 'Gestão Comercial', tags: ['gestão', 'comercial', 'vendas'], trending: false, icon: Store, category: 'Negócios' },
    { name: 'Gestão de Conflitos', tags: ['gestão', 'conflitos', 'resolução'], trending: false, icon: Users, category: 'RH' },
    { name: 'Gestão de Equipes', tags: ['gestão', 'equipes', 'liderança'], trending: false, icon: Users, category: 'Gestão' },
    { name: 'Gestão de Pessoas', tags: ['gestão', 'pessoas', 'rh'], trending: false, icon: Users, category: 'RH' },
    { name: 'Gestão de Processos', tags: ['gestão', 'processos', 'eficiência'], trending: false, icon: Settings, category: 'Gestão' },
    { name: 'Gestão de Projetos', tags: ['gestão', 'projetos', 'planejamento'], trending: false, icon: CheckCircle, category: 'Gestão' },
    { name: 'Gestão de Redes Sociais', tags: ['gestão', 'redes sociais', 'social media'], trending: false, icon: Share2, category: 'Marketing' },
    { name: 'Gestão de Talentos', tags: ['gestão', 'talentos', 'rh'], trending: false, icon: Award, category: 'RH' },
    { name: 'Gestão de Tempo', tags: ['gestão', 'tempo', 'produtividade'], trending: false, icon: Clock, category: 'Produtividade' },
    { name: 'Gestão de Tráfego', tags: ['gestão', 'tráfego', 'marketing'], trending: false, icon: TrendingUp, category: 'Marketing' },
    { name: 'Gestão Empresarial', tags: ['gestão', 'empresarial', 'negócios'], trending: false, icon: Building, category: 'Gestão' },
    { name: 'Gestão Financeira', tags: ['gestão', 'financeira', 'finanças'], trending: false, icon: DollarSign, category: 'Finanças' },
    { name: 'Gestão Pública', tags: ['gestão', 'pública', 'governo'], trending: false, icon: Building2, category: 'Administração' },
    { name: 'Git e GitHub', tags: ['git', 'github', 'versionamento'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Google Ads', tags: ['google', 'ads', 'marketing'], trending: false, icon: SearchIcon, category: 'Marketing' },
    { name: 'Google Analytics', tags: ['google', 'analytics', 'análise'], trending: false, icon: BarChart3, category: 'Marketing' },
    { name: 'Governança Corporativa', tags: ['governança', 'corporativa', 'gestão'], trending: false, icon: Building, category: 'Gestão' },
    { name: 'Growth Hacking', tags: ['growth', 'hacking', 'crescimento'], trending: false, icon: Rocket, category: 'Marketing' },
    { name: 'Hard Skills', tags: ['hard skills', 'habilidades', 'técnicas'], trending: false, icon: Award, category: 'Carreira' },
    { name: 'Harmonização Facial', tags: ['harmonização', 'facial', 'estética'], trending: false, icon: Sparkles, category: 'Beleza' },
    { name: 'Hipnose', tags: ['hipnose', 'terapia', 'mente'], trending: false, icon: Brain, category: 'Saúde' },
    { name: 'Hobbies e Lazer', tags: ['hobbies', 'lazer', 'entretenimento'], trending: false, icon: Heart, category: 'Lazer' },
    { name: 'HTML', tags: ['html', 'web', 'programação'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Idiomas', tags: ['idiomas', 'línguas', 'aprendizado'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Ilustração Digital', tags: ['ilustração', 'digital', 'arte'], trending: false, icon: Paintbrush, category: 'Design' },
    { name: 'Imersão em IA', tags: ['imersão', 'ia', 'inteligência artificial'], trending: false, icon: Brain, category: 'Tecnologia' },
    { name: 'Importação', tags: ['importação', 'comércio', 'exterior'], trending: false, icon: Globe, category: 'Negócios' },
    { name: 'Inbound Marketing', tags: ['inbound', 'marketing', 'conteúdo'], trending: false, icon: Target, category: 'Marketing' },
    { name: 'Infoprodutos', tags: ['infoprodutos', 'digital', 'produtos'], trending: false, icon: Package, category: 'Marketing' },
    { name: 'Informática', tags: ['informática', 'computador', 'tecnologia'], trending: false, icon: Laptop, category: 'Tecnologia' },
    { name: 'Informática Básica', tags: ['informática', 'básica', 'computador'], trending: false, icon: Laptop, category: 'Tecnologia' },
    { name: 'Inglês', tags: ['inglês', 'idioma', 'língua'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Inglês para Negócios', tags: ['inglês', 'negócios', 'business'], trending: false, icon: Briefcase, category: 'Idiomas' },
    { name: 'Instagram Marketing', tags: ['instagram', 'marketing', 'redes sociais'], trending: false, icon: Camera, category: 'Marketing' },
    { name: 'Inteligência Artificial', tags: ['inteligência', 'artificial', 'ia'], trending: false, icon: Brain, category: 'Tecnologia' },
    { name: 'Inteligência Artificial Generativa', tags: ['ia', 'generativa', 'tecnologia'], trending: false, icon: Bot, category: 'Tecnologia' },
    { name: 'Inteligência de Mercado', tags: ['inteligência', 'mercado', 'análise'], trending: false, icon: BarChart3, category: 'Negócios' },
    { name: 'Inteligência Emocional', tags: ['inteligência', 'emocional', 'emoções'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Investimentos', tags: ['investimentos', 'finanças', 'dinheiro'], trending: false, icon: LineChart, category: 'Finanças' },
    { name: 'Investimentos em Ações', tags: ['investimentos', 'ações', 'bolsa'], trending: false, icon: TrendingUp, category: 'Finanças' },
    { name: 'Investimentos Imobiliários', tags: ['investimentos', 'imobiliários', 'imóveis'], trending: false, icon: Building, category: 'Finanças' },
    { name: 'Italiano', tags: ['italiano', 'idioma', 'língua'], trending: false, icon: Languages, category: 'Idiomas' },
    { name: 'Java', tags: ['java', 'programação', 'desenvolvimento'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'JavaScript', tags: ['javascript', 'programação', 'web'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Jornalismo', tags: ['jornalismo', 'notícias', 'mídia'], trending: false, icon: FileText, category: 'Comunicação' },
    { name: 'Jornalismo Digital', tags: ['jornalismo', 'digital', 'online'], trending: false, icon: Globe, category: 'Comunicação' },
    { name: 'Kotlin', tags: ['kotlin', 'programação', 'mobile'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Landing Pages', tags: ['landing pages', 'conversão', 'marketing'], trending: false, icon: Layout, category: 'Marketing' },
    { name: 'Laravel', tags: ['laravel', 'php', 'programação'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Lashes (Cílios)', tags: ['lashes', 'cílios', 'beleza'], trending: false, icon: Eye, category: 'Beleza' },
    { name: 'Leilões', tags: ['leilões', 'compra', 'venda'], trending: false, icon: Hammer, category: 'Negócios' },
    { name: 'Letras', tags: ['letras', 'literatura', 'idiomas'], trending: false, icon: BookOpen, category: 'Educação' },
    { name: 'Libras', tags: ['libras', 'linguagem', 'sinais'], trending: false, icon: Hand, category: 'Idiomas' },
    { name: 'Liderança', tags: ['liderança', 'gestão', 'equipes'], trending: false, icon: Award, category: 'Gestão' },
    { name: 'Liderança Estratégica', tags: ['liderança', 'estratégica', 'gestão'], trending: false, icon: Target, category: 'Gestão' },
    { name: 'Liderança Feminina', tags: ['liderança', 'feminina', 'mulheres'], trending: false, icon: Users2, category: 'Gestão' },
    { name: 'LinkedIn', tags: ['linkedin', 'networking', 'profissional'], trending: false, icon: Briefcase, category: 'Carreira' },
    { name: 'Logística', tags: ['logística', 'transporte', 'supply chain'], trending: false, icon: Truck, category: 'Logística' },
    { name: 'Machine Learning', tags: ['machine learning', 'ia', 'aprendizado'], trending: false, icon: Brain, category: 'Tecnologia' },
    { name: 'Manutenção de Celulares', tags: ['manutenção', 'celulares', 'reparo'], trending: false, icon: Smartphone, category: 'Tecnologia' },
    { name: 'Manutenção de Computadores', tags: ['manutenção', 'computadores', 'reparo'], trending: false, icon: Laptop, category: 'Tecnologia' },
    { name: 'Manutenção de Equipamentos', tags: ['manutenção', 'equipamentos', 'reparo'], trending: false, icon: Wrench, category: 'Manutenção' },
    { name: 'Manutenção de Motos', tags: ['manutenção', 'motos', 'mecânica'], trending: false, icon: Bike, category: 'Automotivo' },
    { name: 'Maquiagem', tags: ['maquiagem', 'beleza', 'makeup'], trending: false, icon: Sparkles, category: 'Beleza' },
    { name: 'Maquiagem Artística', tags: ['maquiagem', 'artística', 'makeup'], trending: false, icon: Paintbrush, category: 'Beleza' },
    { name: 'Maquiagem Profissional', tags: ['maquiagem', 'profissional', 'makeup'], trending: false, icon: Sparkles, category: 'Beleza' },
    { name: 'Marketing', tags: ['marketing', 'divulgação', 'vendas'], trending: false, icon: Megaphone, category: 'Marketing' },
    { name: 'Marketing de Afiliados', tags: ['marketing', 'afiliados', 'comissão'], trending: false, icon: Share2, category: 'Marketing' },
    { name: 'Marketing de Conteúdo', tags: ['marketing', 'conteúdo', 'estratégia'], trending: false, icon: FileText, category: 'Marketing' },
    { name: 'Marketing de Influência', tags: ['marketing', 'influência', 'influenciadores'], trending: false, icon: Users, category: 'Marketing' },
    { name: 'Marketing Digital', tags: ['marketing', 'digital', 'online'], trending: false, icon: Laptop, category: 'Marketing' },
    { name: 'Marketing Pessoal', tags: ['marketing', 'pessoal', 'marca pessoal'], trending: false, icon: UserCircle, category: 'Carreira' },
    { name: 'Massoterapia', tags: ['massoterapia', 'massagem', 'terapia'], trending: false, icon: Heart, category: 'Saúde' },
    { name: 'Matte Painting', tags: ['matte painting', 'digital', 'arte'], trending: false, icon: Paintbrush, category: 'Design' },
    { name: 'Mecânica', tags: ['mecânica', 'carro', 'manutenção'], trending: false, icon: Wrench, category: 'Automotivo' },
    { name: 'Mecânica de Motos', tags: ['mecânica', 'motos', 'reparo'], trending: false, icon: Bike, category: 'Automotivo' },
    { name: 'Medicina', tags: ['medicina', 'saúde', 'médico'], trending: false, icon: Stethoscope, category: 'Saúde' },
    { name: 'Medicina Veterinária', tags: ['medicina', 'veterinária', 'animais'], trending: false, icon: Heart, category: 'Saúde' },
    { name: 'Meditação', tags: ['meditação', 'mindfulness', 'relaxamento'], trending: false, icon: Sparkles, category: 'Saúde' },
    { name: 'Mercado Financeiro', tags: ['mercado', 'financeiro', 'investimentos'], trending: false, icon: LineChart, category: 'Finanças' },
    { name: 'Mercado Livre', tags: ['mercado livre', 'vendas', 'e-commerce'], trending: false, icon: ShoppingCart, category: 'E-commerce' },
    { name: 'Metodologias Ágeis', tags: ['metodologias', 'ágeis', 'scrum'], trending: false, icon: Zap, category: 'Gestão' },
    { name: 'Microblading', tags: ['microblading', 'sobrancelhas', 'estética'], trending: false, icon: Eye, category: 'Beleza' },
    { name: 'Micropigmentação', tags: ['micropigmentação', 'estética', 'beleza'], trending: false, icon: Paintbrush, category: 'Beleza' },
    { name: 'Mindfulness', tags: ['mindfulness', 'atenção plena', 'meditação'], trending: false, icon: Brain, category: 'Saúde' },
    { name: 'Mindset', tags: ['mindset', 'mentalidade', 'crescimento'], trending: false, icon: Brain, category: 'Desenvolvimento Pessoal' },
    { name: 'Moda', tags: ['moda', 'estilo', 'fashion'], trending: false, icon: Scissors, category: 'Moda' },
    { name: 'Modelagem 3D', tags: ['modelagem', '3d', 'design'], trending: false, icon: Box, category: 'Design' },
    { name: 'Modelagem de Sobrancelhas', tags: ['modelagem', 'sobrancelhas', 'beleza'], trending: false, icon: Eye, category: 'Beleza' },
    { name: 'MongoDB', tags: ['mongodb', 'banco de dados', 'nosql'], trending: false, icon: Database, category: 'Tecnologia' },
    { name: 'Motion Design', tags: ['motion design', 'animação', 'design'], trending: false, icon: Film, category: 'Design' },
    { name: 'Motivação', tags: ['motivação', 'inspiração', 'crescimento'], trending: false, icon: Rocket, category: 'Desenvolvimento Pessoal' },
    { name: 'Música', tags: ['música', 'som', 'arte'], trending: false, icon: Music, category: 'Arte' },
    { name: 'Musculação', tags: ['musculação', 'treino', 'fitness'], trending: false, icon: Dumbbell, category: 'Saúde' },
    { name: 'MySQL', tags: ['mysql', 'banco de dados', 'sql'], trending: false, icon: Database, category: 'Tecnologia' },
    { name: 'Negociação', tags: ['negociação', 'vendas', 'acordo'], trending: false, icon: Handshake, category: 'Negócios' },
    { name: 'Negócios Digitais', tags: ['negócios', 'digitais', 'online'], trending: false, icon: Laptop, category: 'Negócios' },
    { name: 'Negócios Online', tags: ['negócios', 'online', 'internet'], trending: false, icon: Globe, category: 'Negócios' },
    { name: 'Neuromarketing', tags: ['neuromarketing', 'marketing', 'psicologia'], trending: false, icon: Brain, category: 'Marketing' },
    { name: 'Node.js', tags: ['nodejs', 'javascript', 'backend'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Numerologia', tags: ['numerologia', 'esoterismo', 'números'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Nutrição', tags: ['nutrição', 'alimentação', 'saúde'], trending: false, icon: Apple, category: 'Saúde' },
    { name: 'Nutrição Esportiva', tags: ['nutrição', 'esportiva', 'fitness'], trending: false, icon: Dumbbell, category: 'Saúde' },
    { name: 'Odontologia', tags: ['odontologia', 'dentes', 'saúde'], trending: false, icon: Smile, category: 'Saúde' },
    { name: 'Oratória', tags: ['oratória', 'falar em público', 'comunicação'], trending: false, icon: Mic, category: 'Comunicação' },
    { name: 'Organização Pessoal', tags: ['organização', 'pessoal', 'produtividade'], trending: false, icon: CheckCircle, category: 'Produtividade' },
    { name: 'Pedagogia', tags: ['pedagogia', 'educação', 'ensino'], trending: false, icon: GraduationCap, category: 'Educação' },
    { name: 'Pilates', tags: ['pilates', 'exercício', 'saúde'], trending: false, icon: Activity, category: 'Saúde' },
    { name: 'Pinterest Marketing', tags: ['pinterest', 'marketing', 'redes sociais'], trending: false, icon: Camera, category: 'Marketing' },
    { name: 'PNL (Programação Neurolinguística)', tags: ['pnl', 'programação', 'neurolinguística'], trending: false, icon: Brain, category: 'Desenvolvimento Pessoal' },
    { name: 'Podcast', tags: ['podcast', 'áudio', 'conteúdo'], trending: false, icon: Mic, category: 'Mídia' },
    { name: 'Podologia', tags: ['podologia', 'pés', 'saúde'], trending: false, icon: Footprints, category: 'Saúde' },
    { name: 'Power BI', tags: ['power bi', 'dados', 'análise'], trending: false, icon: BarChart3, category: 'Tecnologia' },
    { name: 'PowerPoint', tags: ['powerpoint', 'apresentação', 'microsoft'], trending: false, icon: FileText, category: 'Produtividade' },
    { name: 'Produção de Conteúdo', tags: ['produção', 'conteúdo', 'criação'], trending: false, icon: FileText, category: 'Marketing' },
    { name: 'Produção Musical', tags: ['produção', 'musical', 'música'], trending: false, icon: Music, category: 'Música' },
    { name: 'Produtividade', tags: ['produtividade', 'eficiência', 'organização'], trending: false, icon: Zap, category: 'Produtividade' },
    { name: 'Product Management', tags: ['product', 'management', 'gestão'], trending: false, icon: Package, category: 'Gestão' },
    { name: 'Programação', tags: ['programação', 'código', 'desenvolvimento'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Programação em C', tags: ['programação', 'c', 'linguagem'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Programação em Python', tags: ['programação', 'python', 'código'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Programação para Crianças', tags: ['programação', 'crianças', 'ensino'], trending: false, icon: Gamepad2, category: 'Educação' },
    { name: 'Prompt Engineering', tags: ['prompt', 'engineering', 'ia'], trending: false, icon: Bot, category: 'Tecnologia' },
    { name: 'Psicologia', tags: ['psicologia', 'mente', 'terapia'], trending: false, icon: Brain, category: 'Saúde' },
    { name: 'Psicologia Positiva', tags: ['psicologia', 'positiva', 'bem-estar'], trending: false, icon: Heart, category: 'Saúde' },
    { name: 'Python', tags: ['python', 'programação', 'código'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Python para Data Science', tags: ['python', 'data science', 'dados'], trending: false, icon: Database, category: 'Tecnologia' },
    { name: 'React', tags: ['react', 'javascript', 'frontend'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'React Native', tags: ['react native', 'mobile', 'app'], trending: false, icon: Smartphone, category: 'Tecnologia' },
    { name: 'Redes de Computadores', tags: ['redes', 'computadores', 'network'], trending: false, icon: Wifi, category: 'Tecnologia' },
    { name: 'Redes Sociais', tags: ['redes sociais', 'social media', 'marketing'], trending: false, icon: Share2, category: 'Marketing' },
    { name: 'Relacionamentos', tags: ['relacionamentos', 'amor', 'conexão'], trending: false, icon: Heart, category: 'Desenvolvimento Pessoal' },
    { name: 'Remuneração e Benefícios', tags: ['remuneração', 'benefícios', 'rh'], trending: false, icon: DollarSign, category: 'RH' },
    { name: 'Resolução de Conflitos', tags: ['resolução', 'conflitos', 'mediação'], trending: false, icon: Users, category: 'Gestão' },
    { name: 'Recursos Humanos', tags: ['recursos humanos', 'rh', 'gestão'], trending: false, icon: Users, category: 'RH' },
    { name: 'Retenção de Clientes', tags: ['retenção', 'clientes', 'fidelização'], trending: false, icon: Users, category: 'Marketing' },
    { name: 'Robótica', tags: ['robótica', 'tecnologia', 'automação'], trending: false, icon: Bot, category: 'Tecnologia' },
    { name: 'Ruby', tags: ['ruby', 'programação', 'código'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Saúde e Bem-estar', tags: ['saúde', 'bem-estar', 'qualidade de vida'], trending: false, icon: Heart, category: 'Saúde' },
    { name: 'Saúde Mental', tags: ['saúde', 'mental', 'psicologia'], trending: false, icon: Brain, category: 'Saúde' },
    { name: 'Scrum', tags: ['scrum', 'ágil', 'metodologia'], trending: false, icon: CheckCircle, category: 'Gestão' },
    { name: 'Segurança da Informação', tags: ['segurança', 'informação', 'tecnologia'], trending: false, icon: Shield, category: 'Tecnologia' },
    { name: 'SEO', tags: ['seo', 'otimização', 'google'], trending: false, icon: SearchIcon, category: 'Marketing' },
    { name: 'Shopify', tags: ['shopify', 'e-commerce', 'loja online'], trending: false, icon: ShoppingCart, category: 'E-commerce' },
    { name: 'Soft Skills', tags: ['soft skills', 'habilidades', 'comportamento'], trending: false, icon: Users, category: 'Carreira' },
    { name: 'SQL', tags: ['sql', 'banco de dados', 'consultas'], trending: false, icon: Database, category: 'Tecnologia' },
    { name: 'Streaming', tags: ['streaming', 'transmissão', 'ao vivo'], trending: false, icon: Video, category: 'Mídia' },
    { name: 'Sustentabilidade', tags: ['sustentabilidade', 'meio ambiente', 'ecologia'], trending: false, icon: Leaf, category: 'Meio Ambiente' },
    { name: 'Swift', tags: ['swift', 'ios', 'programação'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Tableau', tags: ['tableau', 'dados', 'visualização'], trending: false, icon: BarChart3, category: 'Tecnologia' },
    { name: 'Tarot', tags: ['tarot', 'esoterismo', 'cartas'], trending: false, icon: Sparkles, category: 'Espiritualidade' },
    { name: 'Teatro', tags: ['teatro', 'arte', 'drama'], trending: false, icon: Users, category: 'Arte' },
    { name: 'Tecnologia', tags: ['tecnologia', 'inovação', 'digital'], trending: false, icon: Cpu, category: 'Tecnologia' },
    { name: 'Terapias Alternativas', tags: ['terapias', 'alternativas', 'holística'], trending: false, icon: Sparkles, category: 'Saúde' },
    { name: 'TikTok Marketing', tags: ['tiktok', 'marketing', 'redes sociais'], trending: false, icon: Video, category: 'Marketing' },
    { name: 'Trabalho em Equipe', tags: ['trabalho', 'equipe', 'colaboração'], trending: false, icon: Users, category: 'Gestão' },
    { name: 'Tráfego Orgânico', tags: ['tráfego', 'orgânico', 'seo'], trending: false, icon: TrendingUp, category: 'Marketing' },
    { name: 'Tráfego Pago', tags: ['tráfego', 'pago', 'ads'], trending: false, icon: DollarSign, category: 'Marketing' },
    { name: 'Turismo', tags: ['turismo', 'viagens', 'travel'], trending: false, icon: Plane, category: 'Turismo' },
    { name: 'TypeScript', tags: ['typescript', 'javascript', 'programação'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'UI/UX Design', tags: ['ui', 'ux', 'design'], trending: false, icon: Layout, category: 'Design' },
    { name: 'Unhas e Manicure', tags: ['unhas', 'manicure', 'beleza'], trending: false, icon: Sparkles, category: 'Beleza' },
    { name: 'Unhas Artísticas', tags: ['unhas', 'artísticas', 'nail art'], trending: false, icon: Paintbrush, category: 'Beleza' },
    { name: 'Vendas', tags: ['vendas', 'comercial', 'negócios'], trending: false, icon: TrendingUp, category: 'Vendas' },
    { name: 'Vendas B2B', tags: ['vendas', 'b2b', 'empresarial'], trending: false, icon: Building, category: 'Vendas' },
    { name: 'Vendas Consultivas', tags: ['vendas', 'consultivas', 'consultoria'], trending: false, icon: Handshake, category: 'Vendas' },
    { name: 'Vendas Online', tags: ['vendas', 'online', 'e-commerce'], trending: false, icon: ShoppingCart, category: 'Vendas' },
    { name: 'Videomaking', tags: ['videomaking', 'vídeo', 'produção'], trending: false, icon: Video, category: 'Mídia' },
    { name: 'Visão Estratégica', tags: ['visão', 'estratégica', 'liderança'], trending: false, icon: Eye, category: 'Gestão' },
    { name: 'Vue.js', tags: ['vue', 'javascript', 'framework'], trending: false, icon: Code, category: 'Tecnologia' },
    { name: 'Web Design', tags: ['web design', 'sites', 'design'], trending: false, icon: Layout, category: 'Design' },
    { name: 'Webflow', tags: ['webflow', 'no-code', 'design'], trending: false, icon: Layout, category: 'Design' },
    { name: 'WhatsApp Business', tags: ['whatsapp', 'business', 'negócios'], trending: false, icon: MessageCircle, category: 'Marketing' },
    { name: 'WordPress', tags: ['wordpress', 'cms', 'site'], trending: false, icon: Globe, category: 'Tecnologia' },
    { name: 'Yoga', tags: ['yoga', 'exercício', 'meditação'], trending: false, icon: Activity, category: 'Saúde' },
    { name: 'YouTube', tags: ['youtube', 'vídeo', 'conteúdo'], trending: false, icon: Youtube, category: 'Mídia' },
    { name: 'YouTube Ads', tags: ['youtube', 'ads', 'marketing'], trending: false, icon: Video, category: 'Marketing' },
    { name: 'Zootecnia', tags: ['zootecnia', 'animais', 'agro'], trending: false, icon: Briefcase, category: 'Agricultura' },
  ];

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return allTopics;
    
    const query = searchQuery.toLowerCase().trim();
    return allTopics.filter(topic => 
      topic.name.toLowerCase().includes(query) ||
      topic.tags.some(tag => tag.toLowerCase().includes(query)) ||
      topic.category.toLowerCase().includes(query)
    );
  }, [searchQuery, allTopics]);

  const visibleTrendingTopics = useMemo(() => {
    return filteredTopics
      .filter(topic => topic.trending)
      .slice(0, visibleCount);
  }, [filteredTopics, visibleCount]);

  const visibleAlphabeticalTopics = useMemo(() => {
    return filteredTopics
      .filter(topic => !topic.trending)
      .slice(0, visibleCount);
  }, [filteredTopics, visibleCount]);

  const hasResults = filteredTopics.length > 0;
  const isSearching = searchQuery.trim().length > 0;
  const hasMoreToLoad = visibleCount < filteredTopics.length;

  const loadMoreTopics = useCallback(() => {
    if (isLoadingMore || !hasMoreToLoad) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 50, filteredTopics.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMoreToLoad, filteredTopics.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        if (entries[0].isIntersecting && (now - lastScrollTime.current) > 500) {
          lastScrollTime.current = now;
          loadMoreTopics();
        }
      },
      { threshold: 0.5, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget && !isSearching) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreTopics, isSearching]);

  useEffect(() => {
    setVisibleCount(50);
  }, [searchQuery]);

  return (
    <section id="topics" className="w-full py-12 md:py-20 px-4 md:px-6 bg-[hsl(var(--arsenal-bg))]">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* Título e Descrição */}
        <div className="text-center space-y-3 md:space-y-4 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--arsenal-text))] leading-tight">
            Todos os Temas
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cada tema possui diversos cursos
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar temas... (ex: programação, marketing, design)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              className="w-full h-11 md:h-14 pl-10 md:pl-12 pr-10 md:pr-12 text-base rounded-xl md:rounded-2xl border-2 border-border md:border-2 md:border-border bg-[hsl(var(--arsenal-card))] text-[hsl(var(--arsenal-text))] placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 shadow-sm md:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors z-10"
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
