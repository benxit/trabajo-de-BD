// ============================================================
//  ComercioTech — Rutas de Productos
//  Archivo: routes/productos.js
//
//  Responsabilidad:
//    - Definir los endpoints HTTP para la entidad Producto
//    - Conectar cada ruta con su método del controlador
//
//  Prefijo registrado en server.js: /api/productos
//
//  Endpoints expuestos:
//    GET    /api/productos         → obtener todos los productos
//    GET    /api/productos/:id     → obtener un producto por ID
//    POST   /api/productos         → crear un nuevo producto
//    PUT    /api/productos/:id     → actualizar un producto
//    DELETE /api/productos/:id     → eliminar un producto
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/productoController');

// Rutas de colección
router
  .route('/')
  .get(controller.obtenerTodos)
  .post(controller.crear);

// Rutas de recurso individual
router
  .route('/:id')
  .get(controller.obtenerPorId)
  .put(controller.actualizar)
  .delete(controller.eliminar);

module.exports = router;
