

const Pedido = require('../models/Pedido');


// GET /api/pedidos
// Retorna todos los pedidos con datos del cliente y productos
// populate() resuelve las referencias ObjectId a documentos reales

const obtenerTodos = async (req, res, next) => {
  try {
    const pedidos = await Pedido
      .find()
      .populate('cliente_id', 'nombre email telefono')        // trae solo estos campos del cliente
      .populate('detalles.producto_id', 'nombre precio categoria') // trae estos campos del producto
      .sort({ fecha_pedido: -1 });                            // más recientes primero

    res.status(200).json({
      ok:    true,
      total: pedidos.length,
      datos: pedidos
    });

  } catch (error) {
    next(error);
  }
};


// GET /api/pedidos/:id
// Retorna un pedido específico con sus referencias resueltas

const obtenerPorId = async (req, res, next) => {
  try {
    const pedido = await Pedido
      .findById(req.params.id)
      .populate('cliente_id', 'nombre email telefono')
      .populate('detalles.producto_id', 'nombre precio categoria');

    if (!pedido) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un pedido con ID: ${req.params.id}`
      });
    }

    res.status(200).json({ ok: true, datos: pedido });

  } catch (error) {
    next(error);
  }
};


// POST /api/pedidos
// Crea un nuevo pedido vinculado a un cliente y productos

const crear = async (req, res, next) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    const guardado    = await nuevoPedido.save();

    // Retorna el pedido con referencias resueltas
    const conReferencias = await Pedido
      .findById(guardado._id)
      .populate('cliente_id', 'nombre email')
      .populate('detalles.producto_id', 'nombre precio');

    res.status(201).json({
      ok:      true,
      mensaje: 'Pedido creado exitosamente',
      datos:   conReferencias
    });

  } catch (error) {
    next(error);
  }
};


// PUT /api/pedidos/:id
// Actualiza estado u otros campos de un pedido existente

const actualizar = async (req, res, next) => {
  try {
    const actualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('cliente_id', 'nombre email')
    .populate('detalles.producto_id', 'nombre precio');

    if (!actualizado) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un pedido con ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      ok:      true,
      mensaje: 'Pedido actualizado exitosamente',
      datos:   actualizado
    });

  } catch (error) {
    next(error);
  }
};


// DELETE /api/pedidos/:id
// Elimina permanentemente un pedido por su ID

const eliminar = async (req, res, next) => {
  try {
    const eliminado = await Pedido.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un pedido con ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      ok:      true,
      mensaje: 'Pedido eliminado exitosamente',
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
