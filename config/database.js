
const mongoose = require('mongoose');

// Opciones de conexión de Mongoose

const opcionesConexion = {
  serverSelectionTimeoutMS: 5000,   // tiempo máximo buscando servidor MongoDB
  socketTimeoutMS:          45000,  // tiempo máximo de inactividad del socket
};


// Función principal de conexión
// Se llama una sola vez al iniciar el servidor

const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI, opcionesConexion); // Conexión a MongoDB usando la URI del archivo .env

    console.log(`  MongoDB conectado: ${conexion.connection.host}`); // Muestra el host de la conexión
    console.log(`  Base de datos:     ${conexion.connection.name}`); // Muestra el nombre de la base de datos

  } catch (error) {
    console.error('  ERROR: No se pudo conectar a MongoDB'); // Mensaje de error si la conexión falla
    console.error(`  Detalle: ${error.message}`); // Muestra el mensaje de error específico
    console.error('  Verifica que el servicio MongoDB esté activo.'); // Mensaje de sugerencia para el usuario
    process.exit(1); // Detiene el servidor si no hay conexión
  }
};


// Eventos de Mongoose para monitorear la conexión

mongoose.connection.on('disconnected', () => {
  console.warn('  AVISO: MongoDB desconectado. Intentando reconectar...');
});

mongoose.connection.on('reconnected', () => {
  console.log('  MongoDB reconectado exitosamente.');
});

module.exports = conectarDB;
