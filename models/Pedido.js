

const mongoose = require('mongoose');

// Estados válidos de un pedido (en orden de flujo)
// 
const ESTADOS_PEDIDO = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];


// Sub-schema: Detalle de línea del pedido
// Cada ítem representa un producto con cantidad y precio

const detalleSchema = new mongoose.Schema(
  {
    producto_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Producto',                        // referencia al modelo Producto
      required: [true, 'El producto es requerido']
    },

    cantidad: {
      type:     Number,
      required: [true, 'La cantidad es requerida'],
      min:      [1, 'La cantidad mínima es 1']
    },

    precio_unitario: {
      type:     Number,
      required: [true, 'El precio unitario es requerido'],
      min:      [0, 'El precio no puede ser negativo']
    }
  },
  { _id: false }
);

// Schema principal: Pedido

const pedidoSchema = new mongoose.Schema(
  {
    cliente_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Cliente',                         // referencia al modelo Cliente
      required: [true, 'El cliente es requerido']
    },

    fecha_pedido: {
      type:    Date,
      default: Date.now
    },

    estado: {
      type:    String,
      enum: {
        values:  ESTADOS_PEDIDO,
        message: 'Estado no válido. Opciones: ' + ESTADOS_PEDIDO.join(', ')
      },
      default: 'Pendiente'
    },

    total: {
      type:     Number,
      required: [true, 'El total es requerido'],
      min:      [0, 'El total no puede ser negativo']
    },

    detalles: {
      type:     [detalleSchema],
      default:  []
    }
  },
  {
    timestamps: true,
    collection: 'pedidos'
  }
);

// 
// Exportar estados también para usarlos en el frontend
//
pedidoSchema.statics.ESTADOS = ESTADOS_PEDIDO;

module.exports = mongoose.model('Pedido', pedidoSchema);
