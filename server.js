// ============================================================
//  ComercioTech — Punto de entrada del servidor
//  Archivo: server.js
//
//  Responsabilidad:
//    - Cargar variables de entorno
//    - Conectar a MongoDB
//    - Configurar Express y middlewares globales
//    - Registrar rutas de la API
//    - Iniciar el servidor HTTP
// ============================================================

require('dotenv').config();                        // Carga .env antes que todo

const express       = require('express');
const path          = require('path');
const cors          = require('cors');
const conectarDB    = require('./config/database'); // Módulo de conexión
const errorHandler  = require('./middlewares/errorHandler');

// Rutas de la API
const clientesRouter  = require('./routes/clientes');
const productosRouter = require('./routes/productos');
const pedidosRouter   = require('./routes/pedidos');

// ------------------------------------------------------------
// Inicializar Express
// ------------------------------------------------------------
const app  = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------
// Conectar a MongoDB (función asíncrona en config/database.js)
// ------------------------------------------------------------
conectarDB();

// ------------------------------------------------------------
// Middlewares globales
//   cors()           → permite peticiones desde el navegador
//   express.json()   → parsea body en formato JSON
//   express.static() → sirve archivos estáticos (HTML/CSS/JS)
// ------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------
// Registro de rutas de la API REST
//   Prefijo /api/... para separar la API del frontend
// ------------------------------------------------------------
app.use('/api/clientes',  clientesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/pedidos',   pedidosRouter);

// ------------------------------------------------------------
// Ruta raíz → sirve el panel web (index.html)
// ------------------------------------------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------------------------------------
// Middleware de manejo de errores (debe ir al final)
// ------------------------------------------------------------
app.use(errorHandler);

// ------------------------------------------------------------
// Iniciar servidor
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log('================================================');
  console.log('  ComercioTech — Servidor iniciado');
  console.log('================================================');
  console.log(`  URL local:  http://localhost:${PORT}`);
  console.log(`  Entorno:    ${process.env.NODE_ENV || 'desarrollo'}`);
  console.log('------------------------------------------------');
  console.log('  Rutas disponibles:');
  console.log('    GET | POST            /api/clientes');
  console.log('    GET | PUT | DELETE    /api/clientes/:id');
  console.log('    GET | POST            /api/productos');
  console.log('    GET | PUT | DELETE    /api/productos/:id');
  console.log('    GET | POST            /api/pedidos');
  console.log('    GET | PUT | DELETE    /api/pedidos/:id');
  console.log('================================================');
});
