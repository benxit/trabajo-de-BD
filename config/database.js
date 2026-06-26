// ============================================================
//  ComercioTech — Configuración de base de datos
//  Archivo: config/database.js
//
//  Responsabilidad:
//    - Establecer la conexión con MongoDB usando Mongoose
//    - Manejar eventos de conexión (éxito, error, desconexión)
//    - Exportar la función de conexión para usarla en server.js
// ============================================================

const mongoose = require('mongoose');

// ------------------------------------------------------------
// Opciones de conexión de Mongoose
// ------------------------------------------------------------
const opcionesConexion = {
  serverSelectionTimeoutMS: 5000,   // tiempo máximo buscando servidor MongoDB
  socketTimeoutMS:          45000,  // tiempo máximo de inactividad del socket
};

// ------------------------------------------------------------
// Función principal de conexión
// Se llama una sola vez al iniciar el servidor
// ------------------------------------------------------------
const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI, opcionesConexion);

    console.log(`  MongoDB conectado: ${conexion.connection.host}`);
    console.log(`  Base de datos:     ${conexion.connection.name}`);

  } catch (error) {
    console.error('  ERROR: No se pudo conectar a MongoDB');
    console.error(`  Detalle: ${error.message}`);
    console.error('  Verifica que el servicio MongoDB esté activo.');
    process.exit(1); // Detiene el servidor si no hay conexión
  }
};

// ------------------------------------------------------------
// Eventos de Mongoose para monitorear la conexión
// ------------------------------------------------------------
mongoose.connection.on('disconnected', () => {
  console.warn('  AVISO: MongoDB desconectado. Intentando reconectar...');
});

mongoose.connection.on('reconnected', () => {
  console.log('  MongoDB reconectado exitosamente.');
});

module.exports = conectarDB;
