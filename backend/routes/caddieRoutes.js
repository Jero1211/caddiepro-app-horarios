const express = require('express');
const router = express.Router();
const {
  getAllCaddies,
  getCaddieStats,
  getCaddieByIdOrDoc,
  createCaddie,
  updateCaddie,
  updateAvailability,
  deleteCaddie,
  seedFromExcel
} = require('../controllers/caddieController');

// Rutas especiales y de colección
router.get('/', getAllCaddies);
router.post('/', createCaddie);
router.get('/stats', getCaddieStats);
router.post('/seed-excel', seedFromExcel);

// Rutas por ID de MongoDB o por Cédula (documentId)
router.get('/:idOrDoc', getCaddieByIdOrDoc);
router.put('/:idOrDoc', updateCaddie);
router.put('/:idOrDoc/availability', updateAvailability);
router.delete('/:idOrDoc', deleteCaddie);

module.exports = router;
