# Google Sheets — Almacenamiento de Calculadora

## Resumen

Cada vez que un visitante usa la calculadora y hace clic en **"Agendar Demo"** o **"Contactar Ventas"**, los datos de la simulación se guardan automáticamente en un Google Sheet como fila nueva.

## Arquitectura

```
Usuario → Calculadora React ──→ Google Apps Script ──→ Google Sheet (fila nueva)
                             └─→ /api/save-calculator → Web3Forms (email backup)
```

El frontend envía directamente al Google Sheet desde el navegador del visitante (sin pasar por tu servidor), garantizando que siempre se grabe.

## Configuración (5 minutos)

### 1. Crear el Google Sheet

1. Abre [sheets.new](https://sheets.new) para crear una hoja nueva
2. Renombra la hoja (pestaña inferior) a **`Leads`**
3. En la fila 1, pega estos **encabezados** en A1:P1:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Fecha | Matrícula | Plan | Temporalidad | Precio UF | Mensual UF | Anual UF | Mensual CLP | Anual CLP | Alum. Riesgo | Pérdida Anual | Ahorro Proyect. | ROI | Idioma | Referrer | User Agent |

### 2. Crear el Apps Script

1. En el Sheet, ve a **Extensiones → Apps Script**
2. Borra el contenido por defecto
3. Copia y pega el contenido de [`docs/google-sheet-script.js`](google-sheet-script.js)
4. Guarda (Ctrl+S)

### 3. Publicar como Web App

1. Haz clic en **Implementar → Nueva implementación**
2. Selecciona tipo: **Aplicación web**
3. Configurar:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier persona
4. Haz clic en **Implementar**
5. **Copia la URL** que termina en `/exec`

### 4. Configurar la URL

La URL ya está configurada directamente en el componente React:  
[`smart-student-calculator/src/components/DropoutCalculator.tsx`](../smart-student-calculator/src/components/DropoutCalculator.tsx)  
en la constante `GOOGLE_SHEET_URL`.

Si cambias la URL del Apps Script, actualiza esa constante.

## Probar

```bash
# Test directo al Apps Script
curl -L -X POST "TU_URL_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"enrollment":500,"plan":"profesional","temporalidad":1,"unitPriceUF":"0.040","monthlyUF":"20.00","annualUF":"240.00","monthlyCLP":770000,"annualCLP":9240000,"studentsAtRisk":15,"annualLoss":22500000,"projectedSavings":13260000,"roi":"2.4","lang":"es","timestamp":"16-02-2026 10:00","referrer":"test","userAgent":"curl"}'
```

Si todo funciona, verás una fila nueva en el Sheet.

## Archivos involucrados

| Archivo | Función |
|---------|---------|
| `docs/google-sheet-script.js` | Código para Google Apps Script (copiar al Sheet) |
| `api/save-calculator.js` | Serverless function que reenvía datos a Sheet + email |
| `smart-student-calculator/src/components/DropoutCalculator.tsx` | Componente React que envía datos al hacer click en CTA |
| `js/main.js` | Incluye datos del calculator en el email de demo |

## Datos almacenados por fila

| Columna | Dato |
|---------|------|
| Fecha | Timestamp de la interacción |
| Matrícula | Nº de alumnos ingresados |
| Plan | Básico / Profesional / Institucional |
| Temporalidad | 1, 3 o 5 años |
| Precio UF | Precio unitario UF/alumno/mes |
| Mensual UF | Costo mensual total en UF |
| Anual UF | Costo anual total en UF |
| Mensual CLP | Costo mensual aprox. en CLP |
| Anual CLP | Costo anual aprox. en CLP |
| Alum. Riesgo | Alumnos en riesgo de deserción |
| Pérdida Anual | Pérdida por deserción (CLP) |
| Ahorro Proyect. | Ahorro proyectado con SmartStudent |
| ROI | Ratio de retorno (e.g. 2.4x) |
| Idioma | es / en |
| Referrer | Página de origen del visitante |
| User Agent | Navegador del visitante |

## Notas

- Si `GOOGLE_SHEET_URL` no responde, el formulario sigue funcionando normalmente (solo no se graba en el Sheet).
- El envío al Sheet es **non-blocking**: no afecta la experiencia del usuario.
- El frontend envía directamente al Google Sheet (con `mode: 'no-cors'`), evitando pasar por tu servidor.
- Los datos también se guardan en `localStorage` del navegador del visitante (clave `ss_calculator`), para enriquecer el formulario de demo si lo llenan después.
- **IMPORTANTE:** Cada vez que actualices el código en Apps Script, debes crear una **nueva implementación** (no editar la existente) para que los cambios se reflejen.
