/**
 * CaddiePro - Initial Data and LocalStorage State Management
 * Fundación Club Campestre de Medellín y Llanogrande
 */

const STORAGE_KEY = 'caddiepro_app_data_v3';

const INITIAL_DATA = {
  caddies: [
    {
      id: '10203040',
      documentId: '10203040',
      name: 'Juan Pérez',
      sport: 'Golf',
      category: 'Categoría 1',
      categoryLabel: 'Caddie Categoría 1',
      venue: 'Llanogrande',
      experience: '6 años',
      phone: '+57 310 456 7890',
      weeklyAvailability: {
        lunes: 'AM',
        martes: 'Estudia',
        miercoles: 'PM',
        jueves: 'Estudia',
        viernes: 'AM',
        sabado: 'AM',
        domingo: 'PM'
      },
      foundationNotes: 'Beca deportiva Fundación Club Campestre. Tutoría académica: Mar/Jue 2pm-6pm.'
    },
    {
      id: '20304050',
      documentId: '20304050',
      name: 'Michael Chang',
      sport: 'Golf',
      category: 'Categoría 1',
      categoryLabel: 'Caddie Categoría 1',
      venue: 'Medellín',
      experience: '8 años',
      phone: '+57 312 345 6789',
      weeklyAvailability: {
        lunes: 'AM',
        martes: 'AM',
        miercoles: 'Descanso',
        jueves: 'PM',
        viernes: 'PM',
        sabado: 'AM',
        domingo: 'AM'
      },
      foundationNotes: 'Líder de grupo en Sede Medellín.'
    },
    {
      id: '30405060',
      documentId: '30405060',
      name: 'Sarah Jenkins',
      sport: 'Tenis',
      category: 'Tenis',
      categoryLabel: 'Caddie de Tenis',
      venue: 'Medellín',
      experience: '4 años',
      phone: '+57 315 678 1234',
      weeklyAvailability: {
        lunes: 'Descanso',
        martes: 'AM',
        miercoles: 'AM',
        jueves: 'PM',
        viernes: 'PM',
        sabado: 'AM',
        domingo: 'PM'
      },
      foundationNotes: 'Canchas de polvo de ladrillo - Tenis Sede Medellín.'
    },
    {
      id: '40506070',
      documentId: '40506070',
      name: 'David Ross',
      sport: 'Golf',
      category: 'Categoría 3',
      categoryLabel: 'Caddie Categoría 3',
      venue: 'Llanogrande',
      experience: '1 año',
      phone: '+57 318 901 2345',
      weeklyAvailability: {
        lunes: 'AM',
        martes: 'PM',
        miercoles: 'Estudia',
        jueves: 'AM',
        viernes: 'Estudia',
        sabado: 'PM',
        domingo: 'PM'
      },
      foundationNotes: 'Programa Semillero Fundación Llanogrande.'
    },
    {
      id: '50607080',
      documentId: '50607080',
      name: 'Carlos Ramírez',
      sport: 'Golf',
      category: 'Categoría 2',
      categoryLabel: 'Caddie Categoría 2',
      venue: 'Llanogrande',
      experience: '3 años',
      phone: '+57 311 222 3344',
      weeklyAvailability: {
        lunes: 'Estudia',
        martes: 'AM',
        miercoles: 'PM',
        jueves: 'AM',
        viernes: 'PM',
        sabado: 'AM',
        domingo: 'Descanso'
      },
      foundationNotes: 'Estudiante de Tecnología Deportiva con apoyo de Fundación.'
    },
    {
      id: '60708090',
      documentId: '60708090',
      name: 'Andrés Montoya',
      sport: 'Tenis',
      category: 'Tenis',
      categoryLabel: 'Caddie de Tenis',
      venue: 'Llanogrande',
      experience: '5 años',
      phone: '+57 314 555 6677',
      weeklyAvailability: {
        lunes: 'AM',
        martes: 'AM',
        miercoles: 'PM',
        jueves: 'Descanso',
        viernes: 'AM',
        sabado: 'PM',
        domingo: 'PM'
      },
      foundationNotes: 'Caddie de Tenis Sede Llanogrande.'
    },
    {
      id: '70809010',
      documentId: '70809010',
      name: 'Luis Fernando Ruiz',
      sport: 'Golf',
      category: 'Categoría 2',
      categoryLabel: 'Caddie Categoría 2',
      venue: 'Medellín',
      experience: '2 años',
      phone: '+57 316 777 8899',
      weeklyAvailability: {
        lunes: 'Descanso',
        martes: 'PM',
        miercoles: 'PM',
        jueves: 'AM',
        viernes: 'AM',
        sabado: 'PM',
        domingo: 'Descanso'
      },
      foundationNotes: 'Horario coordinado con Sede Medellín.'
    },
    {
      id: '80901020',
      documentId: '80901020',
      name: 'Mateo Valencia',
      sport: 'Golf',
      category: 'Categoría 3',
      categoryLabel: 'Caddie Categoría 3',
      venue: 'Medellín',
      experience: '8 meses',
      phone: '+57 319 888 9900',
      weeklyAvailability: {
        lunes: 'Estudia',
        martes: 'Estudia',
        miercoles: 'Estudia',
        jueves: 'AM',
        viernes: 'PM',
        sabado: 'AM',
        domingo: 'PM'
      },
      foundationNotes: 'Talleres formativos en el centro académico Fundación.'
    }
  ],
  activityLogs: [
    {
      id: 'log-1',
      time: '07:00 AM',
      action: 'Horario Consultado',
      detail: 'Juan Pérez consultó su asignación de Septiembre',
      type: 'general'
    },
    {
      id: 'log-2',
      time: '07:15 AM',
      action: 'Disponibilidad Actualizada',
      detail: 'Se ajustaron turnos AM/PM para Carlos Ramírez',
      type: 'admin'
    }
  ]
};

// Data service helpers
const DataService = {
  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Normalize any legacy 'Trabaja' values to 'AM'
        if (parsed.caddies && Array.isArray(parsed.caddies)) {
          parsed.caddies.forEach(c => {
            if (c.weeklyAvailability) {
              Object.keys(c.weeklyAvailability).forEach(day => {
                if (c.weeklyAvailability[day] === 'Trabaja') {
                  c.weeklyAvailability[day] = 'AM';
                }
              });
            }
          });
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  },

  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  resetData() {
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  },

  getCaddieByDocument(docId) {
    const data = this.loadData();
    const cleanDoc = String(docId).trim();
    return data.caddies.find(c => c.documentId === cleanDoc || c.id === cleanDoc);
  },

  updateCaddie(updatedCaddie) {
    const data = this.loadData();
    const index = data.caddies.findIndex(c => c.id === updatedCaddie.id);
    if (index !== -1) {
      data.caddies[index] = { ...data.caddies[index], ...updatedCaddie };
      this.saveData(data);
      return true;
    }
    return false;
  },

  addCaddie(newCaddie) {
    const data = this.loadData();
    data.caddies.push(newCaddie);
    this.addLog('Nuevo Caddie Registrado', `${newCaddie.name} agregado a ${newCaddie.categoryLabel || newCaddie.category}`, 'admin');
    this.saveData(data);
    return true;
  },

  addLog(action, detail, type = 'general') {
    const data = this.loadData();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    data.activityLogs.unshift({
      id: 'log-' + Date.now(),
      time: timeStr,
      action,
      detail,
      type
    });
    if (data.activityLogs.length > 25) data.activityLogs.pop();
    this.saveData(data);
  },

  // Backend API Integration (MongoDB + Express)
  API_URL: 'http://localhost:5000/api',

  async syncWithBackend() {
    try {
      const response = await fetch(`${this.API_URL}/caddies`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const currentData = this.loadData();
          currentData.caddies = result.data.map(c => ({
            id: c.documentId || c._id,
            documentId: c.documentId,
            name: c.name,
            sport: c.sport,
            category: c.category,
            categoryLabel: c.categoryLabel || `Caddie ${c.category}`,
            venue: c.venue || 'Llanogrande',
            experience: c.experience || '1 año',
            phone: c.phone || '+57 300 000 0000',
            weeklyAvailability: c.weeklyAvailability || {},
            foundationNotes: c.foundationNotes || '',
            scheduleProofUrl: c.scheduleProofUrl || ''
          }));
          this.saveData(currentData);
          console.log(`[CaddiePro] Sincronizados ${result.data.length} caddies desde MongoDB backend.`);
          return true;
        }
      }
    } catch (e) {
      console.log('[CaddiePro] Modo local (Backend desconectado o fuera de línea)');
    }
    return false;
  }
};

// Intentar auto-sincronizar al cargar el script si hay conexión con el backend
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    DataService.syncWithBackend();
  });
}

