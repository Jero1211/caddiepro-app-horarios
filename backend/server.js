const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const caddieRoutes = require('./routes/caddieRoutes');
const logRoutes = require('./routes/logRoutes');
const Caddie = require('./models/Caddie');
const { importCaddiesFromExcel } = require('./services/excelImporter');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const totalCaddies = await Caddie.countDocuments();
    res.json({
      status: 'online',
      message: 'CaddiePro API Backend Funcionando Correctamente',
      database: 'MongoDB Conectado',
      totalCaddiesInDB: totalCaddies,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error verificando estado del backend',
      error: err.message
    });
  }
});

// Rutas de la API
app.use('/api/caddies', caddieRoutes);
app.use('/api/logs', logRoutes);

// Ruta raíz de bienvenida y documentación
app.get('/', (req, res) => {
  res.json({
    name: 'CaddiePro Backend API - Fundación Club Campestre de Medellín y Llanogrande',
    version: '1.0.0',
    seguimiento: 'Seguimiento 2 - Implementación de Backend y Base de Datos MongoDB',
    endpoints: {
      health: 'GET /api/health',
      stats: 'GET /api/caddies/stats',
      listCaddies: 'GET /api/caddies (opcionales: ?sport=Golf&venue=Medellín&search=Juan)',
      getCaddie: 'GET /api/caddies/:idOrDoc',
      createCaddie: 'POST /api/caddies',
      updateCaddie: 'PUT /api/caddies/:idOrDoc',
      updateAvailability: 'PUT /api/caddies/:idOrDoc/availability',
      deleteCaddie: 'DELETE /api/caddies/:idOrDoc',
      seedExcel: 'POST /api/caddies/seed-excel',
      logs: 'GET /api/logs'
    }
  });
});

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('[Error no controlado]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno en el servidor',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

// Iniciar servidor y conectar a MongoDB
const startServer = async () => {
  await connectDB();

  // Auto-seed si la base de datos está vacía
  try {
    const count = await Caddie.countDocuments();
    if (count === 0) {
      console.log('[Auto-Seed] Base de datos vacía. Importando caddies desde el archivo Excel...');
      const seedResult = await importCaddiesFromExcel();
      console.log(`[Auto-Seed] ¡Éxito! Se importaron ${seedResult.created} caddies a MongoDB.`);
    } else {
      console.log(`[MongoDB] La base de datos ya contiene ${count} caddies registrados.`);
    }
  } catch (seedErr) {
    console.warn('[Auto-Seed Aviso] No se pudo auto-poblar desde Excel al iniciar:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` 🚀 CaddiePro Backend Servidor Corriendo`);
    console.log(` 📍 URL Base: http://localhost:${PORT}`);
    console.log(` 📋 Health Check: http://localhost:${PORT}/api/health`);
    console.log(` 👥 Endpoint Caddies: http://localhost:${PORT}/api/caddies`);
    console.log(`======================================================\n`);
  });
};

startServer();
