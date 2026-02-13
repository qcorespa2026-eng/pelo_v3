import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
  VStack,
  Input,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ShieldCheck,
  Users,
  DollarSign,
  Sparkles,
  TrendingUp,
  BookOpen,
  Brain,
  Shield,
  Wallet,
  MessageSquare,
  BarChart3,
  Bell,
  FileText,
  Headphones,
  Smartphone,
  BotMessageSquare,
  Coins,
  MailCheck,
  Calendar,
  Zap,
} from 'lucide-react';

// --- Constants ---
/** Default UF value in CLP (fallback) */
const DEFAULT_UF_VALUE = 38_500;
/** Annual subsidy per student for ROI calculation */
const ANNUAL_SUBSIDY_PER_STUDENT = 1_500_000;
/** Average dropout rate */
const DROPOUT_RATE = 0.03;

// --- Pricing Matrix (UF netas por alumno mensual) ---
type PlanKey = 'basico' | 'profesional' | 'institucional';

interface PriceTier {
  min: number;
  max: number;
  basico: number;
  profesional: number;
  institucional: number;
}

const PRICE_MATRIX: PriceTier[] = [
  { min: 0,    max: 300,  basico: 0.022, profesional: 0.038, institucional: 0.055 },
  { min: 301,  max: 800,  basico: 0.017, profesional: 0.032, institucional: 0.045 },
  { min: 801,  max: 1500, basico: 0.013, profesional: 0.028, institucional: 0.038 },
  { min: 1501, max: 3000, basico: 0.010, profesional: 0.024, institucional: 0.032 },
  { min: 3001, max: 99999, basico: 0.009, profesional: 0.020, institucional: 0.028 },  // shadow price
];

function getPriceUF(enrollment: number, plan: PlanKey): number {
  const tier = PRICE_MATRIX.find(t => enrollment >= t.min && enrollment <= t.max);
  if (!tier) return 0;
  return tier[plan];
}

function getTierLabel(enrollment: number, lang: Lang): string {
  if (enrollment <= 300) return lang === 'es' ? '0 – 300 alumnos' : '0 – 300 students';
  if (enrollment <= 800) return lang === 'es' ? '301 – 800 alumnos' : '301 – 800 students';
  if (enrollment <= 1500) return lang === 'es' ? '801 – 1.500 alumnos' : '801 – 1,500 students';
  if (enrollment <= 3000) return lang === 'es' ? '1.501 – 3.000 alumnos' : '1,501 – 3,000 students';
  return lang === 'es' ? '+3.001 alumnos' : '3,001+ students';
}

/* ---- i18n ---- */
type Lang = 'es' | 'en';
const i18n: Record<Lang, Record<string, string>> = {
  es: {
    badge: 'CALCULADORA INTELIGENTE',
    headline: 'Calcula el precio exacto para tu institución',
    subheadline: 'Ingresa tu matrícula, elige tu plan y visualiza el costo mensual, el valor en CLP y el retorno de inversión.',
    enrollment: 'Nº de Alumnos Matriculados',
    selectPlan: 'Selecciona tu Plan',
    planBasico: 'Básico',
    planBasicoSub: 'Smart Compliance',
    planProfesional: 'Profesional',
    planProfesionalSub: 'Academic AI',
    planInstitucional: 'Institucional',
    planInstitucionalSub: 'Strategic Retention',
    popular: 'MÁS POPULAR',
    unitPrice: 'Precio Unitario',
    perStudentMonth: '/ alumno / mes',
    monthlyCost: 'Costo Mensual Total',
    plusIva: '+ IVA',
    refCLP: 'Valor Referencial CLP',
    approx: 'aprox.',
    annualCost: 'Costo Anual',
    features: 'Incluye',
    cotizar: 'Cotizar',
    contactSales: 'Contactar Ventas',
    // Plan Básico features
    fb1: 'Gestión Académica Completa (Circular 30)',
    fb2: 'Portal de Apoderados (Solo Lectura / Web)',
    fb3: 'Asistencia Digital y Leccionario',
    fb4: 'Soporte Estándar (Ticket / Email)',
    fb5: 'Sin Notificaciones App Móvil',
    fb6: 'Sin Generador de Pruebas IA',
    // Plan Profesional features
    fp1: 'Todo lo del plan Básico',
    fp2: 'App Apoderados "Activa": Push y Mensajería',
    fp3: 'Generador de Evaluaciones con IA (Ilimitado)',
    fp4: 'Soporte Prioritario (Respuesta < 4hrs)',
    fp5: 'Planificación Curricular Inteligente',
    // Plan Institucional features
    fi1: 'Todo lo del plan Profesional',
    fi2: 'IA Predictiva de Deserción Escolar',
    fi3: 'Dashboard Financiero y Gestión de Cobranza',
    fi4: 'Ejecutivo de Cuenta Dedicado (WhatsApp)',
    fi5: 'Reportes de Gestión para Sostenedores (BI)',
    // ROI Section
    roiTitle: 'Retorno de Inversión (ROI)',
    roiSubtitle: 'Proyección basada en tasa de deserción del 3% y subvención anual de $1.500.000 por alumno',
    roiLossLabel: 'Pérdida por Deserción',
    roiCostLabel: 'Costo SmartStudent',
    roiSavingsLabel: 'Dinero Recuperado',
    roiLossSub: 'alumnos × $1.500.000',
    roiMessage1: 'Con solo retener a',
    roiMessage2: 'alumnos, este plan se paga solo y te genera ganancias.',
    savingsBadge: 'ahorro vs servicios separados',
    ufNote: 'Valor UF referencial:',
    // CTA
    ctaLabel: 'Acción inmediata',
    ctaText: 'Protege tu matrícula y optimiza tu gestión.',
    ctaBtn: 'Agendar Demo',
    // Stats & Comparison
    atRisk: 'En riesgo',
    studentsYear: 'alumnos / año',
    annualLossLabel: 'Pérdida Anual',
    subsidyLabel: 'subvención',
    projectedLoss: 'Pérdida Proyectada',
    accumulated: 'acumulado',
    ssSavings: 'Ahorro Proyectado',
    potential: 'potencial',
    ssInvestmentLabel: 'Inversión SS',
    ssInvestmentSub: 'SaaS anual',
    comparison: 'Comparación directa',
    comparisonSub: 'Inacción vs inversión SmartStudent',
    accLoss: 'Pérdida acumulada',
    ssInvestment: 'Inversión SmartStudent',
    returnRatio: 'Ratio de retorno',
    chartPeriod: 'años',
    year1: '1 Año',
    year3: '3 Años',
    year5: '5 Años',
    ctaRecovery1: 'Con solo retener',
    ctaRecovery2: 'al año, la inversión se paga sola.',
    ctaRecoveryStudent: 'alumno',
    ctaRecoveryStudents: 'alumnos',
    // Nav
    navInicio: 'Inicio',
    navFeatures: 'Características',
    navRoles: 'Roles',
    navPlans: 'Planes',
    navDemo: 'Agendar Demo',
  },
  en: {
    badge: 'SMART CALCULATOR',
    headline: 'Calculate the exact price for your institution',
    subheadline: 'Enter your enrollment, choose your plan and visualize the monthly cost, CLP value and return on investment.',
    enrollment: 'Number of Enrolled Students',
    selectPlan: 'Select your Plan',
    planBasico: 'Basic',
    planBasicoSub: 'Smart Compliance',
    planProfesional: 'Professional',
    planProfesionalSub: 'Academic AI',
    planInstitucional: 'Institutional',
    planInstitucionalSub: 'Strategic Retention',
    popular: 'MOST POPULAR',
    unitPrice: 'Unit Price',
    perStudentMonth: '/ student / month',
    monthlyCost: 'Total Monthly Cost',
    plusIva: '+ VAT',
    refCLP: 'CLP Reference Value',
    approx: 'approx.',
    annualCost: 'Annual Cost',
    features: 'Includes',
    cotizar: 'Get Quote',
    contactSales: 'Contact Sales',
    fb1: 'Complete Academic Management (Circular 30)',
    fb2: 'Parent Portal (Read-Only / Web Browser)',
    fb3: 'Digital Attendance and Lesson Book',
    fb4: 'Standard Support (Ticket / Email)',
    fb5: 'No Mobile App Notifications',
    fb6: 'No AI Test Generator',
    fp1: 'Everything in Basic plan',
    fp2: '"Active" Parent App: Push & Messaging',
    fp3: 'AI Evaluation Generator (Unlimited)',
    fp4: 'Priority Support (Response < 4hrs)',
    fp5: 'Smart Curriculum Planning',
    fi1: 'Everything in Professional plan',
    fi2: 'Predictive AI for Student Dropout',
    fi3: 'Financial Dashboard & Collections',
    fi4: 'Dedicated Account Manager (WhatsApp)',
    fi5: 'Management Reports for Stakeholders (BI)',
    roiTitle: 'Return on Investment (ROI)',
    roiSubtitle: 'Projection based on 3% dropout rate and $1,500,000 annual subsidy per student',
    roiLossLabel: 'Dropout Loss',
    roiCostLabel: 'SmartStudent Cost',
    roiSavingsLabel: 'Recovered Revenue',
    roiLossSub: 'students × $1,500,000',
    roiMessage1: 'By retaining just',
    roiMessage2: 'students, this plan pays for itself and generates profit.',
    savingsBadge: 'savings vs separate services',
    ufNote: 'Reference UF value:',
    ctaLabel: 'Immediate Action',
    ctaText: 'Protect your enrollment and optimize your management.',
    ctaBtn: 'Schedule Demo',
    // Stats & Comparison
    atRisk: 'At Risk',
    studentsYear: 'students / year',
    annualLossLabel: 'Annual Loss',
    subsidyLabel: 'subsidy',
    projectedLoss: 'Projected Loss',
    accumulated: 'accumulated',
    ssSavings: 'Projected Savings',
    potential: 'potential',
    ssInvestmentLabel: 'SS Investment',
    ssInvestmentSub: 'annual SaaS',
    comparison: 'Direct Comparison',
    comparisonSub: 'Inaction vs SmartStudent investment',
    accLoss: 'Accumulated Loss',
    ssInvestment: 'SmartStudent Investment',
    returnRatio: 'Return Ratio',
    chartPeriod: 'years',
    year1: '1 Year',
    year3: '3 Years',
    year5: '5 Years',
    ctaRecovery1: 'By retaining just',
    ctaRecovery2: 'per year, the investment pays for itself.',
    ctaRecoveryStudent: 'student',
    ctaRecoveryStudents: 'students',
    navInicio: 'Home',
    navFeatures: 'Features',
    navRoles: 'Roles',
    navPlans: 'Plans',
    navDemo: 'Schedule Demo',
  },
};

/* ---- Plan features config ---- */
interface FeatureItem {
  key: string;
  icon: React.ElementType;
  iconColor: string;
  type: 'check' | 'highlight' | 'warn' | 'disabled';
}

const PLAN_FEATURES: Record<PlanKey, FeatureItem[]> = {
  basico: [
    { key: 'fb1', icon: BookOpen, iconColor: '#2563eb', type: 'check' },
    { key: 'fb2', icon: Users, iconColor: '#2563eb', type: 'check' },
    { key: 'fb3', icon: FileText, iconColor: '#2563eb', type: 'check' },
    { key: 'fb4', icon: Headphones, iconColor: '#94a3b8', type: 'warn' },
    { key: 'fb5', icon: Smartphone, iconColor: '#ef4444', type: 'disabled' },
    { key: 'fb6', icon: BotMessageSquare, iconColor: '#ef4444', type: 'disabled' },
  ],
  profesional: [
    { key: 'fp1', icon: ShieldCheck, iconColor: '#2563eb', type: 'check' },
    { key: 'fp2', icon: Bell, iconColor: '#2563eb', type: 'highlight' },
    { key: 'fp3', icon: Brain, iconColor: '#2563eb', type: 'highlight' },
    { key: 'fp4', icon: Headphones, iconColor: '#2563eb', type: 'highlight' },
    { key: 'fp5', icon: BarChart3, iconColor: '#2563eb', type: 'check' },
  ],
  institucional: [
    { key: 'fi1', icon: ShieldCheck, iconColor: '#2563eb', type: 'check' },
    { key: 'fi2', icon: Shield, iconColor: '#2563eb', type: 'highlight' },
    { key: 'fi3', icon: Coins, iconColor: '#2563eb', type: 'highlight' },
    { key: 'fi4', icon: MessageSquare, iconColor: '#2563eb', type: 'highlight' },
    { key: 'fi5', icon: TrendingUp, iconColor: '#2563eb', type: 'highlight' },
  ],
};

/* ---- Theme hook ---- */
function useThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) (root as any).__themeToggle = toggle;
  }, [toggle]);

  useEffect(() => {
    const icon = document.getElementById('navbar-theme-icon');
    if (icon) {
      icon.className = dark
        ? 'fa-solid fa-sun text-sm text-yellow-300'
        : 'fa-solid fa-moon text-sm text-slate-700 dark:text-yellow-300';
    }
  }, [dark]);

  return { dark, toggle };
}

/* ---- Animated counter ---- */
function useAnimatedNumber(target: number, duration = 500) {
  const [display, setDisplay] = useState(target);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = display;
    const diff = target - start;
    if (diff === 0) return;
    const t0 = performance.now();
    const step = (now: number) => {
      const elapsed = now - t0;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + diff * ease));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);
  return display;
}

/* ---- UF Value Hook ---- */
function useUFValue() {
  const [uf, setUf] = useState(DEFAULT_UF_VALUE);
  useEffect(() => {
    // Try to fetch current UF value from mindicador.cl API
    fetch('https://mindicador.cl/api/uf')
      .then(res => res.json())
      .then(data => {
        if (data?.serie?.[0]?.valor) {
          setUf(Math.round(data.serie[0].valor));
        }
      })
      .catch(() => { /* fallback to default */ });
  }, []);
  return uf;
}

/* ---- Mini stat card ---- */
const MiniCard: React.FC<{
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
  dark: boolean;
}> = ({ icon, iconColor, label, value, sub, dark }) => (
  <Box bg={dark ? 'gray.800' : 'white'} border="1px solid" borderColor={dark ? 'gray.700' : 'gray.200'}
    rounded="xl" px={3} py={2.5} boxShadow={dark ? '0 2px 8px -4px rgba(0,0,0,0.3)' : '0 2px 8px -4px rgba(15,23,42,0.1)'}
    transition="all 0.3s ease" cursor="pointer"
    _hover={{ transform: 'translateY(-2px)', boxShadow: dark ? '0 4px 14px -4px rgba(0,0,0,0.4)' : '0 4px 14px -4px rgba(15,23,42,0.14)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
    <HStack spacing={1.5} mb={0.5}>
      <Icon as={icon} boxSize="12px" color={iconColor} />
      <Text fontSize="10px" color={dark ? 'gray.400' : 'gray.500'} textTransform="uppercase" fontWeight="600" letterSpacing="0.04em">
        {label}
      </Text>
    </HStack>
    <Text fontSize="md" fontWeight="800" lineHeight="1.2" color={dark ? 'gray.100' : 'gray.800'}>{value}</Text>
    {sub && <Text fontSize="11px" color={dark ? 'gray.500' : 'gray.400'} mt={0.5}>{sub}</Text>}
  </Box>
);

/* ---- Compare bar ---- */
const CompareBar: React.FC<{
  label: string; value: number; maxValue: number; color: string; format: (v: number) => string; dark: boolean;
}> = ({ label, value, maxValue, color, format, dark }) => {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <Box>
      <HStack justify="space-between" mb={1}>
        <Text fontSize="12px" color={dark ? 'gray.400' : 'gray.600'}>{label}</Text>
        <Text fontSize="12px" fontWeight="700" color={dark ? 'gray.200' : undefined}>{format(value)}</Text>
      </HStack>
      <Box bg={dark ? 'gray.700' : 'gray.100'} rounded="full" h="7px" overflow="hidden">
        <Box h="full" rounded="full" bg={color} w={`${pct}%`} transition="width 0.6s ease" />
      </Box>
    </Box>
  );
};

/* ================ MAIN COMPONENT ================ */
const DropoutCalculator: React.FC = () => {
  const { dark } = useThemeToggle();
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') === 'en' ? 'en' : 'es'));
  const t = useCallback((key: string) => i18n[lang][key] ?? key, [lang]);
  const [enrollment, setEnrollment] = useState<number>(1000);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('profesional');
  const [showSliderTooltip, setShowSliderTooltip] = useState(false);
  const [temporalidad, setTemporalidad] = useState<number>(1);
  const [expanded, setExpanded] = useState(false);
  const ufValue = useUFValue();

  // Expose lang toggle to static navbar
  const langToggle = useCallback(() => setLang((l) => (l === 'es' ? 'en' : 'es')), []);
  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) (root as any).__langToggle = langToggle;
  }, [langToggle]);

  // Expose expand toggle to static navbar
  const expandToggle = useCallback(() => setExpanded((e) => !e), []);

  // Sync navbar with lang
  useEffect(() => {
    const btn = document.getElementById('navbar-lang-toggle');
    if (btn) btn.textContent = lang === 'es' ? 'ES' : 'EN';
    const navMap: Record<string, string> = {
      'nav-inicio': t('navInicio'),
      'nav-features': t('navFeatures'),
      'nav-roles': t('navRoles'),
      'nav-plans': t('navPlans'),
      'nav-demo': t('navDemo'),
    };
    Object.entries(navMap).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });
  }, [lang, t]);

  // Theme-aware styles
  const cardBg = dark ? 'gray.800' : 'white';
  const cardBorder = dark ? 'gray.700' : 'gray.200';
  const cardShadow = dark ? '0 4px 14px -6px rgba(0,0,0,0.4)' : '0 4px 14px -6px rgba(15,23,42,0.12)';
  const textPrimary = dark ? 'gray.100' : 'gray.800';
  const textSecondary = dark ? 'gray.400' : 'gray.500';
  const subtleBg = dark ? 'gray.700' : 'gray.50';

  // --- Calculations ---
  const pricing = useMemo(() => {
    const priceUF = getPriceUF(enrollment, selectedPlan);
    const needsQuote = enrollment > 3000 && selectedPlan === 'institucional';
    const unitPriceUF = priceUF;
    const monthlyUF = unitPriceUF * enrollment;
    const annualUF = monthlyUF * 12;
    const monthlyCLP = monthlyUF * ufValue;
    const annualCLP = annualUF * ufValue;

    // All plans pricing for comparison
    const allPlans = {
      basico: getPriceUF(enrollment, 'basico'),
      profesional: getPriceUF(enrollment, 'profesional'),
      institucional: getPriceUF(enrollment, 'institucional'),
    };

    return { unitPriceUF, monthlyUF, annualUF, monthlyCLP, annualCLP, needsQuote, allPlans };
  }, [enrollment, selectedPlan, ufValue]);

  // --- ROI for selected plan ---
  const roi = useMemo(() => {
    const studentsLost = Math.ceil(enrollment * DROPOUT_RATE);
    const annualLoss = studentsLost * ANNUAL_SUBSIDY_PER_STUDENT;
    const annualCostCLP = pricing.annualCLP;
    const recovered = Math.max(0, Math.round(annualLoss - annualCostCLP));
    const studentsToBreakeven = annualCostCLP > 0
      ? Math.ceil(annualCostCLP / ANNUAL_SUBSIDY_PER_STUDENT)
      : 0;

    return { studentsLost, annualLoss, annualCostCLP, recovered, studentsToBreakeven };
  }, [enrollment, ufValue, pricing.annualCLP, selectedPlan]);

  const animMonthlyCLP = useAnimatedNumber(Math.round(pricing.monthlyCLP), 400);
  const animAnnualCLP = useAnimatedNumber(Math.round(pricing.annualCLP), 400);

  // Projected calculations for stat cards
  const projectedLoss = roi.annualLoss * temporalidad;
  const projectedInvestment = pricing.annualCLP * temporalidad;
  const statSavings = projectedLoss - projectedInvestment;
  const ratio = projectedInvestment > 0 ? (projectedLoss / projectedInvestment).toFixed(1) : '∞';

  const animStudentsLost = useAnimatedNumber(roi.studentsLost, 400);
  const animAnnualLoss = useAnimatedNumber(roi.annualLoss, 600);
  const animProjectedLoss = useAnimatedNumber(projectedLoss, 600);
  const animSavings = useAnimatedNumber(statSavings, 600);

  const fmtCLP = (value: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

  const fmtUF = (value: number) =>
    `${value.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 3 })} UF`;

  // ROI Chart data (scaled by temporalidad)
  const roiChartData = [
    { name: t('roiLossLabel'), monto: roi.annualLoss * temporalidad, color: '#ef4444' },
    { name: t('roiCostLabel'), monto: roi.annualCostCLP * temporalidad, color: '#22c55e' },
    { name: t('roiSavingsLabel'), monto: roi.recovered * temporalidad, color: '#3b82f6' },
  ];

  const plans: { key: PlanKey; labelKey: string; subKey: string; color: string; isFeatured: boolean }[] = [
    { key: 'basico', labelKey: 'planBasico', subKey: 'planBasicoSub', color: '#64748b', isFeatured: false },
    { key: 'profesional', labelKey: 'planProfesional', subKey: 'planProfesionalSub', color: '#2563eb', isFeatured: true },
    { key: 'institucional', labelKey: 'planInstitucional', subKey: 'planInstitucionalSub', color: '#7c3aed', isFeatured: false },
  ];

  return (
    <Box display="flex" flexDirection="column"
      pt={{ base: 6, md: 10 }} pb={{ base: 8, md: 10 }} px={{ base: 4, md: 8 }}
      bg="transparent"
      color={dark ? '#e2e8f0' : '#0f172a'}
      transition="color 0.4s ease">
      <Box maxW="1280px" mx="auto" w="full">

        {/* ===== HEADER ===== */}
        <HStack mb={3}>
          <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full" fontSize="12px" letterSpacing="0.08em">
            {t('badge')}
          </Badge>
        </HStack>

        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} lineHeight="1.2" mb={2}
          bgGradient="linear(to-r, #2563eb, #7c3aed, #0ea5e9)" bgClip="text">
          {t('headline')}
        </Heading>
        <Text fontSize={{ base: '13px', md: '15px' }} color={textSecondary} mb={{ base: 5, md: 7 }} maxW="750px">
          {t('subheadline')}
        </Text>

        {/* ===== EXPAND / COLLAPSE TOGGLE ===== */}
        <HStack justify="flex-end" mb={2}>
          <Button
            size="sm"
            onClick={expandToggle}
            rounded="full"
            px={4}
            bg={expanded ? (dark ? 'red.900' : 'red.50') : (dark ? 'green.900' : 'green.50')}
            color={expanded ? (dark ? 'red.300' : 'red.600') : (dark ? 'green.300' : 'green.600')}
            border="1px solid"
            borderColor={expanded ? (dark ? 'red.700' : 'red.200') : (dark ? 'green.700' : 'green.200')}
            _hover={{
              bg: expanded ? (dark ? 'red.800' : 'red.100') : (dark ? 'green.800' : 'green.100'),
              transform: 'translateY(-1px)',
              boxShadow: 'sm',
            }}
            transition="all 0.2s ease"
            leftIcon={<Icon as={expanded ? Zap : Sparkles} boxSize="14px" />}
            fontWeight="700"
            fontSize="12px"
            letterSpacing="0.02em"
          >
            {expanded
              ? (lang === 'es' ? 'Vista resumida' : 'Summary view')
              : (lang === 'es' ? 'Ver análisis completo' : 'Full analysis')}
          </Button>
        </HStack>

        {/* ===== ENROLLMENT + DIRECT COMPARISON (side by side) ===== */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mb={5}>
          {/* -- LEFT: Enrollment Input -- */}
          <Box bg={cardBg} border="1px solid" borderColor={cardBorder} rounded="xl" p={{ base: 3, md: 4 }}
            boxShadow={cardShadow} transition="all 0.3s ease" cursor="pointer"
            _hover={{ transform: 'translateY(-4px)', boxShadow: dark ? '0 12px 30px -8px rgba(0,0,0,0.5)' : '0 12px 30px -8px rgba(15,23,42,0.18)', borderColor: dark ? 'gray.500' : 'blue.300' }}>
            <HStack justify="space-between" mb={2} flexWrap="wrap" gap={2}>
              <HStack spacing={2}>
                <Box bg={dark ? 'blue.900' : 'blue.50'} p={1.5} rounded="lg">
                  <Icon as={Users} boxSize="14px" color="blue.500" />
                </Box>
                <Box>
                  <Text fontSize="13px" fontWeight="700" color={textPrimary}>{t('enrollment')}</Text>
                  <Text fontSize="10px" color={textSecondary}>{getTierLabel(enrollment, lang)}</Text>
                </Box>
              </HStack>
              <HStack spacing={2} align="center">
                <Input
                  type="number" value={enrollment} size="sm" rounded="lg" textAlign="center"
                  maxW="90px" fontWeight="800" fontSize="md"
                  bg={dark ? 'gray.700' : 'gray.50'} borderColor={dark ? 'gray.600' : 'blue.200'}
                  color={textPrimary}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3b82f6' }}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v >= 1 && v <= 10000) setEnrollment(v);
                    else if (v > 10000) setEnrollment(10000);
                  }}
                  min={1} max={10000}
                />
                <Text fontSize="xs" color={textSecondary} fontWeight="500">
                  {lang === 'es' ? 'alumnos' : 'students'}
                </Text>
              </HStack>
            </HStack>

            <Box px={1}>
              <Slider
                aria-label="enrollment-slider"
                value={enrollment} min={50} max={5000} step={10}
                onChange={(v) => setEnrollment(v)}
                onMouseEnter={() => setShowSliderTooltip(true)}
                onMouseLeave={() => setShowSliderTooltip(false)}
                focusThumbOnChange={false}
              >
                <SliderTrack bg={dark ? 'gray.600' : 'gray.200'} h="6px" rounded="full">
                  <SliderFilledTrack bg="blue.500" rounded="full" />
                </SliderTrack>
                {showSliderTooltip && (
                  <SliderMark
                    value={enrollment}
                    textAlign="center"
                    bg="blue.600"
                    color="white"
                    fontSize="xs"
                    fontWeight="700"
                    rounded="md"
                    px={2}
                    py={0.5}
                    mt="-10"
                    ml="-5"
                    zIndex={10}
                    pointerEvents="none"
                  >
                    {enrollment}
                  </SliderMark>
                )}
                <SliderThumb boxSize="18px" bg="blue.600" border="2px solid white"
                  boxShadow="0 2px 6px rgba(37,99,235,0.4)"
                  _focus={{ boxShadow: '0 0 0 2px rgba(37,99,235,0.3)' }} />
              </Slider>
            </Box>

            <HStack mt={2} justify="flex-end">
              <Text fontSize="10px" color={textSecondary}>
                {t('ufNote')} ${ufValue.toLocaleString('es-CL')} CLP
              </Text>
            </HStack>
          </Box>

          {/* -- RIGHT: Direct Comparison -- */}
          <Box bg={cardBg} border="1px solid" borderColor={cardBorder} rounded="xl" px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}
            boxShadow={cardShadow} transition="all 0.3s ease" cursor="pointer"
            _hover={{ transform: 'translateY(-2px)', boxShadow: dark ? '0 6px 18px -4px rgba(0,0,0,0.4)' : '0 6px 18px -4px rgba(15,23,42,0.14)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
            <Text fontSize="12px" fontWeight="700" mb={0.5} color={textPrimary}>{t('comparison')} ({temporalidad} {temporalidad === 1 ? (lang === 'es' ? 'año' : 'year') : (lang === 'es' ? 'años' : 'years')})</Text>
            <Text fontSize="10px" color={textSecondary} mb={2}>{t('comparisonSub')}</Text>
            <VStack spacing={2} align="stretch">
              <CompareBar dark={dark} label={t('accLoss')} value={projectedLoss}
                maxValue={projectedLoss} color="#f97316" format={fmtCLP} />
              <CompareBar dark={dark} label={t('ssInvestment')} value={projectedInvestment}
                maxValue={projectedLoss} color="#22c55e" format={fmtCLP} />
            </VStack>
            <HStack mt={2} p={1.5} bg={subtleBg} rounded="md" justify="space-between">
              <Text fontSize="11px" color={textSecondary}>{t('returnRatio')}</Text>
              <Badge colorScheme="green" fontSize="xs" px={1.5}>{ratio}x</Badge>
            </HStack>
          </Box>
        </SimpleGrid>

        {/* ===== PLAN SELECTOR + STAT CARDS SIDE BY SIDE ===== */}
        <Text fontSize="14px" fontWeight="700" color={textPrimary} mb={2}>{t('selectPlan')}</Text>
        <Box display={{ base: 'flex', md: 'grid' }} flexDirection="column"
          gridTemplateColumns={{ md: expanded ? '1fr' : '1fr 1.2fr' }} gap={5} mb={5}>

          {/* Plan cards (full width when expanded, left column when compact) */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.key;
              return (
                <Box key={plan.key}
                  bg={isSelected ? (dark ? 'gray.750' : 'white') : (dark ? 'gray.800' : 'gray.50')}
                  border="2px solid"
                  borderColor={isSelected ? plan.color : (dark ? 'gray.700' : 'gray.200')}
                  rounded="xl" p={4} cursor="pointer" position="relative"
                  transition="all 0.3s ease"
                  display="flex" alignItems="center" justifyContent="center"
                  boxShadow={isSelected ? `0 6px 20px -6px ${plan.color}30` : cardShadow}
                  _hover={{
                    transform: 'translateY(-3px)',
                    borderColor: plan.color,
                    boxShadow: `0 8px 24px -6px ${plan.color}25`,
                  }}
                  onClick={() => setSelectedPlan(plan.key)}
                  role="radio" aria-checked={isSelected} tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedPlan(plan.key); }}
                >
                  {plan.isFeatured && (
                    <Badge position="absolute" top={-2} right={2}
                      bg="blue.600" color="white" fontSize="8px" fontWeight="800"
                      px={1.5} py={0.5} borderRadius="full" letterSpacing="0.05em">
                      {t('popular')}
                    </Badge>
                  )}
                  <Text fontSize="lg" fontWeight="900" color={plan.color} textAlign="center"
                    letterSpacing="0.02em" textShadow={isSelected ? `0 0 20px ${plan.color}40` : 'none'}>
                      {t(plan.labelKey)}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* RIGHT: 4 stat cards in 2x2 grid (only in compact mode) */}
          {!expanded && <SimpleGrid columns={2} spacing={2}>
            <HStack bg={dark ? 'gray.800' : 'white'} border="1px solid" borderColor={dark ? 'gray.700' : 'gray.200'}
              rounded="lg" px={2.5} py={1.5} spacing={2} cursor="pointer" transition="all 0.3s ease"
              boxShadow={dark ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 4px rgba(15,23,42,0.06)'}
              _hover={{ transform: 'translateY(-3px)', boxShadow: dark ? '0 6px 18px -4px rgba(0,0,0,0.4)' : '0 6px 18px -4px rgba(15,23,42,0.14)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
              <Icon as={Users} boxSize="11px" color="orange.500" flexShrink={0} />
              <Box>
                <Text fontSize="9px" color={dark ? 'gray.400' : 'gray.500'} fontWeight="600" textTransform="uppercase" lineHeight="1">{t('atRisk')}</Text>
                <Text fontSize="sm" fontWeight="800" color={dark ? 'gray.100' : 'gray.800'} lineHeight="1.3">{animStudentsLost}</Text>
                <Text fontSize="9px" color={dark ? 'gray.500' : 'gray.400'} lineHeight="1">{t('studentsYear')}</Text>
              </Box>
            </HStack>
            <HStack bg={dark ? 'gray.800' : 'white'} border="1px solid" borderColor={dark ? 'gray.700' : 'gray.200'}
              rounded="lg" px={2.5} py={1.5} spacing={2} cursor="pointer" transition="all 0.3s ease"
              boxShadow={dark ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 4px rgba(15,23,42,0.06)'}
              _hover={{ transform: 'translateY(-3px)', boxShadow: dark ? '0 6px 18px -4px rgba(0,0,0,0.4)' : '0 6px 18px -4px rgba(15,23,42,0.14)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
              <Icon as={DollarSign} boxSize="11px" color="red.500" flexShrink={0} />
              <Box>
                <Text fontSize="9px" color={dark ? 'gray.400' : 'gray.500'} fontWeight="600" textTransform="uppercase" lineHeight="1">{t('annualLossLabel')}</Text>
                <Text fontSize="sm" fontWeight="800" color={dark ? 'gray.100' : 'gray.800'} lineHeight="1.3">{fmtCLP(animAnnualLoss)}</Text>
                <Text fontSize="9px" color={dark ? 'gray.500' : 'gray.400'} lineHeight="1">{t('subsidyLabel')}</Text>
              </Box>
            </HStack>
            <HStack bg={dark ? 'gray.800' : 'white'} border="1px solid" borderColor={dark ? 'gray.700' : 'gray.200'}
              rounded="lg" px={2.5} py={1.5} spacing={2} cursor="pointer" transition="all 0.3s ease"
              boxShadow={dark ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 4px rgba(15,23,42,0.06)'}
              _hover={{ transform: 'translateY(-3px)', boxShadow: dark ? '0 6px 18px -4px rgba(0,0,0,0.4)' : '0 6px 18px -4px rgba(15,23,42,0.14)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
              <Icon as={Calendar} boxSize="11px" color="orange.400" flexShrink={0} />
              <Box>
                <Text fontSize="9px" color={dark ? 'gray.400' : 'gray.500'} fontWeight="600" textTransform="uppercase" lineHeight="1">{t('projectedLoss')}</Text>
                <Text fontSize="sm" fontWeight="800" color={dark ? 'gray.100' : 'gray.800'} lineHeight="1.3">{fmtCLP(animProjectedLoss)}</Text>
                <Text fontSize="9px" color={dark ? 'gray.500' : 'gray.400'} lineHeight="1">{`${temporalidad} ${t('chartPeriod')} ${t('accumulated')}`}</Text>
              </Box>
            </HStack>
            <HStack bg={dark ? 'gray.800' : 'white'} border="1px solid" borderColor={dark ? 'gray.700' : 'gray.200'}
              rounded="lg" px={2.5} py={1.5} spacing={2} cursor="pointer" transition="all 0.3s ease"
              boxShadow={dark ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 4px rgba(15,23,42,0.06)'}
              _hover={{ transform: 'translateY(-3px)', boxShadow: dark ? '0 6px 18px -4px rgba(0,0,0,0.4)' : '0 6px 18px -4px rgba(15,23,42,0.14)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
              <Icon as={Zap} boxSize="11px" color="green.500" flexShrink={0} />
              <Box>
                <Text fontSize="9px" color={dark ? 'gray.400' : 'gray.500'} fontWeight="600" textTransform="uppercase" lineHeight="1">{t('ssSavings')}</Text>
                <Text fontSize="sm" fontWeight="800" color={dark ? 'gray.100' : 'gray.800'} lineHeight="1.3">{fmtCLP(animSavings)}</Text>
                <Text fontSize="9px" color={dark ? 'gray.500' : 'gray.400'} lineHeight="1">{`${temporalidad} ${t('chartPeriod')} ${t('potential')}`}</Text>
              </Box>
            </HStack>
          </SimpleGrid>}
        </Box>

        {/* ===== EXPANDED: TEMPORALIDAD SELECTOR + LARGE STAT CARDS ===== */}
        {expanded && (
          <Box mb={5}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
              <MiniCard dark={dark} icon={Users} iconColor="orange.500" label={t('atRisk')}
                value={String(animStudentsLost)} sub={t('studentsYear')} />
              <MiniCard dark={dark} icon={DollarSign} iconColor="red.500" label={t('annualLossLabel')}
                value={fmtCLP(animAnnualLoss)} sub={t('subsidyLabel')} />
              <MiniCard dark={dark} icon={Calendar} iconColor="orange.400" label={t('projectedLoss')}
                value={fmtCLP(animProjectedLoss)} sub={`${temporalidad} ${t('chartPeriod')} ${t('accumulated')}`} />
              <MiniCard dark={dark} icon={Zap} iconColor="green.500" label={t('ssSavings')}
                value={fmtCLP(animSavings)} sub={`${temporalidad} ${t('chartPeriod')} ${t('potential')}`} />
            </SimpleGrid>
          </Box>
        )}

        {/* ===== MAIN CONTENT: Pricing + ROI Chart ===== */}
        <Box display={{ base: 'flex', md: 'grid' }} flexDirection="column"
          gridTemplateColumns={{ md: '1fr 1.2fr' }}
          gap={5}>

          {/* —— LEFT: Pricing Summary Card —— */}
          {(() => {
            const planColor = plans.find(p => p.key === selectedPlan)!.color;
            return (
          <Box bg={cardBg} border="2px solid" borderColor={planColor} rounded="xl" p={5}
            boxShadow={`0 4px 20px -6px ${planColor}25`} transition="all 0.3s ease"
            cursor="pointer"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 30px -8px ${planColor}40`,
              borderColor: planColor,
            }}>

            {/* Summary numbers */}
              <VStack spacing={4} align="stretch">
                {/* Main price */}
                <Box textAlign="center" py={3} bg={dark ? 'gray.750' : 'blue.50'} rounded="xl"
                  border="1px solid" borderColor={dark ? 'gray.600' : 'blue.100'}>
                  <Text fontSize="11px" color={textSecondary} mb={0.5} fontWeight="600" textTransform="uppercase">{t('unitPrice')}</Text>
                  {pricing.needsQuote ? (
                    <>
                      <Text fontSize="2xl" fontWeight="900" color="purple.400">
                        {lang === 'es' ? 'Cotizar' : 'Quote'}
                      </Text>
                      <Text fontSize="10px" color={textSecondary} mt={0.5}>
                        *{lang === 'es' ? 'Cálculos basados en valor referencial' : 'Calculations based on reference value'}: {fmtUF(pricing.unitPriceUF)}
                      </Text>
                    </>
                  ) : (
                    <Text fontSize="2xl" fontWeight="900" color={planColor}>
                      {fmtUF(pricing.unitPriceUF)}
                    </Text>
                  )}
                  <Text fontSize="11px" color={textSecondary}>{t('perStudentMonth')}</Text>
                </Box>

                <SimpleGrid columns={2} spacing={3}>
                  <Box bg={dark ? 'gray.750' : 'gray.50'} rounded="lg" p={3} textAlign="center"
                    border="1px solid" borderColor={dark ? 'gray.600' : 'gray.100'}>
                    <HStack spacing={1} justify="center" mb={0.5}>
                      <Icon as={DollarSign} boxSize="12px" color="green.500" />
                      <Text fontSize="10px" color={textSecondary} fontWeight="600" textTransform="uppercase">{t('monthlyCost')}</Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="800" color={textPrimary}>
                      {fmtUF(pricing.monthlyUF)}
                    </Text>
                    <Text fontSize="10px" color={textSecondary}>{t('plusIva')}</Text>
                  </Box>
                  <Box bg={dark ? 'gray.750' : 'gray.50'} rounded="lg" p={3} textAlign="center"
                    border="1px solid" borderColor={dark ? 'gray.600' : 'gray.100'}>
                    <HStack spacing={1} justify="center" mb={0.5}>
                      <Icon as={Wallet} boxSize="12px" color="purple.500" />
                      <Text fontSize="10px" color={textSecondary} fontWeight="600" textTransform="uppercase">{t('refCLP')}</Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="800" color={textPrimary}>
                      {fmtCLP(animMonthlyCLP)}
                    </Text>
                    <Text fontSize="10px" color={textSecondary}>{t('approx')}</Text>
                  </Box>
                </SimpleGrid>

                {/* Annual cost */}
                <Box p={3} bg={dark ? 'blue.900' : 'blue.50'} rounded="lg"
                  border="1px solid" borderColor={dark ? 'blue.700' : 'blue.100'}>
                  <HStack justify="space-between">
                    <HStack spacing={1.5}>
                      <Icon as={MailCheck} boxSize="14px" color="blue.500" />
                      <Text fontSize="13px" fontWeight="700" color={dark ? 'blue.200' : 'blue.700'}>{t('annualCost')}</Text>
                    </HStack>
                    <Box textAlign="right">
                      <Text fontSize="md" fontWeight="800" color={dark ? 'blue.200' : 'blue.700'}>
                        {fmtUF(pricing.annualUF)}
                      </Text>
                      <Text fontSize="10px" color={textSecondary}>
                        ≈ {fmtCLP(animAnnualCLP)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                {/* Savings badge */}
                <HStack p={2} bg={dark ? 'green.900' : 'green.50'} rounded="lg"
                  border="1px solid" borderColor={dark ? 'green.700' : 'green.100'} justify="center">
                  <Icon as={Sparkles} boxSize="12px" color="green.500" />
                  <Text fontSize="11px" color={dark ? 'green.300' : 'green.700'} fontWeight="600">
                    {selectedPlan === 'basico' ? '—' : selectedPlan === 'profesional' ? '~20%' : '~35%'} {t('savingsBadge')}
                  </Text>
                </HStack>

                {/* ===== PRICING MATRIX TABLE (inline) ===== */}
                {expanded && <Box overflowX="auto" mt={0}>
                  <HStack spacing={1.5} mb={2}>
                    <Icon as={BarChart3} boxSize="14px" color="blue.500" />
                    <Text fontSize="13px" fontWeight="700" color={textPrimary}>
                      {lang === 'es' ? 'Matriz de Precios' : 'Pricing Matrix'}
                    </Text>
                    <Text fontSize="10px" color={textSecondary}>(UF / {lang === 'es' ? 'alumno' : 'student'} / {lang === 'es' ? 'mes' : 'month'})</Text>
                  </HStack>
                  <Box as="table" w="full" fontSize="xs">
                    <Box as="thead">
                      <Box as="tr">
                        <Box as="th" textAlign="left" p={2} color={textSecondary} fontWeight="600" fontSize="11px"
                          borderBottom="1px solid" borderColor={cardBorder}>
                          {lang === 'es' ? 'Rango' : 'Range'}
                        </Box>
                        {plans.map(plan => (
                          <Box key={plan.key} as="th" textAlign="center" p={2} fontWeight="700" fontSize="11px"
                            borderBottom="1px solid" borderColor={cardBorder}
                            color={selectedPlan === plan.key ? plan.color : textSecondary}>
                            {t(plan.labelKey)}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box as="tbody">
                      {PRICE_MATRIX.map((tier, idx) => {
                        const isCurrentTier = enrollment >= tier.min && enrollment <= tier.max;
                        return (
                          <Box as="tr" key={idx}
                            bg={isCurrentTier ? (dark ? 'blue.900' : 'blue.50') : 'transparent'}
                            transition="all 0.2s ease">
                            <Box as="td" p={2} fontWeight={isCurrentTier ? '700' : '500'} color={textPrimary}
                              borderBottom="1px solid" borderColor={dark ? 'gray.700' : 'gray.100'}
                              whiteSpace="nowrap" fontSize="11px">
                              {tier.max === 99999 ? `+${tier.min.toLocaleString('es-CL')}` : `${tier.min.toLocaleString('es-CL')} – ${tier.max.toLocaleString('es-CL')}`}
                              {isCurrentTier && (
                                <Badge ml={1} colorScheme="blue" fontSize="8px" variant="subtle">
                                  {lang === 'es' ? 'TÚ' : 'YOU'}
                                </Badge>
                              )}
                            </Box>
                            {(['basico', 'profesional', 'institucional'] as PlanKey[]).map(planKey => (
                              <Box key={planKey} as="td" p={2} textAlign="center" fontSize="11px"
                                fontWeight={isCurrentTier && selectedPlan === planKey ? '800' : '500'}
                                color={isCurrentTier && selectedPlan === planKey
                                  ? plans.find(p => p.key === planKey)!.color
                                  : textPrimary}
                                borderBottom="1px solid" borderColor={dark ? 'gray.700' : 'gray.100'}>
                                {tier.min > 3000 && planKey === 'institucional' ? (lang === 'es' ? 'Cotizar' : 'Quote') : `${tier[planKey]} UF`}
                              </Box>
                            ))}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>}

                {/* Contactar Ventas (shadow pricing) */}
                {pricing.needsQuote && (
                  <Box p={3} bg={dark ? 'purple.900' : 'purple.50'} rounded="lg"
                    border="1px solid" borderColor={dark ? 'purple.700' : 'purple.200'} textAlign="center">
                    <Text fontSize="11px" color={dark ? 'purple.200' : 'purple.700'} mb={2} fontWeight="600">
                      {lang === 'es'
                        ? 'Para +3.000 alumnos, contáctenos para una tarifa personalizada.'
                        : 'For 3,000+ students, contact us for a custom rate.'}
                    </Text>
                    <Button as="a" href="/index.html#demo" bg="purple.600" color="white" rounded="lg" px={6} size="sm"
                      _hover={{ bg: 'purple.500', transform: 'translateY(-2px)' }}>
                      {t('contactSales')}
                    </Button>
                  </Box>
                )}
              </VStack>
          </Box>
            );
          })()}

          {/* —— RIGHT: ROI Chart (always visible) + Features (expanded only) —— */}
          <Box>
            {/* ROI Chart - Always visible, recalculates per plan */}
              <Box bg={cardBg} border="2px solid" borderColor={plans.find(p => p.key === selectedPlan)!.color} rounded="xl" p={5}
                boxShadow={`0 4px 20px -6px ${plans.find(p => p.key === selectedPlan)!.color}25`} transition="all 0.3s ease"
                mb={expanded ? 4 : 0}
                cursor="pointer"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 30px -8px ${plans.find(p => p.key === selectedPlan)!.color}40`,
                  borderColor: plans.find(p => p.key === selectedPlan)!.color,
                }}>
                <HStack justify="space-between" align="center" mb={1}>
                  <HStack spacing={2}>
                    <Icon as={TrendingUp} boxSize="16px" color="green.500" />
                    <Text fontSize="14px" fontWeight="700" color={textPrimary}>{t('roiTitle')}</Text>
                  </HStack>
                  <HStack spacing={0} bg={dark ? 'gray.700' : 'gray.100'} rounded="lg" p="2px">
                    {([1, 3, 5] as const).map((y) => (
                      <Button key={y} size="xs" fontSize="11px" fontWeight={temporalidad === y ? '700' : '500'}
                        bg={temporalidad === y ? (dark ? 'blue.600' : 'blue.500') : 'transparent'}
                        color={temporalidad === y ? 'white' : (dark ? 'gray.300' : 'gray.600')}
                        rounded="md" px={2.5} minW="auto" h="22px"
                        _hover={{ bg: temporalidad === y ? (dark ? 'blue.500' : 'blue.600') : (dark ? 'gray.600' : 'gray.200') }}
                        onClick={() => setTemporalidad(y)}>
                        {t(`year${y}` as keyof typeof i18n.es)}
                      </Button>
                    ))}
                  </HStack>
                </HStack>
                <Text fontSize="11px" color={textSecondary} mb={3}>{t('roiSubtitle')}</Text>

                {/* Chart */}
                <Box h={pricing.needsQuote ? "260px" : "180px"} mb={3}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roiChartData} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
                      <XAxis dataKey="name"
                        tick={{ fontSize: 11, fill: dark ? '#ffffff' : '#475569', fontWeight: dark ? 500 : 400 }}
                        axisLine={{ stroke: dark ? '#475569' : '#cbd5e1' }}
                        tickLine={false} />
                      <YAxis tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(0)}M`}
                        tick={{ fontSize: 11, fill: dark ? '#ffffff' : '#475569', fontWeight: dark ? 500 : 400 }}
                        axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value) => [fmtCLP(Number(value)), 'CLP']}
                        contentStyle={{
                          background: dark ? '#1e293b' : 'white',
                          border: `1px solid ${dark ? '#475569' : '#e2e8f0'}`,
                          borderRadius: '8px', fontSize: '12px',
                          color: dark ? '#f8fafc' : '#0f172a',
                          boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        labelStyle={{ color: dark ? '#f8fafc' : '#0f172a', fontWeight: 600 }}
                        itemStyle={{ color: dark ? '#e2e8f0' : '#334155' }}
                        cursor={{ fill: dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.04)' }} />
                      <Bar dataKey="monto" radius={[8, 8, 0, 0]} barSize={50}>
                        {roiChartData.map((entry, index) => (
                          <Cell key={`c-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {/* ROI Summary */}
                <SimpleGrid columns={3} spacing={2} mb={3}>
                  <Box textAlign="center" p={1.5} bg={dark ? 'red.900' : 'red.50'} rounded="md"
                    border="1px solid" borderColor={dark ? 'red.800' : 'red.100'}>
                    <Text fontSize="10px" color="red.400" fontWeight="600">{t('roiLossLabel')}</Text>
                    <Text fontSize="xs" fontWeight="800" color={dark ? 'red.200' : 'red.600'}>
                      {fmtCLP(roi.annualLoss * temporalidad)}
                    </Text>
                    <Text fontSize="9px" color={textSecondary}>
                      {roi.studentsLost} {t('roiLossSub')} × {temporalidad} {t('chartPeriod')}
                    </Text>
                  </Box>
                  <Box textAlign="center" p={1.5} bg={dark ? 'green.900' : 'green.50'} rounded="md"
                    border="1px solid" borderColor={dark ? 'green.800' : 'green.100'}>
                    <Text fontSize="10px" color="green.400" fontWeight="600">{t('roiCostLabel')}</Text>
                    <Text fontSize="xs" fontWeight="800" color={dark ? 'green.200' : 'green.600'}>
                      {fmtCLP(roi.annualCostCLP * temporalidad)}
                    </Text>
                    <Text fontSize="9px" color={textSecondary}>{temporalidad} {t('chartPeriod')}</Text>
                  </Box>
                  <Box textAlign="center" p={1.5} bg={dark ? 'blue.900' : 'blue.50'} rounded="md"
                    border="1px solid" borderColor={dark ? 'blue.800' : 'blue.100'}>
                    <Text fontSize="10px" color="blue.400" fontWeight="600">{t('roiSavingsLabel')}</Text>
                    <Text fontSize="xs" fontWeight="800" color={dark ? 'blue.200' : 'blue.600'}>
                      {fmtCLP(roi.recovered * temporalidad)}
                    </Text>
                    <Text fontSize="9px" color={textSecondary}>{lang === 'es' ? 'neto recuperado' : 'net recovered'}</Text>
                  </Box>
                </SimpleGrid>

                {/* ROI Message */}
                <Box p={2} bg={dark ? 'green.900' : 'green.50'} rounded="lg"
                  border="1px solid" borderColor={dark ? 'green.700' : 'green.200'}>
                  <HStack spacing={1.5}>
                    <Icon as={ShieldCheck} boxSize="14px" color="green.500" flexShrink={0} />
                    <Text fontSize="12px" color={dark ? 'green.200' : 'green.700'} fontWeight="600">
                      {t('roiMessage1')}{' '}
                      <Text as="span" fontWeight="900" fontSize="13px">{roi.studentsToBreakeven}</Text>{' '}
                      {t('roiMessage2')}
                    </Text>
                  </HStack>
                </Box>

                {/* Shadow pricing disclaimer */}
                {pricing.needsQuote && (
                  <Text fontSize="10px" color={textSecondary} fontStyle="italic" textAlign="center" mt={1}>
                    *{lang === 'es' ? 'Valores referenciales. Precio final sujeto a cotización.' : 'Reference values. Final price subject to quote.'}
                  </Text>
                )}
              </Box>

            {/* Plan Features Card - expanded only */}
            {expanded && (() => {
              const planColor = plans.find(p => p.key === selectedPlan)!.color;
              return (
                <Box bg={cardBg} border="2px solid" borderColor={planColor} rounded="xl" p={5}
                  boxShadow={`0 4px 20px -6px ${planColor}25`} mt={4}
                  transition="all 0.3s ease" cursor="pointer"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 30px -8px ${planColor}40`,
                    borderColor: planColor,
                  }}>
                  <HStack spacing={2} mb={3}>
                    <Icon as={BookOpen} boxSize="16px" color={planColor} />
                    <Text fontSize="14px" fontWeight="700" color={textPrimary}>{t('features')}</Text>
                    <Badge colorScheme={selectedPlan === 'basico' ? 'gray' : selectedPlan === 'profesional' ? 'blue' : 'purple'}
                      fontSize="10px" px={1.5} borderRadius="full">
                      {t(plans.find(p => p.key === selectedPlan)!.labelKey)}
                    </Badge>
                  </HStack>

                  <VStack spacing={2} align="stretch">
                    {PLAN_FEATURES[selectedPlan].map((feat) => (
                      <HStack key={feat.key} spacing={2} p={2}
                        bg={feat.type === 'disabled' ? (dark ? 'red.900' : 'red.50')
                          : feat.type === 'highlight' ? (dark ? 'blue.900' : 'blue.50')
                          : (dark ? 'gray.750' : 'gray.50')}
                        rounded="lg"
                        border="1px solid"
                        borderColor={feat.type === 'disabled' ? (dark ? 'red.800' : 'red.100')
                          : feat.type === 'highlight' ? (dark ? 'blue.800' : 'blue.100')
                          : (dark ? 'gray.600' : 'gray.100')}
                        transition="all 0.2s ease"
                        _hover={{ transform: 'translateX(3px)' }}>
                        <Icon as={feat.icon} boxSize="14px"
                          color={feat.type === 'disabled' ? 'red.400'
                            : feat.type === 'warn' ? (dark ? 'yellow.400' : 'yellow.600')
                            : feat.type === 'highlight' ? 'blue.500'
                            : 'green.500'} />
                        <Text fontSize="12px"
                          fontWeight={feat.type === 'highlight' ? '700' : '500'}
                          color={feat.type === 'disabled' ? (dark ? 'red.300' : 'red.500')
                            : textPrimary}
                          textDecoration={feat.type === 'disabled' ? 'line-through' : 'none'}>
                          {t(feat.key)}
                        </Text>
                        {feat.type === 'highlight' && (
                          <Badge colorScheme="blue" fontSize="8px" variant="subtle" ml="auto">NEW</Badge>
                        )}
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              );
            })()}
          </Box>
        </Box>

        {/* ===== CTA HORIZONTAL ===== */}
        <HStack rounded="xl" px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }} mt={5}
          bgGradient="linear(to-r, #2563eb, #7c3aed)" color="white"
          align="center" justify="space-between" flexWrap="wrap" gap={3}
          transition="all 0.3s ease" cursor="pointer"
          _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 18px -4px rgba(0,0,0,0.3)' }}>
          <Box>
            <Text fontSize="10px" textTransform="uppercase" letterSpacing="0.1em" opacity={0.85} mb={0.5}>
              {t('ctaLabel')}
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="700" lineHeight="1.3">
              {t('ctaText')}
            </Text>
          </Box>
          <Button as="a" href="/index.html#demo" size="sm" bg="white" color="gray.900" flexShrink={0}
            rightIcon={<Icon as={ShieldCheck} boxSize="16px" />}
            _hover={{ transform: 'scale(1.05)', boxShadow: '0 6px 20px rgba(0,0,0,0.2)', bg: 'gray.50' }}
            px={8} minW="200px" fontSize="xs" fontWeight="800" rounded="lg"
            transition="all 0.3s ease"
            boxShadow="0 4px 15px rgba(0,0,0,0.15)">
            {t('ctaBtn')}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default DropoutCalculator;
