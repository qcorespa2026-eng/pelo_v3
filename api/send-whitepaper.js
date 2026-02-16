// Vercel serverless function: api/send-whitepaper.js
// Saves the whitepaper lead and sends the correct PDF (ES or EN) to the user via Mailrelay.
//
// Environment variables required (Vercel Project Settings -> Environment Variables):
// - MAILRELAY_API_KEY          (required) Your Mailrelay API key
// - MAILRELAY_ACCOUNT          (optional) Mailrelay account subdomain (default: "smartstudent")
// - FROM_EMAIL                 (optional) Sender email (default: "no-reply@smartstudent.site")
// - WHITEPAPER_PDF_URL_ES      (optional) Public URL of the Spanish whitepaper (default: /Smart_Student_White_Paper_ES_2026.docx)
// - WHITEPAPER_PDF_URL_EN      (optional) Public URL of the English whitepaper (default: /Smart_Student_White_Paper_EN_2026.docx)
// - LEAD_NOTIFY_EMAIL          (optional) Email to receive lead notifications (default: "jorge.castro@smartstudent.cl")

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, institution, role, lang } = req.body || {};

  // Validation
  if (!name || !email || !institution || !role) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'Correo electrónico inválido.' });
  }

  const MAILRELAY_API_KEY = process.env.MAILRELAY_API_KEY;
  const MAILRELAY_ACCOUNT = process.env.MAILRELAY_ACCOUNT || 'smartstudent';
  const FROM_EMAIL = process.env.FROM_EMAIL || 'notificaciones@smartstudent.cl';
  const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || 'jorge.castro@smartstudent.cl';
  const MAILRELAY_API_URL = `https://${MAILRELAY_ACCOUNT}.ipzmarketing.com/api/v1/send_emails`;

  // Pick the correct PDF based on language
  const isEnglish = lang === 'en';
  const WHITEPAPER_PDF_URL = isEnglish
    ? (process.env.WHITEPAPER_PDF_URL_EN || 'https://smartstudent.io/Smart_Student_White_Paper_EN_2026.docx')
    : (process.env.WHITEPAPER_PDF_URL_ES || 'https://smartstudent.io/Smart_Student_White_Paper_ES_2026.docx');

  if (!MAILRELAY_API_KEY) {
    console.error('Missing MAILRELAY_API_KEY');
    return res.status(500).json({ error: isEnglish ? 'Server configuration error.' : 'Error de configuración del servidor.' });
  }

  const timestamp = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

  // ── Email content per language ──
  const emailContent = isEnglish ? {
    subject: 'Your Whitepaper: How to Reduce School Absenteeism with AI',
    greeting: `Hi ${name}! 👋`,
    intro: 'Thank you for your interest in our whitepaper on school absenteeism. Here is your free copy:',
    btnText: '📄 Download Whitepaper',
    boxTitle: 'What will you find in this whitepaper?',
    bullets: [
      'Updated chronic absenteeism statistics in Chile',
      'How AI predicts at-risk students up to 3 months in advance',
      'Step-by-step intervention protocols',
      'Real case: 23% dropout reduction in one semester'
    ],
    closing: `If you have questions or want a personalized demo for <strong>${institution}</strong>, feel free to reply to this email or <a href="https://smartstudent.io/#demo" style="color:#2563eb;text-decoration:none;font-weight:bold;">schedule a demo here</a>.`,
    platformName: 'AI-Powered School Management Platform',
    textFallback: `Hi ${name}, thank you for downloading our whitepaper on school absenteeism. Download it here: ${WHITEPAPER_PDF_URL}`
  } : {
    subject: 'Tu Whitepaper: Cómo Reducir el Ausentismo Escolar con IA',
    greeting: `¡Hola ${name}! 👋`,
    intro: 'Gracias por tu interés en nuestro whitepaper sobre ausentismo escolar. Aquí tienes tu copia gratuita:',
    btnText: '📄 Descargar Whitepaper',
    boxTitle: '¿Qué encontrarás en este whitepaper?',
    bullets: [
      'Datos actualizados de ausentismo crónico en Chile',
      'Cómo la IA predice alumnos en riesgo hasta 3 meses antes',
      'Protocolos de intervención paso a paso',
      'Caso real: reducción del 23% en deserción en un semestre'
    ],
    closing: `Si tienes preguntas o quieres ver una demo personalizada para <strong>${institution}</strong>, no dudes en responder este correo o <a href="https://smartstudent.io/#demo" style="color:#2563eb;text-decoration:none;font-weight:bold;">agendar una demo aquí</a>.`,
    platformName: 'Plataforma de Gestión Escolar con IA',
    textFallback: `Hola ${name}, gracias por descargar nuestro whitepaper sobre ausentismo escolar. Descárgalo aquí: ${WHITEPAPER_PDF_URL}`
  };

  // 1) Send the whitepaper PDF to the user
  const userEmailPayload = {
    from: { email: FROM_EMAIL, name: 'Smart Student' },
    to: [{ email, name }],
    subject: emailContent.subject,
    html_part: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background:#f4f6fa;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:40px 30px;text-align:center;">
            <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px 0;">Smart Student</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">${emailContent.platformName}</p>
          </div>
          <div style="padding:40px 30px;">
            <h2 style="color:#0f172a;font-size:22px;margin:0 0 16px 0;">${emailContent.greeting}</h2>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 16px 0;">${emailContent.intro}</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${WHITEPAPER_PDF_URL}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:bold;">
                ${emailContent.btnText}
              </a>
            </div>
            <div style="background:#f0f9ff;border-left:4px solid #2563eb;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
              <p style="color:#1e40af;font-size:14px;margin:0 0 4px 0;font-weight:bold;">${emailContent.boxTitle}</p>
              <ul style="color:#4b5563;font-size:14px;line-height:1.8;margin:8px 0 0 0;padding-left:20px;">
                ${emailContent.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
            <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:24px 0 0 0;">${emailContent.closing}</p>
          </div>
          <div style="background:#f8fafc;padding:24px 30px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              &copy; 2026 Smart Student Inc. &middot; Santiago, Chile<br>
              <a href="https://smartstudent.io" style="color:#6b7280;text-decoration:none;">smartstudent.io</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text_part: emailContent.textFallback
  };

  // 2) Notify the team about the new lead
  const leadNotifyPayload = {
    from: { email: FROM_EMAIL, name: 'Smart Student - Leads' },
    to: [{ email: LEAD_NOTIFY_EMAIL, name: 'Equipo Smart Student' }],
    subject: `📋 Nuevo Lead Whitepaper — ${name} (${institution})`,
    html_part: `
      <h2>Nuevo lead desde Whitepaper Ausentismo</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;font-family:Arial,sans-serif;">
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px;font-weight:bold;color:#374151;">Nombre</td>
          <td style="padding:10px;color:#4b5563;">${name}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px;font-weight:bold;color:#374151;">Email</td>
          <td style="padding:10px;color:#4b5563;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px;font-weight:bold;color:#374151;">Institución</td>
          <td style="padding:10px;color:#4b5563;">${institution}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px;font-weight:bold;color:#374151;">Cargo</td>
          <td style="padding:10px;color:#4b5563;">${role}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px;font-weight:bold;color:#374151;">Idioma</td>
          <td style="padding:10px;color:#4b5563;">${isEnglish ? 'English' : 'Español'}</td>
        </tr>
        <tr>
          <td style="padding:10px;font-weight:bold;color:#374151;">Fecha</td>
          <td style="padding:10px;color:#4b5563;">${timestamp}</td>
        </tr>
      </table>
      <p style="margin-top:20px;color:#6b7280;font-size:13px;">Fuente: Landing Page /whitepaper</p>
    `,
    text_part: `Nuevo lead Whitepaper:\nNombre: ${name}\nEmail: ${email}\nInstitución: ${institution}\nCargo: ${role}\nIdioma: ${isEnglish ? 'EN' : 'ES'}\nFecha: ${timestamp}`
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-AUTH-TOKEN': MAILRELAY_API_KEY
  };

  try {
    // Send both emails concurrently
    // Send whitepaper to user first
    const userRes = await fetch(MAILRELAY_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(userEmailPayload)
    });

    const userText = await userRes.text();
    console.log('Whitepaper email to user:', userRes.status, userText);

    if (!userRes.ok) {
      console.error('Failed to send whitepaper to user:', userRes.status, userText);
      // Try to extract Mailrelay error detail for logging
      let detail = '';
      try { detail = JSON.stringify(JSON.parse(userText)); } catch (_) { detail = userText; }
      console.error('Mailrelay detail:', detail);

      const errMsg = isEnglish
        ? 'Could not send the email. Please try again or contact us.'
        : 'No se pudo enviar el correo. Inténtalo de nuevo o contáctanos.';
      return res.status(502).json({ error: errMsg });
    }

    // Send lead notification (non-blocking, don't fail if this one fails)
    let notifyStatus = 'skipped';
    try {
      const notifyRes = await fetch(MAILRELAY_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(leadNotifyPayload)
      });
      const notifyText = await notifyRes.text();
      notifyStatus = notifyRes.status;
      console.log('Lead notification email:', notifyRes.status, notifyText);
    } catch (notifyErr) {
      console.error('Lead notification failed (non-critical):', notifyErr.message);
    }

    // Log the lead
    console.log('LEAD_CAPTURED', JSON.stringify({
      type: 'whitepaper_ausentismo',
      name,
      email,
      institution,
      role,
      lang: isEnglish ? 'en' : 'es',
      pdfUrl: WHITEPAPER_PDF_URL,
      timestamp,
      userEmailStatus: userRes.status,
      notifyEmailStatus: notifyStatus
    }));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-whitepaper error:', err);
    const errMsg = isEnglish
      ? 'Internal error. Please try again later.'
      : 'Error interno. Inténtalo de nuevo más tarde.';
    return res.status(500).json({ error: errMsg });
  }
};
