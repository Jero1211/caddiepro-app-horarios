# CaddiePro - Seguimiento 2: Backend y Base de Datos (MongoDB)
**Fundación Club Campestre de Medellín y Llanogrande**  
**Materia:** Desarrollo Web — Entrega de Seguimiento 2 (10%)

---

## 📌 Resumen del Proyecto y lo Implementado

Se ha diseñado e implementado el **Backend completo con arquitectura REST API** conectado a **MongoDB** y alimentado automáticamente con el archivo Excel real **`DIAS DE ACOMPAÑAMIENTOS BECARIOS.xlsx`** (72 caddies y sus disponibilidades/estudios).

### 🛠️ Stack Tecnológico
* **Entorno:** Node.js v24 + Express 5
* **Base de Datos:** MongoDB local (`mongodb://127.0.0.1:27017/caddiepro_db`)
* **ORM / ODM:** Mongoose con esquemas tipados y validaciones
* **Procesamiento de Datos:** Biblioteca `xlsx` (SheetJS) para lectura e importación masiva del Excel
* **Pruebas de API:** Colección exportada para **Postman v2.1.0**

---

## 🗄️ Estructura de la Base de Datos en MongoDB

### 1. Colección `caddies`
Almacena la ficha completa del becario, su disponibilidad semanal, días de estudio y notas de la fundación:
```json
{
  "_id": "ObjectId('68bfa1...fe3')",
  "documentId": "1011512703",
  "name": "ANA BELEN GONZALEZ GOMEZ",
  "sport": "Híbrido",
  "category": "HIBRIDO - TERCERA",
  "categoryLabel": "Caddie HIBRIDO - TERCERA",
  "venue": "Medellín",
  "phone": "+57 312 987 6543",
  "scheduleProofUrl": "https://fundacionclubcampestre1.sharepoint.com/...",
  "weeklyAvailability": {
    "lunes": "DISPONIBLE",
    "martes": "ASISTE TENIS",
    "miercoles": "ASISTE TENIS",
    "jueves": "ASISTE TENIS",
    "viernes": "Descanso",
    "sabado": "AM",
    "domingo": "PM"
  },
  "dateAssignments": {
    "SAB 25 ABRIL": "ASISTE TENIS",
    "DOM 26 ABRIL": "DISPONIBLE"
  },
  "foundationNotes": "Becario Fundación Club Campestre. Cédula: 1011512703.",
  "active": true,
  "createdAt": "2026-10-06T13:31:00.000Z",
  "updatedAt": "2026-10-06T13:31:00.000Z"
}
```

### 2. Colección `activitylogs`
Bitácora de auditoría para registrar cada creación, actualización, eliminación o importación:
```json
{
  "_id": "ObjectId('68bfa2...ae1')",
  "action": "Disponibilidad / Estudio Actualizado",
  "detail": "Se actualizaron los turnos y horarios de estudio para ANA BELEN GONZALEZ",
  "type": "horario",
  "time": "08:30 AM",
  "createdAt": "2026-10-06T13:31:00.000Z"
}
```

---

## 🚀 Cómo Iniciar el Backend

### Paso 1: Asegurar que MongoDB esté en ejecución
Si tienes el servicio de MongoDB instalado en Windows:
```powershell
# En una terminal como Administrador (o abriendo MongoDB Compass)
net start MongoDB
```
*O iniciando el ejecutable directamente con tu carpeta de base de datos:*
```powershell
& "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "backend\data\db" --port 27017
```

### Paso 2: Iniciar el servidor Express
Entra a la carpeta `backend` e inicia el servidor:
```powershell
cd backend
npm start
```
*(O `npm run dev` para modo desarrollo con recarga automática).*

Verás en consola:
```text
[MongoDB] Conectado exitosamente a la base de datos: caddiepro_db en 127.0.0.1
[Auto-Seed] ¡Éxito! Se importaron 72 caddies a MongoDB.
🚀 CaddiePro Backend Servidor Corriendo en http://localhost:5000
```

---

## 📮 Cómo Usar la Colección de Postman

1. Abre **Postman**.
2. Haz clic en el botón superior izquierdo **"Import"**.
3. Arrastra o selecciona el archivo:  
   📁 `caddiepro_postman_collection.json` (ubicado en la raíz de tu proyecto).
4. Tendrás lista la carpeta **`CaddiePro Backend API - Seguimiento 2 (MongoDB)`** con todas las peticiones organizadas:

### Endpoints Disponibles en la Colección:

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnóstico del servidor y conexión en vivo a MongoDB |
| `GET` | `/api/caddies/stats` | Conteo total de caddies por deporte y por sede |
| `POST` | `/api/caddies/seed-excel` | Repoblar/sincronizar la base de datos desde el archivo Excel |
| `GET` | `/api/caddies` | Listar todos los caddies de MongoDB |
| `GET` | `/api/caddies?sport=Golf` | Filtrar caddies por deporte (`Golf`, `Tenis`, `Híbrido`) |
| `GET` | `/api/caddies?venue=Medellín` | Filtrar caddies por sede (`Medellín`, `Llanogrande`) |
| `GET` | `/api/caddies?search=GONZALEZ` | Búsqueda por nombre o cédula |
| `GET` | `/api/caddies/:cedula` | Consultar detalle de un caddie por su número de cédula |
| `POST` | `/api/caddies` | Registrar un nuevo caddie con sus datos y horarios |
| `PUT` | `/api/caddies/:cedula` | Actualizar información general del caddie |
| `PUT` | `/api/caddies/:cedula/availability` | Actualizar turnos de acompañamiento y días de estudio |
| `DELETE` | `/api/caddies/:cedula` | Eliminar un caddie de MongoDB |
| `GET` | `/api/logs` | Consultar bitácora de auditoría y cambios en tiempo real |
| `POST` | `/api/logs` | Crear registro de auditoría manual |

---

## 🧪 Script de Pruebas Automatizadas

También puedes ejecutar todas las pruebas de endpoints directamente desde la consola con:
```powershell
cd backend
node test_api.js
```
El script realiza 9 pruebas completas (CRUD, filtros, validaciones y conexión MongoDB) mostrando el resultado en verde.
