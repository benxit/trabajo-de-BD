
// models/Producto.js
const mongoose = require('mongoose');

// Categorías permitidas para productos
// Centralizado aquí para fácil mantenimiento
const CATEGORIAS_PERMITIDAS = [
  'Computación',
  'Periféricos',
  'Componentes',
  'Accesorios'
];

// Schema principal: Producto
const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type:      String,
      required:  [true, 'El nombre del producto es requerido'],
      trim:      true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },

    descripcion: {
      type:    String,
      trim:    true,
      default: ''
    },

    precio: {
      type:     Number,
      required: [true, 'El precio es requerido'],
      min:      [0, 'El precio no puede ser negativo']
    },

    stock: {
      type:     Number,
      required: [true, 'El stock es requerido'],
      min:      [0, 'El stock no puede ser negativo'],
      default:  0
    },

    categoria: {
      type:     String,
      required: [true, 'La categoría es requerida'],
      enum: {
        values:  CATEGORIAS_PERMITIDAS,
        message: 'Categoría no válida. Opciones: ' + CATEGORIAS_PERMITIDAS.join(', ')
      }
    }
  },
  {
    timestamps: true,
    collection: 'productos'
  }
);

// Exportar categorías también para usarlas en el frontend
productoSchema.statics.CATEGORIAS = CATEGORIAS_PERMITIDAS;

module.exports = mongoose.model('Producto', productoSchema);
