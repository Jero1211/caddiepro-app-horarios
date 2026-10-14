const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'DIAS DE ACOMPAÑAMIENTOS BECARIOS.xlsx');
console.log('Reading:', filePath);

const workbook = xlsx.readFile(filePath);
console.log('Sheet Names:', workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
  console.log(`\n=================== SHEET: ${sheetName} ===================`);
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`Total rows: ${jsonData.length}`);
  // Print first 15 rows to understand the layout
  jsonData.slice(0, 15).forEach((row, idx) => {
    console.log(`Row ${idx}:`, JSON.stringify(row));
  });
});
