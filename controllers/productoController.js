// ============================================================
//  ComercioTech — Controlador de Productos
//  Archivo: controllers/productoController.js
//
//  Responsabilidad:
//    - Lógica de negocio para operaciones CRUD de productos
//    - Interactuar con el modelo Producto
//    - Retornar respuestas JSON estructuradas
//
//  Métodos exportados:
//    obtenerTodos   → GET    /api/productos
//    obtenerPorId   → GET    /api/productos/:id
//    crear          → POST   /api/productos
//    actualizar     → PUT    /api/productos/:id
//    eliminar       → DELETE /api/productos/:id
// ============================================================

const Producto = require('../models/Producto');

// ------------------------------------------------------------
// GET /api/productos
// Retorna todos los productos ordenados por categoría y nombre
// ------------------------------------------------------------
const obtenerTodos = async (req, res, next) => {
  try {
    const productos = await Producto
      .find()
      .sort({ categoria: 1, nombre: 1 });

    res.status(200).json({
      ok:    true,
      total: productos.length,
      datos: productos
    });

  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------------
// GET /api/productos/:id
// Retorna un producto por su ID de MongoDB
// ------------------------------------------------------------
const obtenerPorId = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un producto con ID: ${req.params.id}`
      });
    }

    res.status(200).json({ ok: true, datos: producto });

  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------------
// POST /api/productos
// Crea un nuevo producto con los datos del body
// ------------------------------------------------------------
const crear = async (req, res, next) => {
  try {
    const nuevoProducto = new Producto(req.body);
    const guardado      = await nuevoProducto.save();

    res.status(201).json({
      ok:      true,
      mensaje: 'Producto creado exitosamente',
      datos:   guardado
    });

  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------------
// PUT /api/productos/:id
// Actualiza precio, stock u otros campos de un producto
// ------------------------------------------------------------
const actualizar = async (req, res, next) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!actualizado) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un producto con ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      ok:      true,
      mensaje: 'Producto actualizado exitosamente',
      datos:   actualizado
    });

  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------------
// DELETE /api/productos/:id
// Elimina permanentemente un producto por su ID
// ------------------------------------------------------------
const eliminar = async (req, res, next) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un producto con ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      ok:      true,
      mensaje: 'Producto eliminado exitosamente',
      datos:   eliminado
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
