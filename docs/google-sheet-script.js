/**
 * Google Apps Script — Smart Student Calculator Sheet
 * ====================================================
 * Este script recibe datos desde la calculadora y los almacena
 * fila por fila en la hoja activa de Google Sheets.
 *
 * Soporta POST (JSON body) y GET (query params) para máxima compatibilidad.
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Crea un Google Sheet nuevo: https://sheets.new
 * 2. Renombra la primera hoja a "Leads"
 * 3. En la fila 1, pega estos encabezados (A1:P1):
 *    Fecha | Matrícula | Plan | Temporalidad | Precio UF | Mensual UF | Anual UF |
 *    Mensual CLP | Anual CLP | Alum. Riesgo | Pérdida Anual | Ahorro Proyect. |
 *    ROI | Idioma | Referrer | User Agent
 * 4. Ve a Extensiones → Apps Script
 * 5. Borra el contenido por defecto y pega TODO este archivo
 * 6. Haz clic en Implementar → Nueva implementación
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 7. Copia la URL de la implementación (termina en /exec)
 * 8. Pega esa URL como GOOGLE_SHEET_URL en DropoutCalculator.tsx
 *
 * ¡Listo! Cada interacción con la calculadora agregará una fila nueva.
 */

function writeRow(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }

  var row = [
    data.timestamp || new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" }),
    data.enrollment || "",
    data.plan || "",
    data.temporalidad || "",
    data.unitPriceUF || "",
    data.monthlyUF || "",
    data.annualUF || "",
    data.monthlyCLP || "",
    data.annualCLP || "",
    data.studentsAtRisk || "",
    data.annualLoss || "",
    data.projectedSavings || "",
    data.roi || "",
    data.lang || "",
    data.referrer || "",
    data.userAgent || "",
  ];

  sheet.appendRow(row);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    writeRow(data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET handler — accepts data as query params or as a single ?data=JSON param
function doGet(e) {
  try {
    // If a "data" param exists, parse it as JSON
    if (e.parameter && e.parameter.data) {
      var data = JSON.parse(e.parameter.data);
      writeRow(data);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // If individual params exist (enrollment, plan, etc.), use them directly
    if (e.parameter && e.parameter.enrollment) {
      writeRow(e.parameter);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default: status check
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", message: "Smart Student Calculator Sheet API" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
