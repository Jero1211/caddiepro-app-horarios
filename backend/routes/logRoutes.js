const express = require('express');
const router = express.Router();
const { getLogs, createLog } = require('../controllers/logController');

router.get('/', getLogs);
router.post('/', createLog);

module.exports = router;
