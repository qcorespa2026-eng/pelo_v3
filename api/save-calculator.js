// Vercel serverless function (api/save-calculator.js)
// Sends email notification via Web3Forms when user interacts with the calculator.
// Google Sheet storage is handled directly by the frontend → Google Apps Script.

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    enrollment,
    plan,
    temporalidad,
    unitPriceUF,
    monthlyUF,
    annualUF,
    monthlyCLP,
    annualCLP,
    studentsAtRisk,
    annualLoss,
    projectedSavings,
    roi,
    timestamp,
    lang,
    userAgent,
    referrer,
  } = req.body || {};

  // Minimal validation
  if (!enrollment || !plan) {
    return res.status(400).json({ error: 'Missing required fields: enrollment, plan' });
  }

  const WEB3FORMS_KEY = '006e8697-4451-46f2-9442-be1cbc404c49';

  const fmtCLP = (v) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v || 0);

  const planNames = { basico: 'Básico', profesional: 'Profesional', institucional: 'Institucional' };

  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: `📊 Interacción Calculadora — ${enrollment} alumnos — Plan ${planNames[plan] || plan}`,
    from_name: 'Smart Student Calculator',
    // Web3Forms requires an email field
    email: 'calculadora@smartstudent.cl',
    message: [
      `═══════════════════════════════════════`,
      `  NUEVA INTERACCIÓN — CALCULADORA`,
      `═══════════════════════════════════════`,
      ``,
      `📋 DATOS DE LA SIMULACIÓN`,
      `──────────────────────────`,
      `  Matrícula:         ${enrollment} alumnos`,
      `  Plan seleccionado: ${planNames[plan] || plan}`,
      `  Temporalidad:      ${temporalidad || 1} año(s)`,
      ``,
      `💰 PRICING`,
      `──────────────────────────`,
      `  Precio unitario:   ${unitPriceUF || '—'} UF / alumno / mes`,
      `  Costo mensual:     ${monthlyUF || '—'} UF  ≈  ${fmtCLP(monthlyCLP)}`,
      `  Costo anual:       ${annualUF || '—'} UF  ≈  ${fmtCLP(annualCLP)}`,
      ``,
      `📉 ROI PROYECTADO`,
      `──────────────────────────`,
      `  Alumnos en riesgo: ${studentsAtRisk || '—'} / año`,
      `  Pérdida anual:     ${fmtCLP(annualLoss)}`,
      `  Ahorro proyectado: ${fmtCLP(projectedSavings)}`,
      `  Ratio ROI:         ${roi || '—'}x`,
      ``,
      `🌐 CONTEXTO`,
      `──────────────────────────`,
      `  Idioma:    ${lang || 'es'}`,
      `  Fecha:     ${timestamp || new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}`,
      `  Referrer:  ${referrer || '—'}`,
      `  UA:        ${userAgent || '—'}`,
    ].join('\n'),
  };

  try {
    // ── Web3Forms email notification ──
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await r.json();

    if (data.success) {
      return res.status(200).json({ ok: true });
    } else {
      console.error('Web3Forms error:', data);
      return res.status(502).json({ error: 'web3forms_error', details: data.message });
    }
  } catch (err) {
    console.error('Save calculator failed:', err);
    return res.status(500).json({ error: 'send_failed', details: err.message });
  }
};
