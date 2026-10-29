const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  const possibleEdgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ];

  let executablePath = possibleEdgePaths.find(p => fs.existsSync(p));
  if (!executablePath) {
    throw new Error('No se encontró el ejecutable de Edge o Chrome en las rutas estándar de Windows.');
  }

  const htmlPath = path.resolve(__dirname, '..', 'entregas', 'informe_examen2.html');
  const pdfPath = path.resolve(__dirname, '..', 'entregas', 'Examen2_CaddiePro_Prototipo_Movil.pdf');

  console.log('Generando PDF del Informe Técnico de Examen 2...');
  console.log('Navegador:', executablePath);
  console.log('Fuente HTML:', htmlPath);
  console.log('Destino PDF:', pdfPath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();
  console.log('✅ PDF de Examen 2 generado exitosamente en:', pdfPath);
}

generatePDF().catch(err => {
  console.error('❌ Error generando PDF:', err);
  process.exit(1);
});
