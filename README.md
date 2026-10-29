# CaddiePro | Plataforma de Asignación y Gestión de Turnos

> **Proyecto Práctico & Académico:** Desarrollo Full-Stack / Prototipo Móvil  
> **Institución Colaboradora:** Fundación Club Campestre de Medellín y Llanogrande  
> **Integrantes:** Jerónimo Mesa & Juan Miguel Duarte  
> **Docente Evaluador:** Neider Xavier Vergara Humanez  

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald?style=flat-square&logo=mongodb)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![Capacitor](https://img.shields.io/badge/Capacitor-Mobile_Ready-blue?style=flat-square&logo=capacitor)
![Estado](https://img.shields.io/badge/Estado-Incremento_2_Completado-blue?style=flat-square)

---

## 📋 Descripción General

**CaddiePro** es una aplicación Full-Stack desarrollada para resolver una necesidad operativa real: la gestión, asignación de turnos y control de asistencia de los caddies y becarios vinculados a la **Fundación Club Campestre de Medellín y Llanogrande**.

En este **Segundo Incremento (Examen 2)**, el sistema integra capacidades nativas móviles (**Geolocalización GPS** para comprobación en sede con fórmula de Haversine, **Cámara** para evidencia fotográfica con marca de agua digital, **Detección de Conectividad Network** y soporte **Offline-First**), interfaz mobile-first con barra inferior fija y persistencia local inmediata.

---

## ✨ Características Principales

- **Gestión de Personal & Becarios:** Registro, actualización y consulta de perfiles de caddies con disponibilidad horaria (AM/PM) y días de formación en Fundación.
- **Check-in Móvil con Geolocalización (GPS):** Comprobación en sitio de presencia física en sedes Medellín y Llanogrande mediante cálculo geodésico y manejo de permisos.
- **Evidencia Fotográfica con Cámara:** Módulo de captura en vivo con visor de encuadre y marca de agua digital automática con sello de tiempo y coordenadas.
- **Soporte Offline-First:** Monitoreo reactivo de conectividad (`online`/`offline`) con persistencia local garantizada tras reinicios o cierres de la app.
- **Importación Automatizada de Excel:** Módulo extractor con la librería `xlsx` que sincroniza datos de `DIAS DE ACOMPAÑAMIENTOS BECARIOS.xlsx` con MongoDB.
- **Generación de Reportes PDF:** Motor con `puppeteer-core` para compilar informes técnicos y planillas listas para archivo institucional.
- **API REST Modular:** Endpoints organizados por controladores y rutas (`/api/caddies`, `/api/logs`) con validaciones de esquemas en Mongoose.
- **Dashboard Web & Móvil Integrado:** Interfaz gráfica limpia, responsiva, con modo oscuro/claro y navegación táctil inferior.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Base de Datos** | MongoDB, Mongoose ODM |
| **Capacidades Móviles** | Geolocation API (Haversine), MediaDevices Camera API, Network API, Haptics |
| **Persistencia Local** | LocalStorage / Capacitor Preferences API (Offline-First) |
| **Procesamiento de Archivos** | SheetJS (`xlsx`) para Excel, Puppeteer para PDF |
| **Frontend** | HTML5 Semántico, CSS3 Vanilla / Tailwind, JavaScript ES6+ (Mobile-First) |
| **Móvil / PWA** | Web App Manifest, Capacitor Config para Android WebView |

---

## 📁 Estructura del Repositorio

```text
├── entregas/               # Informes académicos oficiales y evidencias del proyecto
│   ├── Examen2_CaddiePro_Prototipo_Movil.pdf # Informe Técnico Oficial Examen 2 (PDF)
│   ├── informe_examen2.html                  # Código fuente del informe
│   ├── evidencias_incremento_2/              # Pantallazos ordenados de demostración
│   ├── Examen1_CaddiePro_Entrega1.pdf        # Documento oficial Entrega 1
│   └── Guion_Sustentacion_Seguimiento_2.pdf  # Guion oficial Seguimiento 2
├── backend/
│   ├── config/             # Configuración de conexión a MongoDB
│   ├── controllers/        # Controladores de lógica de negocio (caddies, logs)
│   ├── models/             # Esquemas Mongoose (Caddie.js, ActivityLog.js)
│   ├── routes/             # Definición de rutas API REST
│   ├── services/           # Servicios auxiliares (excelImporter.js)
│   ├── generate_informe2_pdf.js # Generador de PDF de Examen 2
│   ├── server.js           # Punto de entrada del servidor Express
│   └── package.json        # Dependencias del backend
├── app.js                  # Lógica del cliente, router, GPS, cámara y estado
├── index.html              # Interfaz de usuario (Dashboard y vistas móviles)
├── styles.css              # Estilos visuales del frontend y navegación táctil
├── capacitor.config.json   # Configuración de compilación nativa en Android
├── manifest.json           # Manifiesto PWA para instalación móvil
├── serve_frontend.js       # Servidor web local para el cliente
├── caddiepro_postman_collection.json  # Pruebas de API
├── package.json            # Scripts de ejecución raíz
└── README.md               # Documentación general del proyecto
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js** (v18 o superior)
- **MongoDB** (instancia local o URI de MongoDB Atlas)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jero1211/caddiepro-app-horarios.git
cd caddiepro-app-horarios
```

### 2. Instalar dependencias
```bash
# Instalar dependencias del backend
cd backend
npm install
cd ..
```

### 3. Configurar variables de entorno
Crea un archivo `.env` dentro de la carpeta `backend/` con las siguientes variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/caddiepro
```

### 4. Iniciar el servidor
```bash
# Modo desarrollo (con recarga automática)
npm run dev

# O directamente desde la carpeta backend:
cd backend
npm run dev
```

El servidor quedará disponible en `http://localhost:5000` y el cliente frontend puede abrirse directamente en el navegador mediante `index.html`.

---

## 👨‍💻 Autor

- **Jero** — Estudiante de 6.º semestre de Ingeniería de Software (UniLasallista).
- **GitHub:** [@Jero1211](https://github.com/Jero1211)
- **Portafolio:** [Ver Portafolio Profesional](https://github.com/Jero1211)
