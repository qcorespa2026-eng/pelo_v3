/**
 * Smart Student - Main JavaScript
 * Handles theme switching, i18n translations, navigation, and interactions
 */
'use strict';

/* -------------------------
   Theme & i18n (centralized)
   ------------------------- */
(function() {
  // Store references for resize handler
  let navMenu = null;
  const translations = {
    en: {
      // Navigation
      "nav.features": "Features",
      "nav.roles": "Roles",
      "nav.pricing": "Plans",
      "nav.calculator": "Lab",
      "nav.login": "Log In",
      "nav.demo": "Schedule Demo",
      
      // Hero
      "hero.badge": "New v3.0 • with AI",
      "hero.title_line1": "School management,",
      "hero.title_line2": "Smarter.",
      "hero.paragraph": "Unify finance, academics and communication. Let our AI predict dropouts and automate collections so you can focus on teaching.",
      "hero.cta_start": "Get Started",
      "hero.cta_video": "Watch Video (2 min)",
      "hero.benefit1": "100% secure data",
      "hero.benefit2": "Personalized support",
      "hero.benefit3": "Fast implementation",
      
      // Features
      "features.title_small": "Smart Core",
      "features.title": "A digital brain for your school",
      "features.subtitle": "Data that thinks, decisions that transform.",
      "features.module.academic.title": "Academic Module",
      "features.module.academic.head": "Smart Curriculum Management",
      "features.module.academic.desc": "From annual planning to report cards. Automatic generation of averages, rankings and certificates.",
      "features.module.academic.b1": "Conflict-free schedule generator",
      "features.module.academic.b2": "Online grade registration",
      "features.module.academic.b3": "Automatic SEP reports",
      "features.module.finance.title": "Smart Finance",
      "features.module.finance.head": "Automated Collections",
      "features.module.finance.desc": "Reduce delinquency by 40%. Automatic WhatsApp reminders and integrated payment gateway.",
      "features.module.finance.b1": "Unlimited electronic invoicing",
      "features.module.finance.b2": "Real-time bank reconciliation",
      "features.module.community.title": "Community",
      "features.module.community.head": "Native Mobile App",
      "features.module.community.desc": "We design a native app tailored to your school community, with push notifications for homework, events and urgent alerts.",
      "features.module.stats.title": "Statistics Module",
      "features.module.stats.head": "Constant Academic Monitoring",
      "features.module.stats.desc": "Visualize academic performance in real time. Detect deviations, identify patterns and make data-driven decisions.",
      "features.module.stats.b1": "Deviation analysis by course and subject",
      "features.module.stats.b2": "Historical performance comparisons",
      "features.module.stats.b3": "Customized dashboards for directors",
      "feature.predictive.title": "Predictive Analytics",
      "feature.predictive.desc": "Don't wait until year-end. Our AI analyzes attendance and grades patterns to flag potential dropouts up to 3 months in advance.",
      "feature.predictive.badge1": "Retention +15%",
      "feature.predictive.badge2": "Full Automation",
      "feature.finance.title": "Smart Finance",
      "feature.finance.desc": "Automatic reconciliation. Parents pay from the App; the system invoices instantly.",
      "feature.app.title": "Native App",
      "feature.app.desc": "A smooth experience for students and parents. Tasks, grades, and payments in the pocket.",
      
      // Roles
      "roles.title": "Built for every stakeholder",
      "roles.subtitle": "One platform, multiple personalized experiences.",
      "roles.tab0.title": "Administration",
      "roles.tab0.subtitle": "Total control and 360° vision",
      "roles.tab0.desc": "Stop managing papers and start leading people. Have financial and academic control on your phone.",
      "roles.tab0.b1": "Real-time KPI dashboard",
      "roles.tab0.b2": "Grade audit",
      "roles.tab1.title": "Teachers",
      "roles.tab1.subtitle": "Less bureaucracy, more teaching",
      "roles.tab1.desc": "Less bureaucracy, more teaching",
      "roles.tab1.b1": "Automatic curriculum planning",
      "roles.tab1.b2": "Mass grading in 1 click",
      "roles.tab1.b3": "Direct communication with parents",
      "roles.tab1.content.title": "AI Assistant for Teachers",
      "roles.tab2.title": "Students",
      "roles.tab2.subtitle": "All campus in your pocket",
      "roles.tab2.desc": "Your school life in your pocket. Check your schedule, submit homework and see your grades without asking at the office.",
      "roles.tab2.b1": "Quick access to schedule and homework",
      "roles.tab2.b2": "Delivery and event notifications",
      "roles.tab3.title": "Parents",
      "roles.tab3.subtitle": "Connected to your children's education",
      "roles.tab3.desc": "Stay connected to your children's education. Access grades, payments and communications from anywhere.",
      "roles.tab3.b1": "Real-time grade tracking",
      "roles.tab3.b2": "Payments and invoicing from the app",
      "roles.tab3.b3": "Direct communication with teachers",
      "roles.tab3.b4": "Event and meeting notifications",
      "roles.tab3.content.title": "Everything about your children in one place",
      "roles.tab3.content.desc": "Stay informed about academic progress, payments and school events from any device.",
      "roles.parent.feat1": "Real-time grade tracking",
      "roles.parent.feat2": "Payments and invoicing from the app",
      "roles.parent.feat3": "Direct communication with teachers",
      "roles.parent.feat4": "Event and meeting notifications",
      "roles.parent.payment": "Payment Successful",
      "roles.parent.payment_desc": "December Tuition",
      "roles.parent.grade": "New Grade",
      "roles.parent.grade_desc": "Math: 6.5",
      "roles.tab0.content.title": "Data-driven decisions",
      "roles.tab0.content.desc": "Access financial and academic reports in real-time. Eliminate surprises at month-end.",
      
      // Stats
      "stats.cloud": "In the Cloud",
      "stats.modules": "Integrated Modules",
      "stats.platform": "Single Platform",
      "stats.support": "Human Support",
      
      // CTA
      "cta.title": "The future of your school starts today.",
      "cta.subtitle": "Request a guided session with our team. Guided onboarding and expert support from day one.",
      "cta.email_placeholder": "Institutional email",
      "cta.button": "Schedule Demo",
      
      // Pricing
      "pricing.title": "A plan for every stage of your institution",
      "pricing.subtitle": "From regulatory compliance to intelligent retention. Scale at your own pace.",
      "pricing.plan.start.focus": "Focus: Meet the Standard (Circular 30)",
      "pricing.plan.start.title": "Basic Plan",
      "pricing.plan.start.tagline": "(Smart Compliance)",
      "pricing.plan.start.subtitle": "Comply with Circular 30 and digitize your grades and attendance. Parents can check their children's performance in real time.",
      "pricing.plan.start.b1": "<i class='fa-solid fa-check text-brand-600'></i> Digital Gradebook (MINEDUC)",
      "pricing.plan.start.b2": "<i class='fa-solid fa-check text-brand-600'></i> Grades Module",
      "pricing.plan.start.b3": "<i class='fa-solid fa-check text-brand-600'></i> Attendance Module",
      "pricing.plan.start.b4": "<i class='fa-solid fa-eye text-slate-400'></i> Student Access (Grade Viewer)",
      "pricing.plan.start.b5": "<i class='fa-solid fa-eye text-slate-400'></i> Parent Access (Read Only)",
      "pricing.plan.start.b6": "<i class='fa-solid fa-check text-brand-600'></i> Assessments (Manual Creation)",
      "pricing.plan.start.b7": "<i class='fa-solid fa-check text-brand-600'></i> Ticket / Email Support",
      "pricing.plan.start.button": "Choose Basic",
      "pricing.plan.growth.badge": "MOST POPULAR",
      "pricing.plan.growth.focus": "Focus: Empower the Teacher (AI)",
      "pricing.plan.growth.title": "Professional Plan",
      "pricing.plan.growth.tagline": "(Academic AI)",
      "pricing.plan.growth.subtitle": "Unlock the power of AI for your teachers. Create assessments in seconds and activate two-way communication with homes.",
      "pricing.plan.growth.b1": "<i class='fa-solid fa-check text-brand-600'></i> Everything in Basic Plan",
      "pricing.plan.growth.b2": "<i class='fa-solid fa-users text-brand-600'></i> Student Access (Homework & Resources)",
      "pricing.plan.growth.b3": "<i class='fa-solid fa-bell text-brand-600'></i> <strong>Interactive Parents (Messaging & Push Alerts)</strong>",
      "pricing.plan.growth.b4": "<i class='fa-solid fa-robot text-brand-600'></i> <strong>AI Assessment Generator</strong>",
      "pricing.plan.growth.b5": "<i class='fa-solid fa-comments text-brand-600'></i> Priority Support",
      "pricing.plan.growth.button": "Schedule Demo",
      "pricing.plan.enterprise.focus": "Focus: Protect Enrollment (Administration)",
      "pricing.plan.enterprise.title": "Institutional Plan",
      "pricing.plan.enterprise.tagline": "(Strategic Retention)",
      "pricing.plan.enterprise.subtitle": "The only platform that warns you who will drop out before it happens. Unified financial and academic dashboard for strategic decisions.",
      "pricing.plan.enterprise.b1": "<i class='fa-solid fa-check text-brand-600'></i> Everything in Professional Plan",
      "pricing.plan.enterprise.b2": "<i class='fa-solid fa-user-check text-brand-600'></i> Student Access (Full Profile)",
      "pricing.plan.enterprise.b3": "<i class='fa-solid fa-shield-halved text-brand-600'></i> <strong>AI Dropout Prediction</strong>",
      "pricing.plan.enterprise.b4": "<i class='fa-solid fa-coins text-brand-600'></i> <strong>Financial Management (Payments/Co-pays)</strong>",
      "pricing.plan.enterprise.b5": "<i class='fa-solid fa-building text-brand-600'></i> Multi-campus",
      "pricing.plan.enterprise.b6": "<i class='fa-brands fa-whatsapp text-brand-600'></i> Account Manager (WhatsApp)",
      "pricing.plan.enterprise.button": "Contact Sales",
      "pricing.migration.title": "Migration questions?",
      "pricing.migration.desc": "We take care of importing your historical data for free.",
      "pricing.migration.link": "Talk to support",
      
      // Infographic
      "infographic.badge": "From Absenteeism to Dropout",
      "infographic.title": "The Silent Enemy of Enrollment",
      "infographic.subtitle": "Do you know how much subsidy your school loses due to <strong class='text-slate-700 dark:text-slate-200'>Chronic Absenteeism</strong>?",
      "infographic.step1.badge": "Step 1",
      "infographic.step1.tag": "The Warning",
      "infographic.step1.title": "Chronic Absenteeism",
      "infographic.step1.text": "Nearly <strong class='text-orange-600 dark:text-orange-400'>1 million students</strong> in Chile are chronically absent. It's not just 'missing school'—it's the <em>first invisible indicator</em> of future dropout that most ignore.",
      "infographic.step2.badge": "Step 2",
      "infographic.step2.tag": "The Cost",
      "infographic.step2.title": "Subsidy Drain",
      "infographic.step2.text": "Every day of absence is <strong class='text-red-600 dark:text-red-400'>money your school stops receiving</strong>. Final dropout means the total loss of that annual subsidy (USE/SEP).",
      "infographic.step3.badge": "Step 3",
      "infographic.step3.title": "The Predictive Solution",
      "infographic.step3.text": "Our algorithm detects absenteeism patterns <strong class='text-emerald-600 dark:text-emerald-400'>3 months before</strong> dropout. Intervene in time and protect your enrollment.",
      "infographic.cta": "Calculate My Loss Now",
      "infographic.ctaSub": "Free and instant simulation. No sign-up required.",
      
      // Footer
      "footer.product": "Product",
      "footer.resources": "Resources",
      "footer.legal": "Legal",
      "footer.copy": "Made with <i class='fa-solid fa-heart text-red-400'></i> for education",
      "footer.desc": "We help educational institutions thrive in the digital era through intelligent automation.",
      "footer.product.academy": "Academy",
      "footer.product.finance": "Finance",
      "footer.product.communications": "Communications",
      "footer.product.api": "API",
      "footer.resources.blog": "Blog",
      "footer.resources.success": "Success Stories",
      "footer.resources.help": "Help Center",
      "footer.legal.privacy": "Privacy",
      "footer.legal.terms": "Terms",
      "footer.legal.security": "Security",
      
      // Navigation
      "nav.home": "Home",
      
      // Tooltips
      "tooltip.theme": "Toggle theme (dark / light)",
      "tooltip.lang": "Change language (ES / EN)",
      "nav.theme": "Theme",
      "skip.content": "Skip to main content",
      "roles.tab1.generating": "Generating Exam...",
      "roles.tab2.notification.title": "History Assignment",
      "roles.tab2.notification.subtitle": "Due tomorrow 10:00 AM"
    },
    es: {
      // Navegación
      "nav.features": "Características",
      "nav.roles": "Roles",
      "nav.pricing": "Planes",
      "nav.calculator": "Lab",
      "nav.login": "Iniciar Sesión",
      "nav.demo": "Agendar Demo",
      
      // Hero
      "hero.badge": "Nueva Versión 3.0 con IA",
      "hero.title_line1": "Gestión escolar,",
      "hero.title_line2": "Inteligente.",
      "hero.paragraph": "Unifique finanzas, academia y comunicación. Deje que nuestra IA prediga la deserción y automatice la cobranza mientras usted se enfoca en educar.",
      "hero.cta_start": "Comenzar Ahora",
      "hero.cta_video": "Ver Video (2 min)",
      "hero.benefit1": "Datos 100% seguros",
      "hero.benefit2": "Soporte personalizado",
      "hero.benefit3": "Implementación rápida",
      
      // Features
      "features.title_small": "Smart Core",
      "features.title": "Un cerebro digital para su colegio",
      "features.subtitle": "Datos que piensan, decisiones que transforman.",
      "features.module.academic.title": "Módulo Académico",
      "features.module.academic.head": "Gestión Curricular Inteligente",
      "features.module.academic.desc": "Desde la planificación anual hasta la boleta de calificaciones. Generación automática de promedios, rankings y certificados.",
      "features.module.academic.b1": "Generador de horarios sin choques",
      "features.module.academic.b2": "Registro de calificaciones en línea",
      "features.module.academic.b3": "Reportes SEP automáticos",
      "features.module.finance.title": "Smart Finance",
      "features.module.finance.head": "Cobranza Automatizada",
      "features.module.finance.desc": "Reduzca la morosidad en un 40%. Recordatorios automáticos por WhatsApp y pasarela de pagos integrada.",
      "features.module.finance.b1": "Facturación electrónica ilimitada",
      "features.module.finance.b2": "Conciliación bancaria en tiempo real",
      "features.module.community.title": "Comunidad",
      "features.module.community.head": "App Móvil Nativa",
      "features.module.community.desc": "Diseñamos una app nativa a la medida de tu comunidad educativa, con notificaciones push para tareas, eventos y alertas críticas.",
      "features.module.stats.title": "Módulo Estadístico",
      "features.module.stats.head": "Monitoreo Académico Constante",
      "features.module.stats.desc": "Visualice el rendimiento académico en tiempo real. Detecte desviaciones, identifique patrones y tome decisiones basadas en datos.",
      "features.module.stats.b1": "Análisis de desviación por curso y asignatura",
      "features.module.stats.b2": "Comparativas históricas de rendimiento",
      "features.module.stats.b3": "Dashboards personalizados para directivos",
      "feature.predictive.title": "Analítica Predictiva",
      "feature.predictive.desc": "No espere a final de año. Nuestra IA analiza patrones de asistencia y calificaciones para alertar sobre posibles deserciones con 3 meses de antelación.",
      "feature.predictive.badge1": "Retención +15%",
      "feature.predictive.badge2": "Automatización Total",
      "feature.finance.title": "Smart Finance",
      "feature.finance.desc": "Conciliación automática. Los padres pagan desde la App, el sistema factura al instante.",
      "feature.app.title": "App Nativa",
      "feature.app.desc": "Una experiencia fluida para estudiantes y padres. Tareas, notas y pagos en el bolsillo.",
      
      // Roles
      "roles.title": "Diseñado para cada protagonista",
      "roles.subtitle": "Una sola plataforma, múltiples experiencias personalizadas.",
      "roles.tab0.title": "Administración",
      "roles.tab0.subtitle": "Control total y visión 360°",
      "roles.tab0.desc": "Deje de gestionar papeles y empiece a liderar personas. Tenga el control financiero y académico en su celular.",
      "roles.tab0.b1": "Dashboard de KPIs en tiempo real",
      "roles.tab0.b2": "Auditoría de calificaciones",
      "roles.tab1.title": "Profesores",
      "roles.tab1.subtitle": "Menos burocracia, más enseñanza",
      "roles.tab1.desc": "Menos burocracia, más enseñanza",
      "roles.tab1.b1": "Planificación curricular automática",
      "roles.tab1.b2": "Calificación masiva en 1 click",
      "roles.tab1.b3": "Comunicación directa con padres",
      "roles.tab1.content.title": "Asistente IA para Docentes",
      "roles.tab2.title": "Estudiantes",
      "roles.tab2.subtitle": "Todo el campus en su bolsillo",
      "roles.tab2.desc": "Tu vida escolar en tu bolsillo. Revisa tu horario, entrega tareas y ve tus notas sin tener que preguntar en secretaría.",
      "roles.tab2.b1": "Acceso rápido a horario y tareas",
      "roles.tab2.b2": "Notificaciones de entrega y eventos",
      "roles.tab3.title": "Apoderados",
      "roles.tab3.subtitle": "Conectados con la educación de sus hijos",
      "roles.tab3.desc": "Manténgase conectado con la educación de sus hijos. Acceda a notas, pagos y comunicaciones desde cualquier lugar.",
      "roles.tab3.b1": "Seguimiento de notas en tiempo real",
      "roles.tab3.b2": "Pagos y facturación desde la app",
      "roles.tab3.b3": "Comunicación directa con profesores",
      "roles.tab3.b4": "Notificaciones de eventos y reuniones",
      "roles.tab3.content.title": "Todo sobre sus hijos en un solo lugar",
      "roles.tab3.content.desc": "Manténgase informado sobre el progreso académico, pagos y eventos escolares desde cualquier dispositivo.",
      "roles.parent.feat1": "Seguimiento de notas en tiempo real",
      "roles.parent.feat2": "Pagos y facturación desde la app",
      "roles.parent.feat3": "Comunicación directa con profesores",
      "roles.parent.feat4": "Notificaciones de eventos y reuniones",
      "roles.parent.payment": "Pago Exitoso",
      "roles.parent.payment_desc": "Mensualidad Diciembre",
      "roles.parent.grade": "Nueva Calificación",
      "roles.parent.grade_desc": "Matemáticas: 6.5",
      "roles.tab0.content.title": "Decisiones basadas en datos",
      "roles.tab0.content.desc": "Acceda a reportes financieros y académicos en tiempo real. Elimine las sorpresas a fin de mes.",
      
      // Stats
      "stats.cloud": "En la Nube",
      "stats.modules": "Módulos Integrados",
      "stats.platform": "Plataforma Única",
      "stats.support": "Soporte Humano",
      
      // CTA
      "cta.title": "El futuro de su colegio comienza hoy.",
      "cta.subtitle": "Solicite una sesión guiada con nuestro equipo. Implementación acompañada y soporte experto desde el primer día.",
      "cta.email_placeholder": "Correo institucional",
      "cta.button": "Agendar Demo",
      
      // Pricing
      "pricing.title": "Un plan para cada etapa de tu institución",
      "pricing.subtitle": "Desde el cumplimiento normativo hasta la retención inteligente. Escala a tu ritmo.",
      "pricing.plan.start.focus": "Enfoque: Cumplir la Norma (Circular 30)",
      "pricing.plan.start.title": "Plan Básico",
      "pricing.plan.start.tagline": "(Smart Compliance)",
      "pricing.plan.start.subtitle": "Cumple con la Circular 30 y digitaliza tus notas y asistencia. Tus apoderados podrán consultar el rendimiento de sus hijos en tiempo real.",
      "pricing.plan.start.b1": "<i class='fa-solid fa-check text-brand-600'></i> Libro de Clases Digital (MINEDUC)",
      "pricing.plan.start.b2": "<i class='fa-solid fa-check text-brand-600'></i> Módulo Calificaciones",
      "pricing.plan.start.b3": "<i class='fa-solid fa-check text-brand-600'></i> Módulo Asistencia",
      "pricing.plan.start.b4": "<i class='fa-solid fa-eye text-slate-400'></i> Acceso Alumnos (Visor de Notas)",
      "pricing.plan.start.b5": "<i class='fa-solid fa-eye text-slate-400'></i> Acceso Apoderados (Solo Lectura)",
      "pricing.plan.start.b6": "<i class='fa-solid fa-check text-brand-600'></i> Evaluaciones (Creación Manual)",
      "pricing.plan.start.b7": "<i class='fa-solid fa-check text-brand-600'></i> Soporte por Ticket / Email",
      "pricing.plan.start.button": "Elegir Básico",
      "pricing.plan.growth.badge": "MÁS POPULAR",
      "pricing.plan.growth.focus": "Enfoque: Potenciar al Docente (IA)",
      "pricing.plan.growth.title": "Plan Profesional",
      "pricing.plan.growth.tagline": "(Academic AI)",
      "pricing.plan.growth.subtitle": "Desbloquea el poder de la IA para tus profesores. Crea evaluaciones en segundos y activa la comunicación bidireccional con el hogar.",
      "pricing.plan.growth.b1": "<i class='fa-solid fa-check text-brand-600'></i> Todo lo del Plan Básico",
      "pricing.plan.growth.b2": "<i class='fa-solid fa-users text-brand-600'></i> Acceso Alumnos (Tareas y Recursos)",
      "pricing.plan.growth.b3": "<i class='fa-solid fa-bell text-brand-600'></i> <strong>Apoderados Interactivos (Mensajería y Alertas Push)</strong>",
      "pricing.plan.growth.b4": "<i class='fa-solid fa-robot text-brand-600'></i> <strong>Generador de Evaluaciones con IA</strong>",
      "pricing.plan.growth.b5": "<i class='fa-solid fa-comments text-brand-600'></i> Soporte Prioritario",
      "pricing.plan.growth.button": "Agendar Demo",
      "pricing.plan.enterprise.focus": "Enfoque: Proteger la Matrícula (Sostenedor)",
      "pricing.plan.enterprise.title": "Plan Institucional",
      "pricing.plan.enterprise.tagline": "(Strategic Retention)",
      "pricing.plan.enterprise.subtitle": "La única plataforma que te avisa quién va a desertar antes de que suceda. Panel financiero y académico unificado para decisiones estratégicas.",
      "pricing.plan.enterprise.b1": "<i class='fa-solid fa-check text-brand-600'></i> Todo lo del Plan Profesional",
      "pricing.plan.enterprise.b2": "<i class='fa-solid fa-user-check text-brand-600'></i> Acceso Alumnos (Perfil Completo)",
      "pricing.plan.enterprise.b3": "<i class='fa-solid fa-shield-halved text-brand-600'></i> <strong>Predicción de Deserción con IA</strong>",
      "pricing.plan.enterprise.b4": "<i class='fa-solid fa-coins text-brand-600'></i> <strong>Gestión Financiera (Pagos/Copagos)</strong>",
      "pricing.plan.enterprise.b5": "<i class='fa-solid fa-building text-brand-600'></i> Multi-sede",
      "pricing.plan.enterprise.b6": "<i class='fa-brands fa-whatsapp text-brand-600'></i> Gerente de Cuenta (WhatsApp)",
      "pricing.plan.enterprise.button": "Contactar Ventas",
      "pricing.migration.title": "¿Dudas sobre la migración?",
      "pricing.migration.desc": "Nosotros nos encargamos de importar sus datos históricos gratis.",
      "pricing.migration.link": "Hablar con soporte",
      
      // Infografía
      "infographic.badge": "Del Ausentismo a la Deserción",
      "infographic.title": "El Enemigo Silencioso de la Matrícula",
      "infographic.subtitle": "¿Sabe cuánta subvención pierde su colegio por el <strong class='text-slate-700 dark:text-slate-200'>Ausentismo Crónico</strong>?",
      "infographic.step1.badge": "Paso 1",
      "infographic.step1.tag": "La Previa",
      "infographic.step1.title": "El Ausentismo Crónico",
      "infographic.step1.text": "Casi <strong class='text-orange-600 dark:text-orange-400'>1 millón de estudiantes</strong> en Chile faltan reiteradamente. No es solo \"faltar a clases\", es el <em>primer indicador invisible</em> de futura deserción que la mayoría ignora.",
      "infographic.step2.badge": "Paso 2",
      "infographic.step2.tag": "El Costo",
      "infographic.step2.title": "La Fuga de Subvención",
      "infographic.step2.text": "Cada día de inasistencia es <strong class='text-red-600 dark:text-red-400'>dinero que su establecimiento deja de percibir</strong>. La deserción final es la pérdida total de esa subvención anual (USE/SEP).",
      "infographic.step3.badge": "Paso 3",
      "infographic.step3.title": "La Solución Predictiva",
      "infographic.step3.text": "Nuestro algoritmo detecta patrones de ausentismo <strong class='text-emerald-600 dark:text-emerald-400'>3 meses antes</strong> de la deserción. Intervenga a tiempo y proteja su matrícula.",
      "infographic.cta": "Calcular mi Pérdida Ahora",
      "infographic.ctaSub": "Simulación gratuita e instantánea. Sin registro.",
      
      // Footer
      "footer.product": "Producto",
      "footer.resources": "Recursos",
      "footer.legal": "Legal",
      "footer.copy": "Hecho con <i class='fa-solid fa-heart text-red-400'></i> para la educación",
      "footer.desc": "Transformamos la educación digital, impulsando su prosperidad con automatización inteligente.",
      "footer.product.academy": "Academia",
      "footer.product.finance": "Finanzas",
      "footer.product.communications": "Comunicaciones",
      "footer.product.api": "API",
      "footer.resources.blog": "Blog",
      "footer.resources.success": "Casos de Éxito",
      "footer.resources.help": "Centro de Ayuda",
      "footer.legal.privacy": "Privacidad",
      "footer.legal.terms": "Términos",
      "footer.legal.security": "Seguridad",
      
      // Navigation
      "nav.home": "Inicio",
      
      // Tooltips
      "tooltip.theme": "Cambiar tema (oscuro / claro)",
      "tooltip.lang": "Cambiar idioma (ES / EN)",
      "nav.theme": "Tema",
      "skip.content": "Saltar al contenido principal",
      "roles.tab1.generating": "Generando Examen...",
      "roles.tab2.notification.title": "Tarea de Historia",
      "roles.tab2.notification.subtitle": "Vence mañana 10:00 AM"
    }
  };

  function applyTranslations(lang) {
    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = translations[lang] && translations[lang][key];
      if (!text) return;
      if (el.tagName === 'INPUT') el.placeholder = text;
      else el.innerHTML = text;
    });

    // Apply titles (tooltips) from data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const text = translations[lang] && translations[lang][key];
      if (text) el.title = text;
    });

    // Apply placeholders from data-i18n-placeholder (e.g., inputs)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = translations[lang] && translations[lang][key];
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
        else el.setAttribute('placeholder', text);
      }
    });

    // Update role blocks
    const roleBtns = document.querySelectorAll('[data-role-key]');
    roleBtns.forEach((el) => {
      const key = el.getAttribute('data-role-key');
      if (translations[lang][`roles.${key}.title`]) {
        const h = el.querySelector('h2,h3,h4');
        if (h) h.innerText = translations[lang][`roles.${key}.title`];
      }
      if (translations[lang][`roles.${key}.desc`]) {
        const p = el.querySelector('p');
        if (p) p.innerText = translations[lang][`roles.${key}.desc`];
      }
    });

    // Update language buttons
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.innerText = lang.toUpperCase();
    const mobileLang = document.getElementById('mobile-lang-toggle');
    if (mobileLang) mobileLang.innerText = lang.toUpperCase();
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);

    // Mark active nav link
    markActiveNav();
  }

  // Mark active nav link based on current path (robust: normalizes paths and handles anchors)
  function markActiveNav() {
    const container = document.getElementById('nav-container');
    if (!container) return;
    
    const navLinks = container.querySelectorAll('a.nav-link');
    
    // Determine current page using data attribute fallback to URL
    const body = document.body;
    const pageFromBody = body && body.dataset ? body.dataset.page : '';
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop() || '';
    let currentPage = pageFromBody || filename.replace(/\.html$/, '') || 'index';
    
    // If pathname ends with / or filename is empty, it's the index page
    if (pathname.endsWith('/') || filename === '' || currentPage === '') {
      currentPage = pageFromBody || 'index';
    }
    
    // Clear all active states first
    navLinks.forEach(a => {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });
    
    // Find and mark the active link
    let activeLink = null;
    
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      // Get the page name from href
      // Handle directory paths like "calculator/" — use the directory name, not empty string
      const cleanHref = href.split('?')[0].split('#')[0].replace(/\/+$/, '');
      let hrefPage = cleanHref.split('/').pop().replace(/\.html$/, '') || 'index';
      
      if (hrefPage === currentPage) {
        activeLink = a;
      }
    });
    
    // If no match found and we're on index, select the first link (Home)
    if (!activeLink && currentPage === 'index') {
      activeLink = container.querySelector('a.nav-link[href="index.html"]') ||
                   container.querySelector('a.nav-link[data-i18n="nav.home"]') ||
                   container.querySelector('a.nav-link');
    }
    
    // Mark the active link
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  // Close and set active on click so the selector moves immediately when user clicks a nav link
  function bindNavClickBehavior() {
    document.querySelectorAll('a.nav-link').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';
        // If it's an in-page anchor, prevent full navigation and scroll smoothly
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
          history.replaceState(null, '', href);
          document.querySelectorAll('a.nav-link').forEach(x => { x.classList.remove('active'); x.removeAttribute('aria-current'); });
          a.classList.add('active'); a.setAttribute('aria-current', 'page');
          // close mobile menu if open (Alpine handles it on navigation, but attempt best-effort)
          const mobileMenu = document.querySelector('[x-data] [x-show]'); if (mobileMenu) mobileMenu.style.display = 'none';
        } else {
          // Mark active immediately so the user sees the selector move before page unload
          document.querySelectorAll('a.nav-link').forEach(x => { x.classList.remove('active'); x.removeAttribute('aria-current'); });
          a.classList.add('active'); a.setAttribute('aria-current', 'page');
          // allow navigation to proceed normally
        }
      });
    });

    // Handle history navigation (back/forward)
    window.addEventListener('popstate', markActiveNav);
    window.addEventListener('hashchange', markActiveNav);
  }

  function applyTheme(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
    
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeIcon.style.color = '#fcd34d'; // yellow-300
      }
      if (mobileThemeIcon) { mobileThemeIcon.classList.remove('fa-moon'); mobileThemeIcon.classList.add('fa-sun'); }
      // Also update mobile theme button icon if it exists
      if (mobileThemeBtn) {
        const icon = mobileThemeBtn.querySelector('i');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
      }
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeIcon.style.color = ''; // reset to CSS default
      }
      if (mobileThemeIcon) { mobileThemeIcon.classList.remove('fa-sun'); mobileThemeIcon.classList.add('fa-moon'); }
      if (mobileThemeBtn) {
        const icon = mobileThemeBtn.querySelector('i');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
      }
    }
    localStorage.setItem('theme', theme);
    
    // Update nav indicator color
    updateNavIndicator();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // FIRST: Mark active nav link immediately on page load
    markActiveNav();
    
    // Store nav menu reference
    navMenu = document.querySelector('.nav-menu');
    
    // Toggle mobile menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
    }

    // Dropdowns on mobile: ensure only one open when clicked
    const dropdownToggles = document.querySelectorAll('.dropdown > .nav-link');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 960) {
          e.preventDefault();
          const menu = toggle.nextElementSibling;
          const isOpen = menu.classList.contains('show');
          document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
          if (!isOpen) menu.classList.add('show');
        }
      });
    });

    // Tabs interaction
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function activateTab(target) {
      tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === target));
      tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === target));
    }

    if (tabButtons.length && tabPanels.length) {
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => activateTab(btn.dataset.tab));
      });
      const firstTab = tabButtons[0];
      if (firstTab) activateTab(firstTab.dataset.tab);
    }

    // Smooth scroll for in-page anchors
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }
      });
    });

    // Init theme & lang
    // Default to light mode unless the user explicitly chose a theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    // Ensure default language is Spanish (ES) on first visit
    if (!localStorage.getItem('lang')) localStorage.setItem('lang', 'es');
    const savedLang = localStorage.getItem('lang') || 'es';
    applyTranslations(savedLang);
    
    // Ensure nav click behavior is bound so the selector moves immediately when clicking links
    bindNavClickBehavior();
    // Bind pricing card interactions (selection / keyboard)
    bindPricingCards();
    // Bind theme and language toggles
    bindThemeToggle();
    bindLangToggle();
    // Nav indicator is now CSS-based, no need for createNavIndicator()
    
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
          el.classList.add('active');
        }
      });
    };

    if (revealElements.length) {
      window.addEventListener('scroll', revealOnScroll);
      revealOnScroll();
    }
    
    // Update nav indicator on resize
    window.addEventListener('resize', updateNavIndicator);
  });

  // Pricing cards: click and keyboard interactions
  function bindPricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    if (!cards.length) return;

    function setSelected(card) {
      cards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
      });
      if (card) {
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        try { localStorage.setItem('selectedPlan', card.getAttribute('data-plan')); } catch (e) {}
      }
    }

    cards.forEach(card => {
      card.addEventListener('click', () => setSelected(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelected(card);
        }
      });
    });

    // Restore selection from localStorage if available
    try {
      const saved = localStorage.getItem('selectedPlan');
      if (saved) {
        const el = document.querySelector(`.pricing-card[data-plan="${saved}"]`);
        if (el) setSelected(el);
      }
    } catch (e) {}
  }

  // Bind theme toggles
  function bindThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }
    const mobileTheme = document.getElementById('mobile-theme-toggle');
    if (mobileTheme) {
      mobileTheme.addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }
  }

  // Bind language toggles
  function bindLangToggle() {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const current = localStorage.getItem('lang') || 'es';
        const newLang = current === 'es' ? 'en' : 'es';
        applyTranslations(newLang);
      });
    }
    const mobileLangToggle = document.getElementById('mobile-lang-toggle');
    if (mobileLangToggle) {
      mobileLangToggle.addEventListener('click', () => {
        const current = localStorage.getItem('lang') || 'es';
        const newLang = current === 'es' ? 'en' : 'es';
        applyTranslations(newLang);
      });
    }
  }

  // Create and update the nav indicator (now handled by CSS)
  function createNavIndicator() {
    // The indicator is now CSS-based via ::after pseudo-element
    // This function just ensures active class is set correctly
    markActiveNav();
  }

  function updateNavIndicator() {
    // CSS handles the indicator, just ensure active state is correct
    markActiveNav();
  }

  // Close mobile nav on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && navMenu) {
      navMenu.classList.remove('open');
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    }
  });
})();

/* Demo request handler: sends the email entered in the hero CTA to the serverless endpoint */
async function sendDemoRequest() {
  const btn = document.getElementById('cta-button');
  const input = document.getElementById('cta-email');
  if (!btn || !input) return;

  const email = input.value.trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    input.focus();
    alert('Ingresa un correo válido');
    return;
  }

  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('opacity-60', 'cursor-not-allowed');
  btn.innerHTML = 'Enviando...';

  try {
    // Using Web3Forms - free service for jorge.castro@smartstudent.cl
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '006e8697-4451-46f2-9442-be1cbc404c49',
        subject: '🎓 Nueva solicitud de Demo - Smart Student',
        from_name: 'Smart Student Web',
        email: email,
        message: `Se ha recibido una nueva solicitud de demo.\n\nCorreo del interesado: ${email}\nFecha: ${new Date().toLocaleString('es-CL')}`
      })
    });

    const data = await res.json();

    if (data.success) {
      btn.innerHTML = '¡Enviado! ✓';
      input.value = '';
      showFeedback('✅ Nuestro equipo pronto se pondrá en contacto con usted.', 'success');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = true;
        btn.classList.add('opacity-60', 'cursor-not-allowed');
      }, 3000);
    } else {
      throw new Error(data.message || 'Error al enviar');
    }
  } catch (err) {
    console.error(err);
    alert('Error al enviar. Intenta nuevamente.');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    btn.classList.remove('opacity-60', 'cursor-not-allowed');
  }
}

// Validation helpers
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show feedback message below the CTA form
function showFeedback(message, type = 'success', timeout = 4000) {
  const feedback = document.getElementById('cta-feedback');
  if (!feedback) return;
  
  feedback.textContent = message;
  feedback.className = 'mt-4 py-3 px-5 rounded-lg text-sm max-w-md mx-auto shadow-lg';
  
  if (type === 'success') {
    feedback.classList.add('bg-white/90', 'text-green-700');
  } else {
    feedback.classList.add('bg-red-100', 'text-red-700');
  }
  
  // Show with animation
  setTimeout(() => feedback.classList.add('show'), 10);
  
  // Auto-hide after timeout
  setTimeout(() => {
    feedback.classList.remove('show');
  }, timeout);
}
window.showFeedback = showFeedback;

// Attach handler to CTA button and setup real-time validation
document.addEventListener('DOMContentLoaded', () => {
  const ctaBtn = document.getElementById('cta-button');
  const input = document.getElementById('cta-email');
  const error = document.getElementById('cta-email-error');

  function updateEmailUI() {
    const val = input.value.trim();
    const valid = isValidEmail(val);

    if (val.length === 0) {
      input.classList.remove('input-invalid');
      input.setAttribute('aria-invalid', 'false');
      if (error) error.classList.add('hidden');
      if (ctaBtn) {
        ctaBtn.disabled = true;
        ctaBtn.classList.add('opacity-60', 'cursor-not-allowed');
      }
      return;
    }

    if (valid) {
      input.classList.remove('input-invalid');
      input.setAttribute('aria-invalid', 'false');
      if (error) error.classList.add('hidden');
      if (ctaBtn) {
        ctaBtn.disabled = false;
        ctaBtn.classList.remove('opacity-60', 'cursor-not-allowed');
      }
    } else {
      input.classList.add('input-invalid');
      input.setAttribute('aria-invalid', 'true');
      if (error) { error.classList.remove('hidden'); error.textContent = 'Formato de correo inválido'; }
      if (ctaBtn) {
        ctaBtn.disabled = true;
        ctaBtn.classList.add('opacity-60', 'cursor-not-allowed');
      }
    }
  }

  if (input) {
    input.addEventListener('input', updateEmailUI);
    input.addEventListener('blur', updateEmailUI);
    // initialize state
    updateEmailUI();
  }

  if (ctaBtn) ctaBtn.addEventListener('click', sendDemoRequest);
});
