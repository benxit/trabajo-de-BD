// ============================================================
//  ComercioTech — Rutas de Pedidos
//  Archivo: routes/pedidos.js
//
//  Responsabilidad:
//    - Definir los endpoints HTTP para la entidad Pedido
//    - Conectar cada ruta con su método del controlador
//
//  Prefijo registrado en server.js: /api/pedidos
//
//  Endpoints expuestos:
//    GET    /api/pedidos         → obtener todos los pedidos
//    GET    /api/pedidos/:id     → obtener un pedido por ID
//    POST   /api/pedidos         → crear un nuevo pedido
//    PUT    /api/pedidos/:id     → actualizar un pedido
//    DELETE /api/pedidos/:id     → eliminar un pedido
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/pedidoController');

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
