<p align="center">
  <img src="img/logo3.png" alt="Smart Student Logo" width="80" />
</p>

<h1 align="center">Smart Student</h1>

<p align="center">
  <strong>El Sistema Operativo de la Educación</strong><br>
  Plataforma de gestión escolar con Inteligencia Artificial que unifica finanzas, academia y comunicación.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versión-3.0-blue?style=flat-square" alt="Versión" />
  <img src="https://img.shields.io/badge/licencia-privada-red?style=flat-square" alt="Licencia" />
  <img src="https://img.shields.io/badge/estado-producción-brightgreen?style=flat-square" alt="Estado" />
  <img src="https://img.shields.io/badge/idiomas-ES%20%7C%20EN-orange?style=flat-square" alt="Idiomas" />
</p>

---

## Descripción

**Smart Student** es una landing page multipágina para una plataforma SaaS de gestión educativa. Diseñada para colegios e instituciones, ofrece módulos de gestión académica, financiera y de comunicación potenciados por inteligencia artificial.

La web incluye un diseño moderno con modo oscuro, animaciones fluidas, i18n (ES/EN) y formulario de contacto con integración a Mailrelay.

---

## Vista Previa

| Modo Claro | Modo Oscuro |
|:-----------:|:-----------:|
| Glassmorphism + Mesh Gradient | Dark mode con tonos slate-900 |

### Secciones Principales

- **Hero** — Video demo interactivo con CTA principal
- **Características** — Bento grid con módulos: Académico, Smart Finance, Estadístico, App Nativa
- **Roles** — Pestañas interactivas para Rectores, Profesores, Estudiantes y Apoderados
- **Planes** — 3 planes de precios: Básico, Profesional (IA), Institucional
- **Lab** — Calculadora de deserción estudiantil (React + TypeScript)
- **Agendar Demo** — Formulario con validación y envío a API

---

## Estructura del Proyecto

```
pelo_v3/
├── index.html                 # Landing principal
├── features.html              # Página de características
├── roles.html                 # Página de roles por usuario
├── plans.html                 # Planes y precios
├── css/
│   └── styles.css             # Estilos compartidos
├── js/
│   └── main.js                # Lógica: tema, i18n, scroll reveal, navegación
├── img/                       # Logos e íconos
├── api/
│   └── send-demo.js           # Endpoint serverless (Vercel) para Mailrelay
├── calculator/                # Calculadora de deserción (build estático)
│   └── index.html
├── smart-student-calculator/  # Código fuente de la calculadora
│   ├── src/
│   │   ├── App.tsx
│   │   └── components/
│   │       └── DropoutCalculator.tsx
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   └── MAILRELAY.md           # Documentación de integración email
└── package.json
```

---

## Tech Stack

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | HTML5, Tailwind CSS (CDN), Alpine.js |
| **Calculadora** | React 19, TypeScript, Vite, Chakra UI, Recharts |
| **Fuentes** | Plus Jakarta Sans (Google Fonts) |
| **Iconos** | Font Awesome 6.4 |
| **API** | Vercel Serverless Functions, Mailrelay |
| **Hosting** | Serve (dev), compatible con Vercel / Netlify |

---

## Características Destacadas

- **Modo Oscuro** — Toggle persistente con `localStorage`, sin flash al cargar
- **Internacionalización (i18n)** — Cambio dinámico ES ↔ EN en toda la web
- **Glassmorphism** — Navbar con blur y transparencia adaptativa
- **Scroll Reveal** — Animaciones de entrada al hacer scroll
- **Diseño Responsivo** — Mobile-first con menú hamburguesa
- **Accesibilidad** — Skip links, `aria-labels`, indicadores de foco
- **SEO** — Meta tags Open Graph, Twitter Cards, robots
- **Formulario de Demo** — Validación de email + envío vía API serverless
- **Calculadora de Deserción** — App React embebida con predicción de riesgo

---

## Instalación y Uso

### Requisitos

- Node.js ≥ 18

### Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/qcorespa2026-eng/pelo_v3.git
cd pelo_v3

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 4173)
npm run dev
```

### Calculadora (desarrollo independiente)

```bash
cd smart-student-calculator
npm install
npm run dev
```

### Build de la calculadora

```bash
cd smart-student-calculator
npm run build
# Los archivos generados se copian a /calculator/
```

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing principal con hero, features, roles, stats y CTA |
| `/features.html` | Detalle de los 4 módulos: Académico, Financiero, Estadístico, Comunidad |
| `/roles.html` | Experiencia por rol: Rectores, Profesores, Estudiantes, Apoderados |
| `/plans.html` | Planes de precios con infografía del iceberg del ausentismo |
| `/calculator/` | Calculadora interactiva de deserción estudiantil |

---

## Planes Disponibles

| Plan | Enfoque | Destacado |
|------|---------|-----------|
| **Básico** *(Smart Compliance)* | Cumplimiento normativo | Libro de Clases Digital, calificaciones y asistencia |
| **Profesional** *(Academic AI)* | Potenciar al docente | Generador de evaluaciones con IA, mensajería push |
| **Institucional** *(Strategic Retention)* | Proteger la matrícula | Predicción de deserción con IA, gestión financiera |

---

## Variables de Entorno

Para el endpoint de contacto (`api/send-demo.js`):

| Variable | Descripción |
|----------|-------------|
| `MAILRELAY_API_KEY` | API Key de Mailrelay |
| `MAILRELAY_ACCOUNT` | Nombre de cuenta Mailrelay |

---

## Licencia

Proyecto privado. © 2025 Smart Student Inc. Todos los derechos reservados.