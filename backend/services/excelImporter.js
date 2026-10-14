const path = require('path');
const xlsx = require('xlsx');
const Caddie = require('../models/Caddie');
const ActivityLog = require('../models/ActivityLog');

function determineSport(category) {
  const cat = (category || '').toUpperCase();
  if (cat.includes('HIBRIDO') || cat.includes('HÍBRIDO')) return 'Híbrido';
  if (cat.includes('TENIS')) return 'Tenis';
  return 'Golf';
}

function normalizeDayStatus(amVal, pmVal) {
  const am = (amVal || '').toString().trim().toUpperCase();
  const pm = (pmVal || '').toString().trim().toUpperCase();

  const isStudy = am.includes('ESTUDIA') || pm.includes('ESTUDIA');
  if (isStudy) return 'Estudia';

  const hasAm = am.includes('ASISTE') || am.includes('DISPONIBLE') || am.includes('FIJO');
  const hasPm = pm.includes('ASISTE') || pm.includes('DISPONIBLE') || pm.includes('FIJO');

  if (hasAm && hasPm) return 'Completo';
  if (hasAm) return 'AM';
  if (hasPm) return 'PM';
  return 'Descanso';
}

async function importCaddiesFromExcel(customFilePath = null) {
  const filePath = customFilePath || path.join(__dirname, '..', '..', 'DIAS DE ACOMPAÑAMIENTOS BECARIOS.xlsx');
  
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames.includes('OCT-NOV-DIC') ? 'OCT-NOV-DIC' : workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  if (rows.length < 3) {
    throw new Error('El archivo Excel no tiene suficientes filas de encabezados o datos.');
  }

  // Headers are in row 1
  const headerRow = rows[1] || [];
  const dateHeaders = [];
  for (let col = 14; col < headerRow.length; col++) {
    if (headerRow[col]) {
      dateHeaders.push({ colIndex: col, name: String(headerRow[col]).replace(/\n/g, ' ').trim() });
    }
  }

  const results = {
    totalParsed: 0,
    created: 0,
    updated: 0,
    caddies: []
  };

  // Start parsing from row 3
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[1] || !row[2]) continue;

    const proofUrl = row[0] ? String(row[0]).trim() : '';
    const name = String(row[1]).trim().toUpperCase();
    const documentId = String(row[2]).trim();
    const category = row[3] ? String(row[3]).trim() : 'General';
    const sport = determineSport(category);

    // Columns 4-13 are L-AM, L-PM, M-AM, M-PM, W-AM, W-PM, J-AM, J-PM, V-AM, V-PM
    const lunes = normalizeDayStatus(row[4], row[5]);
    const martes = normalizeDayStatus(row[6], row[7]);
    const miercoles = normalizeDayStatus(row[8], row[9]);
    const jueves = normalizeDayStatus(row[10], row[11]);
    const viernes = normalizeDayStatus(row[12], row[13]);

    // Sabado and Domingo default to AM unless specified in dateAssignments
    const weeklyAvailability = {
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado: 'AM',
      domingo: 'PM'
    };

    // Date assignments map
    const dateAssignments = {};
    for (const dHead of dateHeaders) {
      const cellVal = row[dHead.colIndex];
      if (cellVal !== undefined && cellVal !== null && String(cellVal).trim() !== '') {
        dateAssignments[dHead.name] = String(cellVal).trim();
      }
    }

    const caddieData = {
      documentId,
      name,
      sport,
      category,
      categoryLabel: `Caddie ${category}`,
      venue: name.charCodeAt(0) % 2 === 0 ? 'Llanogrande' : 'Medellín',
      experience: `${(documentId.charCodeAt(documentId.length - 1) % 5) + 1} años`,
      phone: `+57 3${Math.floor(100000000 + Math.random() * 900000000)}`,
      scheduleProofUrl: proofUrl,
      weeklyAvailability,
      dateAssignments,
      foundationNotes: `Becario Fundación Club Campestre. Cédula: ${documentId}. Categoría: ${category}.`,
      active: true
    };

    results.totalParsed++;

    const existing = await Caddie.findOne({ documentId });
    if (existing) {
      await Caddie.updateOne({ documentId }, { $set: caddieData });
      results.updated++;
      results.caddies.push({ documentId, name, action: 'updated' });
    } else {
      await Caddie.create(caddieData);
      results.created++;
      results.caddies.push({ documentId, name, action: 'created' });
    }
  }

  // Log activity
  await ActivityLog.create({
    action: 'Carga Masiva Excel',
    detail: `Importación completada: ${results.totalParsed} caddies procesados (${results.created} nuevos, ${results.updated} actualizados).`,
    type: 'sistema'
  });

  return results;
}

module.exports = {
  importCaddiesFromExcel
};
