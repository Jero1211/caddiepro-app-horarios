const Checkin = require('../models/Checkin');
const ActivityLog = require('../models/ActivityLog');

// @desc    Obtener todas las asistencias / check-ins
// @route   GET /api/asistencias
exports.getAllCheckins = async (req, res) => {
  try {
    const { venue, documentId, status } = req.query;
    let query = {};
    if (venue) query.venue = venue;
    if (documentId) query.documentId = documentId;
    if (status) query.status = status;

    const checkins = await Checkin.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: checkins.length,
      data: checkins
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error consultando asistencias', error: err.message });
  }
};

// @desc    Obtener una asistencia por ID
// @route   GET /api/asistencias/:id
exports.getCheckinById = async (req, res) => {
  try {
    const checkin = await Checkin.findById(req.params.id);
    if (!checkin) {
      return res.status(404).json({ success: false, message: 'Asistencia no encontrada' });
    }
    res.status(200).json({ success: true, data: checkin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error consultando asistencia', error: err.message });
  }
};

// @desc    Crear nueva asistencia desde la app móvil
// @route   POST /api/asistencias
exports.createCheckin = async (req, res) => {
  try {
    const { documentId, caddieName, venue, shift, latitude, longitude, accuracy, distanceMeters, status, hasPhoto, photoUrl, notes } = req.body;

    if (!documentId || !caddieName) {
      return res.status(400).json({
        success: false,
        message: 'El documento (documentId) y nombre (caddieName) son obligatorios.'
      });
    }

    const newCheckin = await Checkin.create({
      documentId,
      caddieName,
      venue: venue || 'Llanogrande',
      shift: shift || 'AM',
      latitude: latitude || 0,
      longitude: longitude || 0,
      accuracy: accuracy || 0,
      distanceMeters: distanceMeters || 0,
      status: status || 'Aprobado en Sede',
      hasPhoto: !!hasPhoto,
      photoUrl: photoUrl || '',
      notes: notes || 'Asistencia registrada'
    });

    // Registrar en auditoría
    await ActivityLog.create({
      action: 'Check-in Asistencia Registrado',
      detail: `Check-in de ${caddieName} (CC: ${documentId}) validado en ${newCheckin.venue}`,
      type: 'checkin',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    res.status(201).json({
      success: true,
      message: 'Asistencia registrada y validada exitosamente en el servidor',
      data: newCheckin
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error registrando asistencia', error: err.message });
  }
};

// @desc    Actualizar asistencia (estado u observaciones)
// @route   PUT /api/asistencias/:id
exports.updateCheckin = async (req, res) => {
  try {
    const checkin = await Checkin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!checkin) {
      return res.status(404).json({ success: false, message: 'Asistencia no encontrada' });
    }

    res.status(200).json({
      success: true,
      message: 'Asistencia actualizada exitosamente',
      data: checkin
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error actualizando asistencia', error: err.message });
  }
};

// @desc    Eliminar una asistencia
// @route   DELETE /api/asistencias/:id
exports.deleteCheckin = async (req, res) => {
  try {
    const checkin = await Checkin.findByIdAndDelete(req.params.id);
    if (!checkin) {
      return res.status(404).json({ success: false, message: 'Asistencia no encontrada' });
    }

    res.status(200).json({
      success: true,
      message: `Asistencia de ${checkin.caddieName} eliminada exitosamente`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error eliminando asistencia', error: err.message });
  }
};

