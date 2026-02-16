# Contexto de Sesión — Smart Student (pelo_v3)

> Documento generado el 16 de febrero de 2026 para continuar en otra conversación.

---

## Repositorio

- **Repo:** `qcorespa2026-eng/pelo_v3`
- **Branch:** `main`
- **Último commit:** `ab900bc` — "feat: almacenamiento de datos de calculadora en Google Sheets"
- **Hosting:** Vercel (frontend + serverless functions)
- **Dominio actual:** SmartStudent.io (está a la venta en GoDaddy por USD $2,950; el sitio corre desde smartstudent.site o similar vía Vercel)

---

## Qué es el proyecto

Sitio web de **Smart Student**, una plataforma SaaS de gestión escolar para colegios en Chile. Incluye:

- **Landing page** (`index.html`) — hero, features, roles, planes, CTA de demo
- **Calculadora inteligente** (`smart-student-calculator/`) — app React/Chakra UI embebida que calcula precios por plan según matrícula, muestra ROI, pérdida por deserción, etc.
- **Whitepaper** (`whitepaper/index.html`) — formulario de descarga de PDF
- **Lab** (`lab/`) — versión estática pre-compilada
- **APIs serverless** (`api/`) — funciones de Vercel

---

## Estructura de archivos relevantes

```
pelo_v3/
├── index.html                          # Landing principal
├── js/main.js                          # JS principal (i18n, demo form, theme)
├── css/styles.css                      # Estilos landing
├── api/
│   ├── send-demo.js                    # Envío de solicitud demo (Mailrelay)
│   ├── send-whitepaper.js              # Envío whitepaper
│   └── save-calculator.js              # ✅ NUEVO — Email notificación calculadora (Web3Forms)
├── docs/
│   ├── MAILRELAY.md                    # Doc integración Mailrelay
│   ├── GOOGLE_SHEET.md                 # ✅ NUEVO — Doc integración Google Sheets
│   └── google-sheet-script.js          # ✅ NUEVO — Código para Google Apps Script
├── smart-student-calculator/
│   ├── src/
│   │   ├── components/
│   │   │   └── DropoutCalculator.tsx    # ✅ MODIFICADO — Componente principal calculadora
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
├── whitepaper/index.html
└── lab/
```

---

## Lo que se hizo en esta conversación

### 1. Persistencia de datos de la calculadora en `localStorage` ✅

**Archivo:** `smart-student-calculator/src/components/DropoutCalculator.tsx`

Se agregó un `useEffect` que guarda automáticamente en `localStorage` (clave `ss_calculator`) cada vez que cambian:
- `enrollment` (matrícula)
- `selectedPlan` (básico/profesional/institucional)
- `temporalidad` (1, 3 o 5 años)

```tsx
useEffect(() => {
  const data = { enrollment, plan: selectedPlan, temporalidad, updatedAt: new Date().toISOString() };
  try { localStorage.setItem('ss_calculator', JSON.stringify(data)); } catch {}
}, [enrollment, selectedPlan, temporalidad]);
```

### 2. Envío de datos al Google Sheet (directo desde frontend) ✅

**Archivo:** `smart-student-calculator/src/components/DropoutCalculator.tsx`

Se creó la función `sendCalculatorData()` que se ejecuta al hacer clic en "Agendar Demo" o "Contactar Ventas". Envía en paralelo a:

1. **Google Sheet** — `fetch` con `mode: 'no-cors'` directo al Apps Script
2. **Vercel API** — `/api/save-calculator` que envía email via Web3Forms

La URL del Google Sheet está hardcodeada como constante:
```tsx
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwgqcAmZzXCtuEhG_SAnf7x4-Y1iKpr9MbIIJOLPnJeToU0zvTV0TE9D_wASpDx_X6jJw/exec';
```

**Datos que envía (payload):**

| Campo | Ejemplo |
|-------|---------|
| enrollment | 1000 |
| plan | "profesional" |
| temporalidad | 1 |
| unitPriceUF | "0.040" |
| monthlyUF | "40.00" |
| annualUF | "480.00" |
| monthlyCLP | 1540000 |
| annualCLP | 18480000 |
| studentsAtRisk | 30 |
| annualLoss | 45000000 |
| projectedSavings | 26520000 |
| roi | "2.4" |
| lang | "es" |
| timestamp | "16-02-2026 17:00" |
| userAgent | (del navegador) |
| referrer | (página de origen) |

### 3. API Vercel para email de calculadora ✅

**Archivo:** `api/save-calculator.js`

Serverless function que recibe POST con los datos de la calculadora y envía un email formateado via Web3Forms (access_key: `006e8697-4451-46f2-9442-be1cbc404c49`) a jorge.castro@smartstudent.cl.

### 4. Email de demo enriquecido con datos de calculadora ✅

**Archivo:** `js/main.js` (función `sendDemoRequest`, líneas ~795-820)

Cuando alguien llena el formulario de demo en la landing, el email ahora incluye los datos de la calculadora si el visitante la usó previamente (leídos desde `localStorage`).

### 5. Google Apps Script para el Sheet ✅

**Archivo:** `docs/google-sheet-script.js`

Script que se copia a Google Apps Script. Soporta:
- `doPost(e)` — recibe JSON body y agrega fila
- `doGet(e)` — recibe `?data=JSON` o parámetros individuales y agrega fila; sin parámetros retorna status check

La hoja destino debe llamarse **"Leads"** con 16 columnas de encabezado.

### 6. Documentación ✅

**Archivo:** `docs/GOOGLE_SHEET.md` — Guía paso a paso para configurar el Sheet.

### 7. Commit y push ✅

```
Commit: ab900bc
Message: feat: almacenamiento de datos de calculadora en Google Sheets
Branch: main → origin/main (pushed)
```

---

## Lo que queda PENDIENTE

### 🔴 CRÍTICO: Actualizar el Apps Script en Google

El usuario ya desplegó la **versión 1** del Apps Script (que solo tenía `doPost` y `doGet` básico), pero el código se actualizó después para soportar recepción de datos por GET. **Debe hacer una nueva implementación:**

1. Abrir el Apps Script en Google (ya existe, proyecto "Proyecto sin título")
2. **Reemplazar TODO el código** con el contenido de `docs/google-sheet-script.js`
3. Guardar (Ctrl+S)
4. Ir a **Implementar → Administrar implementaciones**
5. Hacer clic en el **lápiz ✏️** de la implementación existente
6. Cambiar **Versión** a → **Nueva versión**
7. Hacer clic en **Implementar**

La URL NO cambia, sigue siendo:
```
https://script.google.com/macros/s/AKfycbwgqcAmZzXCtuEhG_SAnf7x4-Y1iKpr9MbIIJOLPnJeToU0zvTV0TE9D_wASpDx_X6jJw/exec
```

### 🟡 Verificar que el Sheet graba datos correctamente

Después de actualizar el Apps Script:
1. Abrir la calculadora en producción
2. Mover el slider de matrícula, elegir un plan
3. Hacer clic en "Agendar Demo"
4. Verificar que aparece una fila nueva en el Google Sheet

### 🟡 Completar encabezados del Sheet

Si no se hizo, agregar en la fila 1 (A1:P1):
```
Fecha | Matrícula | Plan | Temporalidad | Precio UF | Mensual UF | Anual UF | Mensual CLP | Anual CLP | Alum. Riesgo | Pérdida Anual | Ahorro Proyect. | ROI | Idioma | Referrer | User Agent
```

### 🟡 Dominio SmartStudent.io

El dominio `SmartStudent.io` está a la venta en GoDaddy por USD $2,950 (o USD $369/mes con leasing). No se tomó ninguna acción sobre esto.

### ⚪ Posibles mejoras futuras (no solicitadas)

- Agregar campo de **nombre / email del visitante** en la calculadora para capturar leads más completos
- Rate-limiting en `api/save-calculator.js` para evitar spam
- Dashboard o vista en Google Sheets con gráficos automáticos de los leads
- Notificación Slack/Discord cuando llega un nuevo lead al Sheet

---

## Servicios externos utilizados

| Servicio | Uso | Credenciales |
|----------|-----|-------------|
| **Web3Forms** | Email de formularios | access_key: `006e8697-4451-46f2-9442-be1cbc404c49` |
| **Google Apps Script** | Recibe datos y los escribe en Google Sheet | URL pública (ver arriba) |
| **Google Sheets** | Almacenamiento de leads/interacciones | Sheet vinculado al Apps Script |
| **Vercel** | Hosting + serverless functions | Proyecto `pelo_v3` |
| **Mailrelay** | Email de demo (alternativo) | API key en env vars de Vercel |
| **mindicador.cl** | Valor UF en tiempo real | API pública sin key |

---

## Stack técnico

- **Landing:** HTML/CSS/JS vanilla + Tailwind CSS
- **Calculadora:** React 18 + TypeScript + Chakra UI + Recharts + Lucide icons
- **Build:** Vite
- **Deploy:** Vercel (auto-deploy desde GitHub)
- **APIs:** Vercel serverless functions (Node.js)

---

## Botones CTA que disparan el envío de datos

En `DropoutCalculator.tsx`:

1. **Línea ~1000** — Botón "Contactar Ventas" (aparece solo cuando `enrollment > 3000` y plan institucional)
2. **Línea ~1203** — Botón "Agendar Demo" (CTA final, siempre visible)

Ambos llaman a `sendCalculatorData()` en su `onClick` y enlazan a `/index.html#demo`.
