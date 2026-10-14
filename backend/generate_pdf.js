const puppeteer = require('puppeteer-core');
const path = require('path');

async function generatePDF() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'guion_sustentacion.html');
  const pdfPath = path.resolve(__dirname, '..', 'Guion_Sustentacion_Seguimiento_2.pdf');

  console.log('Rendering HTML to PDF...');
  console.log('Source:', htmlPath);
  console.log('Output:', pdfPath);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm'
    }
  });

  await browser.close();
  console.log('✅ PDF generado exitosamente en:', pdfPath);
}

generatePDF().catch(err => {
  console.error('❌ Error generando PDF:', err);
  process.exit(1);
});
