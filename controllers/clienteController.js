
const Cliente = require('../models/Cliente');

// GET /api/clientes
// Retorna todos los clientes ordenados por nombre
const obtenerTodos = async (req, res, next) => {
  try {
    const clientes = await Cliente
      .find()
      .sort({ nombre: 1 });          // orden alfabético ascendente

    // Respuesta JSON con la lista de clientes

    res.status(200).json({  
      ok:     true,
      total:  clientes.length,
      datos:  clientes
    });

  } catch (error) {
    next(error);                     // pasa el error al middleware errorHandler
  }
};


// GET /api/clientes/:id
// Retorna un cliente por su ID de MongoDB

const obtenerPorId = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un cliente con ID: ${req.params.id}`
      });
    }

    res.status(200).json({ ok: true, datos: cliente });

  } catch (error) {
    next(error);
  }
};


// POST /api/clientes
// Crea un nuevo cliente con los datos del body

const crear = async (req, res, next) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const guardado     = await nuevoCliente.save();

    res.status(201).json({
      ok:      true,
      mensaje: 'Cliente creado exitosamente',
      datos:   guardado
    });

  } catch (error) {
    // Error de email duplicado (código 11000 = índice único)
    if (error.code === 11000) {
      return res.status(400).json({
        ok:      false,
        mensaje: 'Ya existe un cliente con ese email'
      });
    }
    next(error);
  }
};


// PUT /api/clientes/:id
// Actualiza los campos enviados en el body para un cliente

const actualizar = async (req, res, next) => {
  try {
    const actualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new:            true,    // retorna el documento ya actualizado
        runValidators:  true     // ejecuta las validaciones del schema
      }
    );

    if (!actualizado) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un cliente con ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      ok:      true,
      mensaje: 'Cliente actualizado exitosamente',
      datos:   actualizado
    });

  } catch (error) {
    next(error);
  }
};


// DELETE /api/clientes/:id
// Elimina permanentemente un cliente por su ID

const eliminar = async (req, res, next) => {
  try {
    const eliminado = await Cliente.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({
        ok:      false,
        mensaje: `No se encontró un cliente con ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      ok:      true,
      mensaje: 'Cliente eliminado exitosamente',
      datos:   eliminado
    });

  } catch (error) {
    next(error);
  }
};


// Exportar todos los métodos del controlador

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
