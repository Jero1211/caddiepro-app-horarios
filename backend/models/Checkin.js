const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: [true, 'El documento del caddie es obligatorio'],
    trim: true,
    index: true
  },
  caddieName: {
    type: String,
    required: [true, 'El nombre del caddie es obligatorio'],
    trim: true
  },
  venue: {
    type: String,
    enum: ['Medellín', 'Llanogrande', 'Ambas'],
    default: 'Llanogrande'
  },
  shift: {
    type: String,
    enum: ['AM', 'PM', 'Completo'],
    default: 'AM'
  },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  distanceMeters: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Aprobado en Sede', 'En Perímetro', 'Pendiente_Sincronizacion', 'Rechazado'],
    default: 'Aprobado en Sede'
  },
  hasPhoto: { type: Boolean, default: false },
  photoUrl: { type: String, default: '' },
  notes: { type: String, default: 'Asistencia registrada en sede' }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      return ret;
    }
  }
});

module.exports = mongoose.model('Checkin', checkinSchema);

