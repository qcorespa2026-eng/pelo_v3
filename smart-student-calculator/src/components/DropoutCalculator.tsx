import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
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
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Zap,
} from 'lucide-react';

// --- Constants ---
const DROPOUT_RATE = 0.028;
const BASE_SUBSIDY = 120_000;
const IVE_MULTIPLIERS: Record<string, number> = { BAJO: 1.0, MEDIO: 1.2, ALTO: 1.5 };
const SOSTAINER_MULTIPLIERS: Record<string, number> = { MUNICIPAL: 1.0, SUBVENCIONADO: 1.1, PAGADO: 3.0 };
const PRICE_PER_STUDENT = 2_500; // CLP por alumno al mes

/* ---- i18n ---- */
type Lang = 'es' | 'en';
const i18n: Record<Lang, Record<string, string>> = {
  es: {
    badge: 'IMPACT LAB',
    badgeTasa: 'Tasa 2.8%',
    badgeSub: 'Subvención $120.000',
    headline: 'Cada alumno que pierdes tiene un costo invisible',
    subheadline: 'Calcula la pérdida financiera y la proyección a largo plazo. Visualiza el retorno de invertir en SmartStudent.',
    inputTitle: 'Datos del establecimiento',
    enrollment: 'Matrícula total',
    sustainerType: 'Tipo de sostenedor',
    optMunicipal: 'Municipal',
    optSubvencionado: 'Particular Subvencionado',
    optPagado: 'Particular Pagado',
    iveLevel: 'Nivel IVE',
    optLow: 'Bajo (0-40%)',
    optMid: 'Medio (40-75%)',
    optHigh: 'Alto (75-100%)',
    tasaNote: 'Tasa nacional',
    tasaAdj: 'ajustada por IVE',
    atRisk: 'En riesgo',
    studentsYear: 'alumnos / año',
    annualLoss: 'Pérdida anual',
    subsidy: 'subvención',
    projectedLoss: 'Pérdida Proyectada',
    accumulated: 'acumulado',
    ssSavings: 'Ahorro con SS',
    potential: 'potencial',
    ssInvestmentLabel: 'Inversión SS',
    ssInvestmentSub: 'SaaS anual',
    comparison: 'Comparación directa',
    comparisonSub: 'Inacción vs inversión SmartStudent',
    accLoss: 'Pérdida acumulada',
    ssInvestment: 'Inversión SmartStudent',
    returnRatio: 'Ratio de retorno',
    chartTitle: 'Pérdida vs inversión',
    chartPeriod: 'años',
    chartLoss: 'Pérdida Proyectada',
    chartInv: 'Inversión SS',
    chartAmount: 'Monto',
    ctaLabel: 'Acción inmediata',
    ctaText: 'La brecha crece cada año. Actúa ahora y protege tu matrícula.',
    ctaRecovery1: 'Con solo retener',
    ctaRecovery2: 'al año, la inversión se paga sola.',
    ctaRecoveryStudent: 'alumno',
    ctaRecoveryStudents: 'alumnos',
    ctaBtn: 'Detener Pérdida',
    year1: '1 Año',
    year3: '3 Años',
    year5: '5 Años',
    navInicio: 'Inicio',
    navFeatures: 'Características',
    navRoles: 'Roles',
    navPlans: 'Planes',
    navDemo: 'Agendar Demo',
  },
  en: {
    badge: 'IMPACT LAB',
    badgeTasa: 'Rate 2.8%',
    badgeSub: 'Subsidy $120,000',
    headline: 'Every student you lose has an invisible cost',
    subheadline: 'Calculate financial loss and long-term projection. Visualize the return on investing in SmartStudent.',
    inputTitle: 'Institution Data',
    enrollment: 'Total Enrollment',
    sustainerType: 'School Type',
    optMunicipal: 'Public',
    optSubvencionado: 'Subsidized Private',
    optPagado: 'Private',
    iveLevel: 'IVE Level',
    optLow: 'Low (0-40%)',
    optMid: 'Medium (40-75%)',
    optHigh: 'High (75-100%)',
    tasaNote: 'National rate',
    tasaAdj: 'adjusted by IVE',
    atRisk: 'At Risk',
    studentsYear: 'students / year',
    annualLoss: 'Annual Loss',
    subsidy: 'subsidy',
    projectedLoss: 'Projected Loss',
    accumulated: 'accumulated',
    ssSavings: 'SS Savings',
    potential: 'potential',
    ssInvestmentLabel: 'SS Investment',
    ssInvestmentSub: 'annual SaaS',
    comparison: 'Direct Comparison',
    comparisonSub: 'Inaction vs SmartStudent investment',
    accLoss: 'Accumulated Loss',
    ssInvestment: 'SmartStudent Investment',
    returnRatio: 'Return Ratio',
    chartTitle: 'Loss vs Investment',
    chartPeriod: 'years',
    chartLoss: 'Projected Loss',
    chartInv: 'SS Investment',
    chartAmount: 'Amount',
    ctaLabel: 'Immediate Action',
    ctaText: 'The gap grows every year. Act now and protect your enrollment.',
    ctaRecovery1: 'By retaining just',
    ctaRecovery2: 'per year, the investment pays for itself.',
    ctaRecoveryStudent: 'student',
    ctaRecoveryStudents: 'students',
    ctaBtn: 'Stop Loss',
    year1: '1 Year',
    year3: '3 Years',
    year5: '5 Years',
    navInicio: 'Home',
    navFeatures: 'Features',
    navRoles: 'Roles',
    navPlans: 'Plans',
    navDemo: 'Schedule Demo',
  },
};

/* ---- Theme hook ---- */
function useThemeToggle() {
  const [dark, setDark] = useState(() => {
    // Read from localStorage so it matches the other pages
    return localStorage.getItem('theme') === 'dark';
  });

  // Sync dark class on <html> and <body>, same as main.js applyTheme
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

  // Expose toggle to static navbar
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) (root as any).__themeToggle = toggle;
  }, [toggle]);

  // Sync navbar icon (moon/sun) with theme state
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

/* ---- Mini card ---- */
const MiniCard: React.FC<{
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
  dark: boolean;
}> = ({ icon, iconColor, label, value, sub, dark }) => (
  <Box bg={dark ? 'gray.800' : 'white'} border="1px solid" borderColor={dark ? 'gray.700' : 'gray.200'}
    rounded="2xl" px={4} py={3} boxShadow={dark ? '0 4px 14px -6px rgba(0,0,0,0.4)' : '0 4px 14px -6px rgba(15,23,42,0.12)'}
    transition="all 0.3s ease" cursor="pointer"
    _hover={{ transform: 'translateY(-4px)', boxShadow: dark ? '0 8px 24px -6px rgba(0,0,0,0.5)' : '0 8px 24px -6px rgba(15,23,42,0.18)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
    <HStack spacing={2} mb={1}>
      <Icon as={icon} boxSize="14px" color={iconColor} />
      <Text fontSize="11px" color={dark ? 'gray.400' : 'gray.500'} textTransform="uppercase" fontWeight="600" letterSpacing="0.04em">
        {label}
      </Text>
    </HStack>
    <Text fontSize="lg" fontWeight="800" lineHeight="1.2" color={dark ? 'gray.100' : 'gray.800'}>{value}</Text>
    {sub && <Text fontSize="12px" color={dark ? 'gray.500' : 'gray.400'} mt={0.5}>{sub}</Text>}
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
  const [enrollment, setEnrollment] = useState<number>(800);
  const [sustainer, setSustainer] = useState<string>('SUBVENCIONADO');
  const [ive, setIve] = useState<string>('MEDIO');
  const [temporalidad, setTemporalidad] = useState<number>(1);

  // Expose lang toggle to static navbar
  const langToggle = useCallback(() => setLang((l) => (l === 'es' ? 'en' : 'es')), []);
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) (root as any).__langToggle = langToggle;
  }, [langToggle]);

  // Sync navbar with lang
  useEffect(() => {
    const btn = document.getElementById('navbar-lang-toggle');
    if (btn) btn.textContent = lang === 'es' ? 'ES' : 'EN';
    // Update nav link names
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

  // Card style shorthand
  const cardBg = dark ? 'gray.800' : 'white';
  const cardBorder = dark ? 'gray.700' : 'gray.200';
  const cardShadow = dark ? '0 4px 14px -6px rgba(0,0,0,0.4)' : '0 4px 14px -6px rgba(15,23,42,0.12)';
  const textPrimary = dark ? 'gray.100' : 'gray.800';
  const textSecondary = dark ? 'gray.400' : 'gray.500';
  const subtleBg = dark ? 'gray.700' : 'gray.50';

  const results = useMemo(() => {
    const iveFactor = IVE_MULTIPLIERS[ive] ?? 1;
    const sustainerFactor = SOSTAINER_MULTIPLIERS[sustainer] ?? 1;
    const monthlyIncome = BASE_SUBSIDY * iveFactor * (sustainer === 'PAGADO' ? sustainerFactor : 1);
    const studentsLost = Math.ceil(enrollment * DROPOUT_RATE);
    const monthlyLoss = studentsLost * monthlyIncome;
    const annualLoss = monthlyLoss * 12;
    // New SaaS pricing: $2.500 CLP × matrícula total × 12 meses
    const smartStudentAnnualCost = enrollment * PRICE_PER_STUDENT * 12;
    // Projected values based on temporalidad
    const projectedLoss = annualLoss * temporalidad;
    const projectedInvestment = smartStudentAnnualCost * temporalidad;
    const savings = projectedLoss - projectedInvestment;
    // How many students to recover to pay for the investment
    const annualIncomePerStudent = monthlyIncome * 12;
    const studentsToRecover = annualIncomePerStudent > 0 ? Math.ceil(smartStudentAnnualCost / annualIncomePerStudent) : 0;
    return { studentsLost, annualLoss, smartStudentAnnualCost, projectedLoss, projectedInvestment, savings, studentsToRecover };
  }, [enrollment, sustainer, ive, temporalidad]);

  const animLost = useAnimatedNumber(results.studentsLost);
  const animAnnual = useAnimatedNumber(results.annualLoss, 600);
  const animProjected = useAnimatedNumber(results.projectedLoss, 600);
  const animSavings = useAnimatedNumber(results.savings, 600);

  const chartData = [
    { name: t('chartLoss'), monto: results.projectedLoss, color: '#f97316' },
    { name: t('chartInv'), monto: results.projectedInvestment, color: '#22c55e' },
  ];

  const fmt = (value: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

  const ratio = (results.projectedLoss / results.projectedInvestment).toFixed(1);

  return (
    <Box display="flex" flexDirection="column"
      pt={{ base: 8, md: 12 }} pb={{ base: 8, md: 10 }} px={{ base: 4, md: 8 }}
      bg="transparent"
      color={dark ? '#e2e8f0' : '#0f172a'}
      transition="color 0.4s ease">
      <Box maxW="1280px" mx="auto" w="full">
        {/* ===== HEADER ===== */}
        <HStack justify="space-between" mb={3} flexWrap="wrap" align="center">
          <HStack spacing={3} flexWrap="wrap">
            <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full" fontSize="12px"
              letterSpacing="0.08em">
              {t('badge')}
            </Badge>
            <Badge colorScheme="orange" variant="subtle" fontSize="12px" px={2} py={0.5}>{t('badgeTasa')}</Badge>
            <Badge colorScheme="green" variant="subtle" fontSize="12px" px={2} py={0.5}>{t('badgeSub')}</Badge>
          </HStack>
        </HStack>

        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} lineHeight="1.2" mb={2}
          bgGradient="linear(to-r, #0ea5e9, #22c55e, #f97316)" bgClip="text">
          {t('headline')}
        </Heading>
        <Text fontSize={{ base: '13px', md: '15px' }} color={textSecondary} mb={{ base: 4, md: 6 }} maxW="700px">
          {t('subheadline')}
        </Text>

        {/* ===== MAIN 3-COL GRID ===== */}
        <Box display={{ base: 'flex', md: 'grid' }} flexDirection="column"
          gridTemplateColumns={{ md: '1fr 1fr 1.5fr' }} gap={{ base: 4, md: 6 }}>

          {/* —— COL 1: Inputs —— */}
          <Box bg={cardBg} border="1px solid" borderColor={cardBorder} rounded="2xl" p={5}
            boxShadow={cardShadow} transition="all 0.3s ease" cursor="pointer"
            _hover={{ transform: 'translateY(-4px)', boxShadow: dark ? '0 8px 24px -6px rgba(0,0,0,0.5)' : '0 8px 24px -6px rgba(15,23,42,0.18)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
            <HStack spacing={3} mb={3}>
              <Box bg={dark ? 'orange.900' : 'orange.100'} p={1.5} rounded="lg">
                <Icon as={AlertTriangle} boxSize="16px" color="orange.500" />
              </Box>
              <Text fontSize="15px" fontWeight="700" color={textPrimary}>{t('inputTitle')}</Text>
            </HStack>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontSize="14px" fontWeight="600" mb={2} color={textPrimary}>{t('enrollment')}</FormLabel>
                <Input type="number" value={enrollment} size="md" rounded="lg"
                  bg={dark ? 'gray.700' : 'white'} borderColor={cardBorder} color={textPrimary}
                  onChange={(e) => setEnrollment(Number(e.target.value))} min={1} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="14px" fontWeight="600" mb={2} color={textPrimary}>{t('sustainerType')}</FormLabel>
                <Select value={sustainer} size="md" rounded="lg"
                  bg={dark ? 'gray.700' : 'white'} borderColor={cardBorder}
                  color={dark ? '#ffffff' : '#1e293b'}
                  iconColor={dark ? '#ffffff' : undefined}
                  sx={dark ? { color: '#ffffff !important', '& option': { bg: '#1e293b', color: '#ffffff' } } : {}}
                  onChange={(e) => setSustainer(e.target.value)}>
                  <option value="MUNICIPAL" style={{ background: dark ? '#1e293b' : '#fff', color: dark ? '#ffffff' : '#1e293b' }}>{t('optMunicipal')}</option>
                  <option value="SUBVENCIONADO" style={{ background: dark ? '#1e293b' : '#fff', color: dark ? '#ffffff' : '#1e293b' }}>{t('optSubvencionado')}</option>
                  <option value="PAGADO" style={{ background: dark ? '#1e293b' : '#fff', color: dark ? '#ffffff' : '#1e293b' }}>{t('optPagado')}</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="14px" fontWeight="600" mb={2} color={textPrimary}>{t('iveLevel')}</FormLabel>
                <Select value={ive} size="md" rounded="lg"
                  bg={dark ? 'gray.700' : 'white'} borderColor={cardBorder}
                  color={dark ? '#ffffff' : '#1e293b'}
                  iconColor={dark ? '#ffffff' : undefined}
                  sx={dark ? { color: '#ffffff !important', '& option': { bg: '#1e293b', color: '#ffffff' } } : {}}
                  onChange={(e) => setIve(e.target.value)}>
                  <option value="BAJO" style={{ background: dark ? '#1e293b' : '#fff', color: dark ? '#ffffff' : '#1e293b' }}>{t('optLow')}</option>
                  <option value="MEDIO" style={{ background: dark ? '#1e293b' : '#fff', color: dark ? '#ffffff' : '#1e293b' }}>{t('optMid')}</option>
                  <option value="ALTO" style={{ background: dark ? '#1e293b' : '#fff', color: dark ? '#ffffff' : '#1e293b' }}>{t('optHigh')}</option>
                </Select>
              </FormControl>

              <HStack spacing={3} p={3} bg={dark ? 'rgba(249,115,22,0.2)' : 'orange.50'} rounded="lg"
                border="1px solid" borderColor={dark ? 'rgba(249,115,22,0.4)' : 'orange.100'}>
                <Icon as={TrendingDown} color={dark ? 'orange.300' : 'orange.400'} boxSize="16px" />
                <Text fontSize="13px" color={dark ? 'white' : 'gray.600'}>
                  {t('tasaNote')} <Badge colorScheme="orange" fontSize="12px">2.8%</Badge> {t('tasaAdj')}
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* —— COL 2: Stats + Comparison —— */}
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={2} spacing={4}>
              <MiniCard dark={dark} icon={Users} iconColor="orange.500" label={t('atRisk')}
                value={String(animLost)} sub={t('studentsYear')} />
              <MiniCard dark={dark} icon={DollarSign} iconColor="red.500" label={t('annualLoss')}
                value={fmt(animAnnual)} sub={t('subsidy')} />
              <MiniCard dark={dark} icon={Calendar} iconColor="orange.400" label={t('projectedLoss')}
                value={fmt(animProjected)} sub={`${temporalidad} ${t('chartPeriod')} ${t('accumulated')}`} />
              <MiniCard dark={dark} icon={Zap} iconColor="green.500" label={t('ssSavings')}
                value={fmt(animSavings)} sub={`${temporalidad} ${t('chartPeriod')} ${t('potential')}`} />
            </SimpleGrid>

            {/* Comparison */}
            <Box bg={cardBg} border="1px solid" borderColor={cardBorder} rounded="2xl" px={4} py={4}
              boxShadow={cardShadow} flex="1" display="flex" flexDirection="column"
              transition="all 0.3s ease" cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', boxShadow: dark ? '0 8px 24px -6px rgba(0,0,0,0.5)' : '0 8px 24px -6px rgba(15,23,42,0.18)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
              <Text fontSize="14px" fontWeight="700" mb={1} color={textPrimary}>{t('comparison')}</Text>
              <Text fontSize="12px" color={textSecondary} mb={2}>{t('comparisonSub')}</Text>
              <VStack spacing={3} align="stretch" flex="1" justify="center">
                <CompareBar dark={dark} label={t('accLoss')} value={results.projectedLoss}
                  maxValue={results.projectedLoss} color="#f97316" format={fmt} />
                <CompareBar dark={dark} label={t('ssInvestment')} value={results.projectedInvestment}
                  maxValue={results.projectedLoss} color="#22c55e" format={fmt} />
              </VStack>
              <HStack mt={2} p={2} bg={subtleBg} rounded="lg" justify="space-between">
                <Text fontSize="12px" color={textSecondary}>{t('returnRatio')}</Text>
                <Badge colorScheme="green" fontSize="sm" px={2}>{ratio}x</Badge>
              </HStack>
            </Box>
          </VStack>

          {/* —— COL 3: Chart —— */}
          <Box bg={cardBg} border="1px solid" borderColor={cardBorder} rounded="2xl" px={5} py={5}
            boxShadow={cardShadow} display="flex" flexDirection="column"
            transition="all 0.3s ease" cursor="pointer"
            _hover={{ transform: 'translateY(-4px)', boxShadow: dark ? '0 8px 24px -6px rgba(0,0,0,0.5)' : '0 8px 24px -6px rgba(15,23,42,0.18)', borderColor: dark ? 'gray.600' : 'gray.300' }}>
            <HStack justify="space-between" mb={3} flexWrap="wrap" gap={2}>
              <Text fontSize="15px" fontWeight="700" color={textPrimary}>{t('chartTitle')}</Text>
              <HStack spacing={0} bg={dark ? 'gray.700' : 'gray.100'} rounded="lg" p="2px">
                {([1, 3, 5] as const).map((y) => (
                  <Button key={y} size="xs" fontSize="12px" fontWeight={temporalidad === y ? '700' : '500'}
                    bg={temporalidad === y ? (dark ? 'blue.600' : 'blue.500') : 'transparent'}
                    color={temporalidad === y ? 'white' : (dark ? 'gray.300' : 'gray.600')}
                    rounded="md" px={3} minW="auto"
                    _hover={{ bg: temporalidad === y ? (dark ? 'blue.500' : 'blue.600') : (dark ? 'gray.600' : 'gray.200') }}
                    onClick={() => setTemporalidad(y)}>
                    {t(`year${y}` as keyof typeof i18n.es)}
                  </Button>
                ))}
              </HStack>
            </HStack>
            <Box flex="1" minH="240px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -8, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: dark ? '#ffffff' : '#475569', fontWeight: dark ? 500 : 400 }}
                    axisLine={{ stroke: dark ? '#475569' : '#cbd5e1' }} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(0)}M`}
                    tick={{ fontSize: 11, fill: dark ? '#ffffff' : '#475569', fontWeight: dark ? 500 : 400 }}
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip formatter={(value) => [fmt(Number(value)), t('chartAmount')]}
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
                  <Bar dataKey="monto" radius={[10, 10, 0, 0]} barSize={90}>
                    {chartData.map((entry, index) => (
                      <Cell key={`c-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>

        {/* ===== CTA HORIZONTAL ===== */}
        <HStack rounded="2xl" px={{ base: 5, md: 8 }} py={{ base: 4, md: 5 }} mt={6}
          bgGradient="linear(to-r, #0ea5e9, #22c55e)" color="white"
          align="center" justify="space-between" flexWrap="wrap" gap={4}
          transition="all 0.3s ease" cursor="pointer"
          _hover={{ transform: 'translateY(-4px)', boxShadow: '0 8px 24px -6px rgba(0,0,0,0.35)' }}>
          <Box>
            <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" opacity={0.85} mb={1}>
              {t('ctaLabel')}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="700" lineHeight="1.3">
              {t('ctaText')}
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="500" lineHeight="1.4" opacity={0.95} mt={1}>
              {t('ctaRecovery1')}{' '}
              <Text as="span" fontWeight="900" fontSize={{ base: 'md', md: 'lg' }}>
                {results.studentsToRecover} {results.studentsToRecover === 1 ? t('ctaRecoveryStudent') : t('ctaRecoveryStudents')}
              </Text>
              {' '}{t('ctaRecovery2')}
            </Text>
          </Box>
          <Button as="a" href="/index.html#demo" size="md" bg="white" color="gray.900" flexShrink={0}
            rightIcon={<Icon as={ShieldCheck} boxSize="18px" />}
            _hover={{ transform: 'scale(1.05)', boxShadow: '0 8px 25px rgba(0,0,0,0.25)', bg: 'gray.50' }}
            px={10} minW="240px" fontSize="sm" fontWeight="800" rounded="xl"
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
