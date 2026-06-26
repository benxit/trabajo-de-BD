// ============================================================
//  ComercioTech — Rutas de Clientes
//  Archivo: routes/clientes.js
//
//  Responsabilidad:
//    - Definir los endpoints HTTP para la entidad Cliente
//    - Conectar cada ruta con su método del controlador
//    - Este archivo NO contiene lógica de negocio
//
//  Prefijo registrado en server.js: /api/clientes
//
//  Endpoints expuestos:
//    GET    /api/clientes         → obtener todos los clientes
//    GET    /api/clientes/:id     → obtener un cliente por ID
//    POST   /api/clientes         → crear un nuevo cliente
//    PUT    /api/clientes/:id     → actualizar un cliente
//    DELETE /api/clientes/:id     → eliminar un cliente
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/clienteController');

// Rutas de colección (sin ID)
router
  .route('/')
  .get(controller.obtenerTodos)   // GET  /api/clientes
  .post(controller.crear);        // POST /api/clientes

// Rutas de recurso individual (con ID)
router
  .route('/:id')
  .get(controller.obtenerPorId)   // GET    /api/clientes/:id
  .put(controller.actualizar)     // PUT    /api/clientes/:id
  .delete(controller.eliminar);   // DELETE /api/clientes/:id

module.exports = router;
