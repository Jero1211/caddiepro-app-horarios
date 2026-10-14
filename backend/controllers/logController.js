const ActivityLog = require('../models/ActivityLog');

// @desc    Obtener logs de actividad
// @route   GET /api/logs
exports.getLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit);

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los logs',
      error: error.message
    });
  }
};

// @desc    Crear un log de actividad
// @route   POST /api/logs
exports.createLog = async (req, res) => {
  try {
    const { action, detail, type } = req.body;
    if (!action || !detail) {
      return res.status(400).json({
        success: false,
        message: 'Acción y detalle son obligatorios'
      });
    }

    const log = await ActivityLog.create({
      action,
      detail,
      type: type || 'general'
    });

    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar el log',
      error: error.message
    });
  }
};
