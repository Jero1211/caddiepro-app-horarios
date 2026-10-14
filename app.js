/**
 * CaddiePro - Main Application Controller & Router
 * Fundación Club Campestre de Medellín y Llanogrande
 */

const App = {
  currentView: 'view-consultar',
  currentCaddie: null,
  calendarMonthOffset: 0, // 0 = Sept 2026, 1 = Oct 2026, -1 = Aug 2026, etc.
  selectedDay: 2, // Selected day of month
  activeCategoryFilter: 'all',
  editingCaddieId: null,
  tempWeeklySchedule: {},

  init() {
    this.initTheme();
    this.renderDemoChips();
    this.setupListeners();
    this.updateHeaderBadge();
    
    // Auto load public view
    this.navigate('view-consultar');
  },

  // ==========================================
  // THEME MANAGEMENT (DARK / LIGHT MODE)
  // ==========================================
  initTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    this.updateThemeUI(isDark);
  },

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light', !isDark);
    localStorage.setItem('caddiepro_theme', isDark ? 'dark' : 'light');
    this.updateThemeUI(isDark);
    this.showToast(isDark ? 'Modo Oscuro activado' : 'Modo Claro activado', 'info');
  },

  updateThemeUI(isDark) {
    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon) {
      icon.innerText = isDark ? 'light_mode' : 'dark_mode';
    }
    if (label) {
      label.innerText = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }
  },

  setupListeners() {
    // Restrict input to digits only
    const docInput = document.getElementById('input-documento');
    if (docInput) {
      docInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
      });
    }

    // Header Back button
    const backBtn = document.getElementById('header-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.currentView === 'view-resultado' || this.currentView === 'view-login') {
          this.navigate('view-consultar');
        } else if (this.currentView === 'view-gestionar-horario') {
          this.navigate('view-admin');
        } else if (this.currentView === 'view-admin') {
          this.navigate('view-consultar');
        }
      });
    }
  },

  // ==========================================
  // ROUTING & VIEW NAVIGATION
  // ==========================================
  navigate(viewId) {
    this.currentView = viewId;
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => {
      v.classList.add('hidden');
      v.classList.remove('fade-in');
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('fade-in');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update back button and badges
    this.updateHeaderState();
  },

  updateHeaderState() {
    const backBtn = document.getElementById('header-back-btn');
    const badgeText = document.getElementById('current-view-text');
    const userAction = document.getElementById('header-user-action');

    if (this.currentView === 'view-consultar') {
      backBtn?.classList.add('hidden');
      badgeText.innerText = 'Consulta Pública';
      userAction.innerHTML = `
        <button onclick="App.navigate('view-login')" class="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent-mint hover:bg-surface-low dark:hover:bg-[#1C2D25] px-3 py-2 rounded-xl transition-colors border border-surface-high dark:border-[#1C2D25]">
          <span class="material-symbols-outlined text-base text-accent-leaf">lock</span>
          <span class="hidden sm:inline">Acceso Admin</span>
        </button>
      `;
    } else if (this.currentView === 'view-resultado') {
      backBtn?.classList.remove('hidden');
      badgeText.innerText = 'Horario y Disponibilidad';
      userAction.innerHTML = `
        <button onclick="App.navigate('view-login')" class="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent-mint hover:bg-surface-low dark:hover:bg-[#1C2D25] px-3 py-2 rounded-xl transition-colors border border-surface-high dark:border-[#1C2D25]">
          <span class="material-symbols-outlined text-base text-accent-leaf">lock</span>
          <span class="hidden sm:inline">Acceso Admin</span>
        </button>
      `;
    } else if (this.currentView === 'view-login') {
      backBtn?.classList.remove('hidden');
      badgeText.innerText = 'Acceso Administrativo';
    } else if (this.currentView === 'view-admin') {
      backBtn?.classList.add('hidden');
      badgeText.innerText = 'Panel Admin';
      userAction.innerHTML = `
        <button onclick="App.logoutAdmin()" class="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-2 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/40">
          <span class="material-symbols-outlined text-base">logout</span>
          <span class="hidden sm:inline">Cerrar Sesión</span>
        </button>
      `;
      this.renderAdminDashboard();
    } else if (this.currentView === 'view-gestionar-horario') {
      backBtn?.classList.remove('hidden');
      badgeText.innerText = 'Configurar Turnos AM/PM';
    }
  },

  updateHeaderBadge() {
    const badge = document.getElementById('current-view-badge');
    badge?.classList.remove('hidden');
  },

  // ==========================================
  // VIEW 1: DEMO CHIPS & LOOKUP
  // ==========================================
  renderDemoChips() {
    const container = document.getElementById('demo-chips-container');
    if (!container) return;

    const data = DataService.loadData();
    const demoCaddies = data.caddies.slice(0, 6);

    container.innerHTML = demoCaddies.map(c => {
      const catText = c.sport === 'Tenis' || c.category === 'Tenis' ? 'Tenis' : c.category;
      return `
        <button type="button" onclick="App.fillAndSearch('${c.documentId}')" class="text-left p-2.5 rounded-xl bg-surface-low dark:bg-[#0B1611] hover:bg-surface-high dark:hover:bg-[#1C2D25] border border-surface-high dark:border-[#1C2D25] transition-all group">
          <span class="block text-xs font-bold text-primary dark:text-white group-hover:text-accent-leaf truncate">${c.name}</span>
          <span class="block text-[11px] font-mono text-text-muted dark:text-[#9BB0A5]">${c.documentId} • ${catText}</span>
        </button>
      `;
    }).join('');
  },

  fillAndSearch(docId) {
    const input = document.getElementById('input-documento');
    if (input) {
      input.value = docId;
      this.handleLookupDirect(docId);
    }
  },

  handleLookup(event) {
    event.preventDefault();
    const docId = document.getElementById('input-documento').value.trim();
    if (!docId) {
      this.showToast('Por favor ingrese un número de documento', 'error');
      return;
    }
    this.handleLookupDirect(docId);
  },

  handleLookupDirect(docId) {
    const caddie = DataService.getCaddieByDocument(docId);
    if (!caddie) {
      this.showToast('No se encontró ningún caddie con el documento ' + docId, 'error');
      return;
    }

    this.currentCaddie = caddie;
    this.calendarMonthOffset = 0; // Reset to current month (Septiembre 2026)
    this.selectedDay = 2; // Default select day 2
    this.renderCaddieResult(caddie);
    this.navigate('view-resultado');
  },

  // ==========================================
  // VIEW 2: RENDER CADDIE RESULT & DYNAMIC CALENDAR
  // ==========================================
  renderCaddieResult(caddie) {
    document.getElementById('res-caddie-name').innerText = caddie.name;
    document.getElementById('res-caddie-doc').innerText = caddie.documentId;
    document.getElementById('res-caddie-venue').innerText = caddie.venue || 'Llanogrande';

    let categoryBadgeText = '';
    if (caddie.sport === 'Tenis' || caddie.category === 'Tenis') {
      categoryBadgeText = 'Caddie de Tenis';
    } else if (caddie.category && caddie.category.includes('1')) {
      categoryBadgeText = 'Caddie Categoría 1';
    } else if (caddie.category && caddie.category.includes('2')) {
      categoryBadgeText = 'Caddie Categoría 2';
    } else if (caddie.category && caddie.category.includes('3')) {
      categoryBadgeText = 'Caddie Categoría 3';
    } else {
      categoryBadgeText = caddie.categoryLabel || ('Caddie ' + caddie.category);
    }

    document.getElementById('res-caddie-category').innerText = categoryBadgeText;

    // Render dynamic calendar
    this.renderCalendar();
  },

  changeCalendarMonth(delta) {
    this.calendarMonthOffset += delta;
    this.renderCalendar();
  },

  renderCalendar() {
    if (!this.currentCaddie) return;

    const baseDate = new Date(2026, 8 + this.calendarMonthOffset, 1);
    const currentYear = baseDate.getFullYear();
    const currentMonth = baseDate.getMonth(); // 0 to 11

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentMonthName = monthNames[currentMonth];

    // Set month title
    const monthTitle = document.getElementById('cal-month-title');
    monthTitle.innerText = `${currentMonthName} ${currentYear}`;

    const grid = document.getElementById('cal-days-grid');
    grid.innerHTML = '';

    // Calculate total days in this specific month
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Calculate first weekday of month (Monday-based: Mon=0, Tue=1, ..., Sun=6)
    const firstDaySundayBased = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun, 1=Mon...
    const startDayOffset = (firstDaySundayBased + 6) % 7;

    // Empty blank cells before the 1st of the month
    for (let i = 0; i < startDayOffset; i++) {
      const empty = document.createElement('div');
      empty.className = 'h-14 sm:h-16 rounded-xl bg-transparent';
      grid.appendChild(empty);
    }

    const avail = this.currentCaddie.weeklyAvailability || {};
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

    // Ensure selectedDay does not exceed total days of new month
    if (this.selectedDay > totalDays) {
      this.selectedDay = totalDays;
    }
    if (this.selectedDay < 1) {
      this.selectedDay = 1;
    }

    let selectedDayDetails = null;

    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dayOfWeekName = dayNames[dateObj.getDay()];
      let rawStatus = avail[dayOfWeekName] || 'AM';
      if (rawStatus === 'Trabaja') rawStatus = 'AM'; // Normalize legacy

      const isSelected = (day === this.selectedDay);

      let dotColor = 'bg-accent-leaf';
      let tagText = 'AM';
      let tagClass = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800';

      if (rawStatus === 'PM') {
        dotColor = 'bg-blue-500';
        tagText = 'PM';
        tagClass = 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800';
      } else if (rawStatus === 'Estudia') {
        dotColor = 'bg-amber-400';
        tagText = 'Estudia';
        tagClass = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800';
      } else if (rawStatus === 'Descanso') {
        dotColor = 'bg-surface-highest dark:bg-[#283F34] border border-outline-variant dark:border-[#415A4D]';
        tagText = 'Descanso';
        tagClass = 'text-text-muted dark:text-[#9BB0A5] bg-surface-low dark:bg-[#1C2D25] border-surface-high dark:border-[#2D4439]';
      }

      let statusColorClass = '';
      if (isSelected) {
        // High-contrast active ring and glowing border on selected day
        statusColorClass = 'bg-emerald-50/70 dark:bg-emerald-950/90 border-accent-leaf dark:border-accent-leaf text-primary dark:text-accent-mint ring-2 ring-accent-leaf/60 scale-[1.04] shadow-md z-10';
        selectedDayDetails = { day, dayOfWeekName, status: rawStatus, currentMonthName, currentYear };
      } else {
        statusColorClass = 'bg-surface dark:bg-[#121F19] border-surface-high dark:border-[#1C2D25] text-primary dark:text-white hover:border-accent-leaf/40 hover:bg-surface-low dark:hover:bg-[#182A22]';
      }

      const dayCell = document.createElement('button');
      dayCell.type = 'button';
      dayCell.className = `h-14 sm:h-16 p-1 sm:p-1.5 rounded-xl border ${statusColorClass} flex flex-col justify-between items-center transition-all cursor-pointer`;
      dayCell.onclick = () => {
        App.selectedDay = day;
        App.renderCalendar();
      };

      dayCell.innerHTML = `
        <span class="text-xs font-bold ${isSelected ? 'text-accent-leaf font-extrabold' : 'text-text-main dark:text-white'}">${day}</span>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full ${dotColor}"></span>
          <span class="text-[9px] sm:text-[10px] font-extrabold px-1 rounded border ${tagClass}">${tagText}</span>
        </div>
      `;

      grid.appendChild(dayCell);
    }

    // Update bottom detail card
    if (selectedDayDetails) {
      this.updateDetailCard(
        selectedDayDetails.day,
        selectedDayDetails.dayOfWeekName,
        selectedDayDetails.status,
        selectedDayDetails.currentMonthName,
        selectedDayDetails.currentYear
      );
    }
  },

  updateDetailCard(day, dayName, status, monthName, year) {
    const detailDate = document.getElementById('cal-detail-date');
    const detailBadge = document.getElementById('cal-detail-badge');
    const detailDesc = document.getElementById('cal-detail-desc');
    const foundationNote = document.getElementById('cal-foundation-note');

    const dayCap = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    detailDate.innerText = `${dayCap}, ${day} de ${monthName} de ${year}`;

    if (status === 'AM') {
      detailBadge.innerText = '☀️ Turno AM (Mañana • 06:00 - 13:30)';
      detailBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      detailDesc.innerText = `Jornada activa de mañana programada • Sede ${this.currentCaddie.venue || 'Llanogrande'}. Presentarse en caseta de caddies a las 05:45 AM.`;
    } else if (status === 'PM') {
      detailBadge.innerText = '⛅ Turno PM (Tarde • 12:30 - 19:00)';
      detailBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      detailDesc.innerText = `Jornada activa de tarde programada • Sede ${this.currentCaddie.venue || 'Llanogrande'}. Presentarse en caseta a las 12:15 PM.`;
    } else if (status === 'Estudia') {
      detailBadge.innerText = '🎓 Formación / Tutoría Fundación';
      detailBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      detailDesc.innerText = 'Día exclusivo para actividades académicas, tutorías y talleres formativos de la Fundación Club Campestre.';
    } else {
      detailBadge.innerText = '☕ Día de Descanso';
      detailBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-[#1C2D25] text-gray-700 dark:text-[#9BB0A5] border border-surface-high dark:border-[#2D4439]';
      detailDesc.innerText = 'Día libre programado según tabla de rotación y descanso del Club.';
    }

    if (this.currentCaddie.foundationNotes) {
      foundationNote.classList.remove('hidden');
      foundationNote.innerText = `🎓 Nota Fundación: ${this.currentCaddie.foundationNotes}`;
    } else {
      foundationNote.classList.add('hidden');
    }
  },

  // ==========================================
  // VIEW 3: ADMIN LOGIN
  // ==========================================
  handleLogin(event) {
    event.preventDefault();
    const pin = document.getElementById('admin-pin').value.trim();
    if (pin === '1234' || pin === 'admin') {
      this.showToast('¡Bienvenido Club Manager!', 'success');
      document.getElementById('admin-pin').value = '';
      this.navigate('view-admin');
    } else {
      this.showToast('PIN incorrecto. Prueba con 1234.', 'error');
    }
  },

  fillDemoPin() {
    const pinInput = document.getElementById('admin-pin');
    pinInput.value = '1234';
    this.handleLogin(new Event('submit'));
  },

  logoutAdmin() {
    this.showToast('Sesión de administración cerrada', 'info');
    this.navigate('view-consultar');
  },

  // ==========================================
  // VIEW 4: ADMIN DASHBOARD & TABS
  // ==========================================
  renderAdminDashboard() {
    const data = DataService.loadData();
    
    // Calculate Stats
    const total = data.caddies.length;
    let totalAmShifts = 0;
    let totalPmShifts = 0;
    let studying = 0;

    data.caddies.forEach(c => {
      const avail = c.weeklyAvailability || {};
      Object.values(avail).forEach(val => {
        if (val === 'AM' || val === 'Trabaja') totalAmShifts++;
        else if (val === 'PM') totalPmShifts++;
        else if (val === 'Estudia') studying++;
      });
    });

    const caddiesStudyingCount = data.caddies.filter(c => 
      Object.values(c.weeklyAvailability || {}).includes('Estudia')
    ).length;

    document.getElementById('stat-total-caddies').innerText = total;
    document.getElementById('stat-am-shifts').innerText = totalAmShifts;
    document.getElementById('stat-pm-shifts').innerText = totalPmShifts;
    document.getElementById('stat-studying').innerText = caddiesStudyingCount;

    // Render Roster & Logs
    this.renderAdminRoster();
    this.renderAdminLogs();
  },

  switchAdminTab(tabName) {
    const tabs = ['roster', 'logs'];
    tabs.forEach(t => {
      const btn = document.getElementById(`admin-tab-${t}`);
      const content = document.getElementById(`admin-content-${t}`);
      if (t === tabName) {
        btn.className = 'px-4 py-2.5 font-bold text-sm border-b-2 border-primary dark:border-accent-mint text-primary dark:text-accent-mint flex items-center gap-2 transition-all';
        content.classList.remove('hidden');
      } else {
        btn.className = 'px-4 py-2.5 font-semibold text-sm border-b-2 border-transparent text-text-muted dark:text-[#9BB0A5] hover:text-primary dark:hover:text-white flex items-center gap-2 transition-all';
        content.classList.add('hidden');
      }
    });
  },

  setCategoryFilter(category) {
    this.activeCategoryFilter = category;
    const buttons = document.querySelectorAll('.roster-filter-btn');
    buttons.forEach(btn => {
      if (btn.dataset.cat === category) {
        btn.className = 'roster-filter-btn px-3 py-1 rounded-full text-xs font-bold bg-primary dark:bg-accent-leaf text-white dark:text-[#0A120E]';
      } else {
        btn.className = 'roster-filter-btn px-3 py-1 rounded-full text-xs font-semibold bg-surface dark:bg-[#121F19] border border-surface-high dark:border-[#1C2D25] text-text-muted dark:text-[#9BB0A5] hover:bg-surface-low dark:hover:bg-[#1C2D25]';
      }
    });
    this.filterRoster();
  },

  filterRoster() {
    this.renderAdminRoster();
  },

  renderAdminRoster() {
    const container = document.getElementById('admin-caddies-container');
    const searchVal = (document.getElementById('roster-search-input')?.value || '').toLowerCase();
    const data = DataService.loadData();

    let filtered = data.caddies;

    if (this.activeCategoryFilter !== 'all') {
      filtered = filtered.filter(c => 
        (c.category && c.category.toLowerCase().includes(this.activeCategoryFilter.toLowerCase())) ||
        (c.sport && c.sport.toLowerCase().includes(this.activeCategoryFilter.toLowerCase()))
      );
    }

    if (searchVal) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchVal) || 
        c.documentId.includes(searchVal) ||
        (c.venue && c.venue.toLowerCase().includes(searchVal))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-10 bg-surface dark:bg-[#121F19] rounded-2xl border border-surface-high dark:border-[#1C2D25]">
          <p class="text-sm font-semibold text-text-muted dark:text-[#9BB0A5]">No se encontraron caddies con esos criterios.</p>
        </div>
      `;
      return;
    }

    const dayKeys = [
      { key: 'lunes', short: 'Lun' },
      { key: 'martes', short: 'Mar' },
      { key: 'miercoles', short: 'Mié' },
      { key: 'jueves', short: 'Jue' },
      { key: 'viernes', short: 'Vie' },
      { key: 'sabado', short: 'Sáb' },
      { key: 'domingo', short: 'Dom' }
    ];

    container.innerHTML = filtered.map(c => {
      const isTenis = c.sport === 'Tenis' || c.category === 'Tenis';
      const badgeText = isTenis ? 'Caddie de Tenis' : (c.categoryLabel || ('Caddie ' + c.category));
      const badgeClass = isTenis 
        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

      const avail = c.weeklyAvailability || {};
      const amCount = Object.values(avail).filter(v => v === 'AM' || v === 'Trabaja').length;
      const pmCount = Object.values(avail).filter(v => v === 'PM').length;
      const studyCount = Object.values(avail).filter(v => v === 'Estudia').length;

      // Build 7-day mini schedule strip
      const daysStripHtml = dayKeys.map(d => {
        const status = avail[d.key] || 'AM';
        let pillClass = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        let statusDisplay = 'AM';

        if (status === 'PM') {
          pillClass = 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
          statusDisplay = 'PM';
        } else if (status === 'Estudia') {
          pillClass = 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          statusDisplay = 'Est';
        } else if (status === 'Descanso') {
          pillClass = 'bg-gray-100 dark:bg-[#1C2D25] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700';
          statusDisplay = 'Off';
        }

        return `
          <div class="flex flex-col items-center">
            <span class="text-[10px] text-text-muted dark:text-[#9BB0A5] font-semibold">${d.short}</span>
            <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${pillClass}">${statusDisplay}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="bg-surface dark:bg-[#121F19] rounded-2xl shadow-sm hover:shadow-card p-5 border border-surface-high dark:border-[#1C2D25] transition-all flex flex-col justify-between gap-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-base font-extrabold text-primary dark:text-white">${c.name}</h4>
                <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}">${badgeText}</span>
              </div>
              <p class="text-xs text-text-muted dark:text-[#9BB0A5] mt-1">Doc: <span class="font-mono font-medium">${c.documentId}</span> • Sede: <span class="font-semibold text-primary dark:text-accent-mint">${c.venue || 'Llanogrande'}</span></p>
            </div>
            <span class="text-[11px] font-semibold text-text-muted dark:text-[#9BB0A5] whitespace-nowrap">Exp: ${c.experience || '1 año'}</span>
          </div>

          <!-- Weekly Days Mini Strip -->
          <div class="bg-surface-low dark:bg-[#0B1611] p-3 rounded-xl border border-surface-high dark:border-[#1C2D25]">
            <div class="flex items-center justify-between gap-1 mb-2">
              <span class="text-[11px] font-bold text-text-main dark:text-white">Horario Semanal:</span>
              <span class="text-[11px] font-medium text-text-muted dark:text-[#9BB0A5]">${amCount} AM • ${pmCount} PM • ${studyCount} Estudia</span>
            </div>
            <div class="grid grid-cols-7 gap-1">
              ${daysStripHtml}
            </div>
          </div>

          <!-- Card Actions -->
          <div class="flex items-center justify-between pt-2 border-t border-surface-high dark:border-[#1C2D25]">
            <span class="text-xs font-mono text-text-muted dark:text-[#9BB0A5]">${c.phone}</span>
            <button onclick="App.openEditSchedule('${c.id}')" class="px-3.5 py-1.5 bg-primary hover:bg-primary-container dark:bg-accent-leaf dark:hover:bg-emerald-500 text-white dark:text-[#0A120E] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm active:scale-95">
              <span class="material-symbols-outlined text-sm">schedule</span>
              <span>Editar Turnos</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderAdminLogs() {
    const container = document.getElementById('admin-logs-container');
    const data = DataService.loadData();

    container.innerHTML = data.activityLogs.map(log => {
      let icon = 'event_note';
      let iconColor = 'text-accent-leaf bg-emerald-50 dark:bg-emerald-950/80';
      if (log.type === 'rotation') {
        icon = 'sync_alt';
        iconColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/80';
      } else if (log.type === 'admin') {
        icon = 'edit_calendar';
        iconColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/80';
      }

      return `
        <div class="p-3 bg-surface-low dark:bg-[#0B1611] rounded-xl border border-surface-high dark:border-[#1C2D25] flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}">
            <span class="material-symbols-outlined text-base">${icon}</span>
          </div>
          <div class="flex-grow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-primary dark:text-white">${log.action}</span>
              <span class="text-[11px] font-mono text-text-muted dark:text-[#9BB0A5]">${log.time}</span>
            </div>
            <p class="text-xs text-text-muted dark:text-[#9BB0A5] mt-0.5">${log.detail}</p>
          </div>
        </div>
      `;
    }).join('');
  },

  // ==========================================
  // VIEW 5: GESTIONAR HORARIO INDIVIDUAL (AM / PM DIARIO)
  // ==========================================
  openEditSchedule(caddieId) {
    const data = DataService.loadData();
    const caddie = data.caddies.find(c => c.id === caddieId);
    if (!caddie) return;

    this.editingCaddieId = caddieId;
    
    // Clone availability and normalize any legacy values
    const currentAvail = caddie.weeklyAvailability || {};
    this.tempWeeklySchedule = {
      lunes: currentAvail.lunes === 'Trabaja' ? 'AM' : (currentAvail.lunes || 'AM'),
      martes: currentAvail.martes === 'Trabaja' ? 'AM' : (currentAvail.martes || 'AM'),
      miercoles: currentAvail.miercoles === 'Trabaja' ? 'AM' : (currentAvail.miercoles || 'AM'),
      jueves: currentAvail.jueves === 'Trabaja' ? 'AM' : (currentAvail.jueves || 'AM'),
      viernes: currentAvail.viernes === 'Trabaja' ? 'AM' : (currentAvail.viernes || 'AM'),
      sabado: currentAvail.sabado === 'Trabaja' ? 'AM' : (currentAvail.sabado || 'AM'),
      domingo: currentAvail.domingo === 'Trabaja' ? 'AM' : (currentAvail.domingo || 'Descanso')
    };

    const isTenis = caddie.sport === 'Tenis' || caddie.category === 'Tenis';
    const badgeText = isTenis ? 'Caddie de Tenis' : (caddie.categoryLabel || ('Caddie ' + caddie.category));

    document.getElementById('edit-caddie-name').innerText = caddie.name;
    document.getElementById('edit-caddie-doc').innerText = caddie.documentId;
    document.getElementById('edit-caddie-cat').innerText = badgeText;
    document.getElementById('edit-caddie-venue').innerText = caddie.venue || 'Llanogrande';
    document.getElementById('edit-foundation-notes').value = caddie.foundationNotes || '';

    this.renderWeeklyMatrix();
    this.updateEditSummaryStats();
    this.navigate('view-gestionar-horario');
  },

  renderWeeklyMatrix() {
    const matrix = document.getElementById('weekly-schedule-matrix');
    const days = [
      { key: 'lunes', label: 'Lunes' },
      { key: 'martes', label: 'Martes' },
      { key: 'miercoles', label: 'Miércoles' },
      { key: 'jueves', label: 'Jueves' },
      { key: 'viernes', label: 'Viernes' },
      { key: 'sabado', label: 'Sábado' },
      { key: 'domingo', label: 'Domingo' }
    ];

    matrix.innerHTML = days.map(d => {
      const currentVal = this.tempWeeklySchedule[d.key] || 'AM';

      const isAM = currentVal === 'AM' || currentVal === 'Trabaja';
      const isPM = currentVal === 'PM';
      const isStudy = currentVal === 'Estudia';
      const isRest = currentVal === 'Descanso';

      return `
        <div class="bg-surface-low dark:bg-[#0B1611] p-3.5 rounded-xl border border-surface-high dark:border-[#1C2D25] flex flex-col justify-between gap-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold text-primary dark:text-white">${d.label}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isAM ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
              isPM ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' :
              isStudy ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
              'bg-gray-100 dark:bg-[#1C2D25] text-gray-600 dark:text-gray-400'
            }">
              ${isAM ? '☀️ Mañana' : isPM ? '⛅ Tarde' : isStudy ? '🎓 Estudio' : '☕ Libre'}
            </span>
          </div>

          <div class="grid grid-cols-4 gap-1 bg-surface dark:bg-[#121F19] p-1 rounded-lg border border-surface-high dark:border-[#1C2D25] text-[11px] font-bold">
            <button 
              type="button" 
              onclick="App.setDaySchedule('${d.key}', 'AM')" 
              class="py-1.5 rounded-md text-center transition-all ${isAM ? 'bg-primary dark:bg-accent-leaf text-white dark:text-[#0A120E] shadow-sm font-extrabold' : 'text-text-muted dark:text-[#9BB0A5] hover:bg-emerald-50 dark:hover:bg-emerald-950/40'}"
              title="Turno Mañana (06:00 - 13:30)"
            >
              ☀️ AM
            </button>

            <button 
              type="button" 
              onclick="App.setDaySchedule('${d.key}', 'PM')" 
              class="py-1.5 rounded-md text-center transition-all ${isPM ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm font-extrabold' : 'text-text-muted dark:text-[#9BB0A5] hover:bg-blue-50 dark:hover:bg-blue-950/40'}"
              title="Turno Tarde (12:30 - 19:00)"
            >
              ⛅ PM
            </button>

            <button 
              type="button" 
              onclick="App.setDaySchedule('${d.key}', 'Estudia')" 
              class="py-1.5 rounded-md text-center transition-all ${isStudy ? 'bg-amber-400 text-amber-950 shadow-sm font-extrabold' : 'text-text-muted dark:text-[#9BB0A5] hover:bg-amber-50 dark:hover:bg-amber-950/40'}"
              title="Formación Académica Fundación"
            >
              🎓 Est.
            </button>

            <button 
              type="button" 
              onclick="App.setDaySchedule('${d.key}', 'Descanso')" 
              class="py-1.5 rounded-md text-center transition-all ${isRest ? 'bg-surface-high dark:bg-[#283F34] text-text-main dark:text-white shadow-sm font-extrabold' : 'text-text-muted dark:text-[#9BB0A5] hover:bg-surface-low dark:hover:bg-[#1C2D25]'}"
              title="Día de Descanso"
            >
              ☕ Off
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  setDaySchedule(dayKey, value) {
    this.tempWeeklySchedule[dayKey] = value;
    this.renderWeeklyMatrix();
    this.updateEditSummaryStats();
  },

  updateEditSummaryStats() {
    const container = document.getElementById('edit-summary-stats');
    if (!container) return;

    const values = Object.values(this.tempWeeklySchedule);
    const am = values.filter(v => v === 'AM' || v === 'Trabaja').length;
    const pm = values.filter(v => v === 'PM').length;
    const study = values.filter(v => v === 'Estudia').length;
    const rest = values.filter(v => v === 'Descanso').length;

    container.innerHTML = `
      <span class="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">☀️ ${am} AM</span>
      <span class="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">⛅ ${pm} PM</span>
      <span class="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">🎓 ${study} Estudia</span>
      <span class="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#1C2D25] text-gray-700 dark:text-gray-300 border border-surface-high dark:border-[#2D4439]">☕ ${rest} Descanso</span>
    `;
  },

  applySchedulePreset(presetType) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    if (presetType === 'all-am') {
      days.forEach(d => {
        if (this.tempWeeklySchedule[d] !== 'Estudia' && this.tempWeeklySchedule[d] !== 'Descanso') {
          this.tempWeeklySchedule[d] = 'AM';
        }
      });
      this.showToast('Turnos laborales cambiados a AM (Mañana)', 'info');
    } else if (presetType === 'all-pm') {
      days.forEach(d => {
        if (this.tempWeeklySchedule[d] !== 'Estudia' && this.tempWeeklySchedule[d] !== 'Descanso') {
          this.tempWeeklySchedule[d] = 'PM';
        }
      });
      this.showToast('Turnos laborales cambiados a PM (Tarde)', 'info');
    } else if (presetType === 'alternate') {
      let toggle = true;
      days.forEach(d => {
        if (this.tempWeeklySchedule[d] !== 'Estudia' && this.tempWeeklySchedule[d] !== 'Descanso') {
          this.tempWeeklySchedule[d] = toggle ? 'AM' : 'PM';
          toggle = !toggle;
        }
      });
      this.showToast('Turnos laborales alternados AM / PM', 'info');
    } else if (presetType === 'weekend-pm') {
      days.forEach(d => {
        if (this.tempWeeklySchedule[d] !== 'Estudia' && this.tempWeeklySchedule[d] !== 'Descanso') {
          if (d === 'sabado' || d === 'domingo') {
            this.tempWeeklySchedule[d] = 'PM';
          } else {
            this.tempWeeklySchedule[d] = 'AM';
          }
        }
      });
      this.showToast('Fines de semana fijados en PM', 'info');
    }

    this.renderWeeklyMatrix();
    this.updateEditSummaryStats();
  },

  saveCaddieSchedule() {
    if (!this.editingCaddieId) return;
    const data = DataService.loadData();
    const caddie = data.caddies.find(c => c.id === this.editingCaddieId);
    if (!caddie) return;

    caddie.weeklyAvailability = this.tempWeeklySchedule;
    caddie.foundationNotes = document.getElementById('edit-foundation-notes').value.trim();

    DataService.updateCaddie(caddie);
    DataService.addLog('Horario Actualizado', `Turnos AM/PM modificados para ${caddie.name}`, 'admin');

    this.showToast('¡Horarios AM/PM guardados exitosamente!', 'success');
    this.navigate('view-admin');
  },

  // Modal Open/Close helpers
  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
      m.classList.remove('hidden');
      m.classList.add('flex');
    }
  },

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
      m.classList.add('hidden');
      m.classList.remove('flex');
    }
  },

  openNewCaddieModal() {
    this.openModal('modal-new-caddie');
  },

  handleCreateCaddie(event) {
    event.preventDefault();
    const name = document.getElementById('new-caddie-name').value.trim();
    const doc = document.getElementById('new-caddie-doc').value.trim();
    const cat = document.getElementById('new-caddie-category').value;
    const venue = document.getElementById('new-caddie-venue').value;
    const phone = document.getElementById('new-caddie-phone').value.trim() || '+57 300 000 0000';
    const shiftPattern = document.getElementById('new-caddie-initial-shift').value;
    const notes = document.getElementById('new-caddie-notes').value.trim();

    const isTenis = (cat === 'Tenis');
    
    // Build initial weekly availability based on selected shift
    let initialAvail = {};
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    
    if (shiftPattern === 'AM') {
      initialAvail = { lunes: 'AM', martes: 'AM', miercoles: 'AM', jueves: 'AM', viernes: 'AM', sabado: 'AM', domingo: 'Descanso' };
    } else if (shiftPattern === 'PM') {
      initialAvail = { lunes: 'PM', martes: 'PM', miercoles: 'PM', jueves: 'PM', viernes: 'PM', sabado: 'PM', domingo: 'Descanso' };
    } else {
      initialAvail = { lunes: 'AM', martes: 'PM', miercoles: 'AM', jueves: 'PM', viernes: 'AM', sabado: 'PM', domingo: 'Descanso' };
    }

    const newCaddie = {
      id: doc,
      documentId: doc,
      name,
      sport: isTenis ? 'Tenis' : 'Golf',
      category: cat,
      categoryLabel: isTenis ? 'Caddie de Tenis' : ('Caddie ' + cat),
      venue,
      experience: '1 año',
      phone,
      weeklyAvailability: initialAvail,
      foundationNotes: notes
    };

    DataService.addCaddie(newCaddie);
    this.closeModal('modal-new-caddie');
    this.showToast(`¡Caddie ${name} registrado con éxito!`, 'success');
    this.renderAdminDashboard();
    this.renderDemoChips();
  },

  resetDemoData() {
    DataService.resetData();
    this.showToast('Datos demo restablecidos', 'info');
    this.renderAdminDashboard();
    this.renderDemoChips();
  },

  // ==========================================
  // TOAST SYSTEM
  // ==========================================
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    if (type === 'error') icon = 'error';

    toast.innerHTML = `
      <span class="material-symbols-outlined text-lg ${type === 'success' ? 'text-accent-leaf' : type === 'error' ? 'text-rose-400' : 'text-blue-400'}">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
};

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
