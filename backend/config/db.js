const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caddiepro_db');
    console.log(`[MongoDB] Conectado exitosamente a la base de datos: ${conn.connection.name} en ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Error al conectar a la base de datos: ${error.message}`);
    console.error('Verifica que el servicio de MongoDB esté iniciado en tu máquina (puerto 27017).');
    process.exit(1);
  }
};

module.exports = connectDB;
