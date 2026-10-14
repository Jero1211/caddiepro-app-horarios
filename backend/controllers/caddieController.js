const Caddie = require('../models/Caddie');
const ActivityLog = require('../models/ActivityLog');
const { importCaddiesFromExcel } = require('../services/excelImporter');

// @desc    Obtener todos los caddies con filtros opcionales
// @route   GET /api/caddies
exports.getAllCaddies = async (req, res) => {
  try {
    const { sport, venue, category, search, active } = req.query;
    const filter = {};

    if (active !== undefined) {
      filter.active = active === 'true';
    }

    if (sport) {
      filter.sport = { $regex: new RegExp(`^${sport}$`, 'i') };
    }

    if (venue) {
      filter.venue = { $regex: new RegExp(`^${venue}$`, 'i') };
    }

    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { documentId: { $regex: new RegExp(search, 'i') } },
        { category: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const caddies = await Caddie.find(filter).sort({ name: 1 });

    res.json({
      success: true,
      count: caddies.length,
      data: caddies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los caddies',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas del club y caddies
// @route   GET /api/caddies/stats
exports.getCaddieStats = async (req, res) => {
  try {
    const total = await Caddie.countDocuments();
    const active = await Caddie.countDocuments({ active: true });
    const golf = await Caddie.countDocuments({ sport: 'Golf' });
    const tenis = await Caddie.countDocuments({ sport: 'Tenis' });
    const hibrido = await Caddie.countDocuments({ sport: 'Híbrido' });
    const medellin = await Caddie.countDocuments({ venue: 'Medellín' });
    const llanogrande = await Caddie.countDocuments({ venue: 'Llanogrande' });

    res.json({
      success: true,
      data: {
        total,
        active,
        bySport: { Golf: golf, Tenis: tenis, Híbrido: hibrido },
        byVenue: { Medellín: medellin, Llanogrande: llanogrande }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al calcular estadísticas',
      error: error.message
    });
  }
};

// @desc    Obtener caddie por ID de MongoDB o por Cédula (documentId)
// @route   GET /api/caddies/:idOrDoc
exports.getCaddieByIdOrDoc = async (req, res) => {
  try {
    const { idOrDoc } = req.params;
    let caddie = null;

    if (idOrDoc.match(/^[0-9a-fA-F]{24}$/)) {
      caddie = await Caddie.findById(idOrDoc);
    }

    if (!caddie) {
      caddie = await Caddie.findOne({ documentId: idOrDoc });
    }

    if (!caddie) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún caddie con el identificador o cédula: ${idOrDoc}`
      });
    }

    res.json({
      success: true,
      data: caddie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al consultar el caddie',
      error: error.message
    });
  }
};

// @desc    Crear un nuevo caddie
// @route   POST /api/caddies
exports.createCaddie = async (req, res) => {
  try {
    const { documentId, name, sport, category, venue, phone, experience, weeklyAvailability, foundationNotes } = req.body;

    if (!documentId || !name) {
      return res.status(400).json({
        success: false,
        message: 'Los campos documentId (cédula) y name (nombre) son obligatorios'
      });
    }

    const existing = await Caddie.findOne({ documentId: String(documentId).trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Ya existe un caddie registrado con la cédula ${documentId}`
      });
    }

    const newCaddie = await Caddie.create({
      documentId: String(documentId).trim(),
      name: name.trim(),
      sport: sport || 'Golf',
      category: category || 'Categoría 2',
      categoryLabel: category || 'Caddie Categoría 2',
      venue: venue || 'Llanogrande',
      phone: phone || '+57 300 000 0000',
      experience: experience || '1 año',
      weeklyAvailability: weeklyAvailability || {},
      foundationNotes: foundationNotes || 'Becario registrado en el sistema'
    });

    await ActivityLog.create({
      action: 'Nuevo Caddie Creado',
      detail: `${newCaddie.name} (CC: ${newCaddie.documentId}) registrado en ${newCaddie.venue}`,
      type: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Caddie creado exitosamente',
      data: newCaddie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el caddie',
      error: error.message
    });
  }
};

// @desc    Actualizar datos de un caddie
// @route   PUT /api/caddies/:idOrDoc
exports.updateCaddie = async (req, res) => {
  try {
    const { idOrDoc } = req.params;
    let query = { documentId: idOrDoc };
    if (idOrDoc.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: idOrDoc }, { documentId: idOrDoc }] };
    }

    const updated = await Caddie.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el caddie a actualizar con ID/Cédula: ${idOrDoc}`
      });
    }

    await ActivityLog.create({
      action: 'Caddie Actualizado',
      detail: `Se modificó la información de ${updated.name} (CC: ${updated.documentId})`,
      type: 'admin'
    });

    res.json({
      success: true,
      message: 'Caddie actualizado correctamente',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el caddie',
      error: error.message
    });
  }
};

// @desc    Actualizar disponibilidad semanal / días de estudio de un caddie
// @route   PUT /api/caddies/:idOrDoc/availability
exports.updateAvailability = async (req, res) => {
  try {
    const { idOrDoc } = req.params;
    const { weeklyAvailability, foundationNotes } = req.body;

    let query = { documentId: idOrDoc };
    if (idOrDoc.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: idOrDoc }, { documentId: idOrDoc }] };
    }

    const updateFields = {};
    if (weeklyAvailability) updateFields.weeklyAvailability = weeklyAvailability;
    if (foundationNotes) updateFields.foundationNotes = foundationNotes;

    const updated = await Caddie.findOneAndUpdate(query, { $set: updateFields }, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el caddie con ID/Cédula: ${idOrDoc}`
      });
    }

    await ActivityLog.create({
      action: 'Disponibilidad / Estudio Actualizado',
      detail: `Se actualizaron los turnos y horarios de estudio para ${updated.name}`,
      type: 'horario'
    });

    res.json({
      success: true,
      message: 'Disponibilidad actualizada exitosamente',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la disponibilidad',
      error: error.message
    });
  }
};

// @desc    Eliminar un caddie
// @route   DELETE /api/caddies/:idOrDoc
exports.deleteCaddie = async (req, res) => {
  try {
    const { idOrDoc } = req.params;
    let query = { documentId: idOrDoc };
    if (idOrDoc.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: idOrDoc }, { documentId: idOrDoc }] };
    }

    const deleted = await Caddie.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el caddie para eliminar con ID/Cédula: ${idOrDoc}`
      });
    }

    await ActivityLog.create({
      action: 'Caddie Eliminado',
      detail: `Se eliminó a ${deleted.name} (CC: ${deleted.documentId}) de la base de datos`,
      type: 'admin'
    });

    res.json({
      success: true,
      message: `Caddie ${deleted.name} eliminado exitosamente`,
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el caddie',
      error: error.message
    });
  }
};

// @desc    Importar y poblar la base de datos desde el archivo Excel
// @route   POST /api/caddies/seed-excel
exports.seedFromExcel = async (req, res) => {
  try {
    const result = await importCaddiesFromExcel();
    res.json({
      success: true,
      message: 'Base de datos poblada exitosamente desde el archivo Excel',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al importar datos desde Excel',
      error: error.message
    });
  }
};
