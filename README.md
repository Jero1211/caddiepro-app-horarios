# CaddiePro | Plataforma de Asignación y Gestión de Turnos

> **Proyecto Práctico & Académico:** Desarrollo Full-Stack / Gestión de Becarios  
> **Institución Colaboradora:** Fundación Club Campestre de Medellín y Llanogrande  
> **Desarrollado por:** Jero — Estudiante de 6.º semestre de Ingeniería de Software  

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald?style=flat-square&logo=mongodb)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![Estado](https://img.shields.io/badge/Estado-Completado%20%2F%20Funcional-blue?style=flat-square)

---

## 📋 Descripción General

**CaddiePro** es una aplicación web Full-Stack desarrollada para resolver una necesidad operativa real: la gestión, asignación de turnos y control de asistencia de los caddies y becarios vinculados a la **Fundación Club Campestre de Medellín y Llanogrande**.

Durante mi formación universitaria en Ingeniería de Software, desarrollé este sistema combinando investigación autodidacta y asistencia de herramientas de Inteligencia Artificial para acelerar la estructuración de la API REST, la manipulación de archivos Excel complejos y la generación automatizada de reportes en PDF.

---

## ✨ Características Principales

- **Gestión de Personal & Becarios:** Registro, actualización y consulta de perfiles de caddies con disponibilidad horaria y estados activos.
- **Importación Automatizada de Excel:** Módulo extractor con la librería `xlsx` que lee planillas reales de turnos (`DIAS DE ACOMPAÑAMIENTOS BECARIOS.xlsx`) y sincroniza los datos directamente con MongoDB.
- **Generación de Reportes PDF:** Motor con `puppeteer-core` que genera resúmenes impresos y planillas de control listas para archivo administrativo.
- **API REST Modular:** Endpoints organizados por controladores y rutas (`/api/caddies`, `/api/logs`) con validaciones de esquemas en Mongoose.
- **Pruebas de API con Postman:** Incluye archivo `caddiepro_postman_collection.json` con todos los endpoints listos para pruebas directas.
- **Dashboard Web Integrado:** Interfaz gráfica limpia en JavaScript moderno (sin frameworks pesados innecesarios) para interactuar fluidamente con el servidor.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Base de Datos** | MongoDB, Mongoose ODM |
| **Procesamiento de Archivos** | SheetJS (`xlsx`) para Excel, Puppeteer para PDF |
| **Frontend** | HTML5 Semántico, CSS3, JavaScript Vanilla (ES6+) |
| **Herramientas de Test** | Postman Collection, scripts de prueba en Node |

---

## 📁 Estructura del Repositorio

```text
├── backend/
│   ├── config/             # Configuración de conexión a MongoDB
│   ├── controllers/        # Controladores de lógica de negocio (caddies, logs)
│   ├── models/             # Esquemas Mongoose (Caddie.js, ActivityLog.js)
│   ├── routes/             # Definición de rutas API REST
│   ├── services/           # Servicios auxiliares (excelImporter.js)
│   ├── generate_pdf.js     # Script generador de reportes PDF
│   ├── server.js           # Punto de entrada del servidor Express
│   └── package.json        # Dependencias del backend
├── app.js                  # Lógica del cliente web
├── index.html              # Interfaz de usuario (Dashboard)
├── styles.css              # Estilos visuales del frontend
├── caddiepro_postman_collection.json  # Pruebas de API
├── package.json            # Scripts de ejecución raíz
└── README.md               # Documentación del proyecto
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
