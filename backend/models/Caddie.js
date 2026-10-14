const mongoose = require('mongoose');

const weeklyAvailabilitySchema = new mongoose.Schema({
  lunes: { type: String, default: 'Descanso' },
  martes: { type: String, default: 'Descanso' },
  miercoles: { type: String, default: 'Descanso' },
  jueves: { type: String, default: 'Descanso' },
  viernes: { type: String, default: 'Descanso' },
  sabado: { type: String, default: 'AM' },
  domingo: { type: String, default: 'AM' }
}, { _id: false });

const caddieSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: [true, 'El número de documento/cédula es obligatorio'],
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'El nombre completo del caddie es obligatorio'],
    trim: true
  },
  sport: {
    type: String,
    enum: ['Golf', 'Tenis', 'Híbrido', 'Otro'],
    default: 'Golf'
  },
  category: {
    type: String,
    default: 'Categoría 2',
    trim: true
  },
  categoryLabel: {
    type: String,
    trim: true
  },
  venue: {
    type: String,
    enum: ['Medellín', 'Llanogrande', 'Ambas'],
    default: 'Llanogrande'
  },
  experience: {
    type: String,
    default: '1 año'
  },
  phone: {
    type: String,
    default: '+57 300 000 0000'
  },
  scheduleProofUrl: {
    type: String,
    trim: true,
    default: ''
  },
  weeklyAvailability: {
    type: weeklyAvailabilitySchema,
    default: () => ({})
  },
  dateAssignments: {
    type: Map,
    of: String,
    default: {}
  },
  foundationNotes: {
    type: String,
    default: 'Becario activo - Fundación Club Campestre de Medellín y Llanogrande'
  },
  active: {
    type: Boolean,
    default: true
  }
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

// Pre-save middleware to calculate categoryLabel and sport if missing
caddieSchema.pre('save', function() {
  if (!this.categoryLabel) {
    this.categoryLabel = this.category;
  }
  if (!this.sport) {
    const catLower = (this.category || '').toLowerCase();
    if (catLower.includes('tenis')) this.sport = 'Tenis';
    else if (catLower.includes('hibrido') || catLower.includes('híbrido')) this.sport = 'Híbrido';
    else this.sport = 'Golf';
  }
});

module.exports = mongoose.model('Caddie', caddieSchema);
