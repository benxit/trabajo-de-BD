

const mongoose = require('mongoose');


// Sub-schema: Dirección
// Definido por separado para mayor claridad y reutilización
 
const direccionSchema = new mongoose.Schema(
  {
    calle:  { type: String, required: [true, 'La calle es requerida'] },
    ciudad: { type: String, required: [true, 'La ciudad es requerida'] },
    pais:   { type: String, required: [true, 'El país es requerido'],  default: 'Chile' }
  },
  { _id: false } // No genera _id para el subdocumento
);

//
// Schema principal: Cliente
// 
const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type:     String,
      required: [true, 'El nombre es requerido'],
      trim:     true,              // elimina espacios al inicio/fin
      minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },

    email: {
      type:     String,
      required: [true, 'El email es requerido'],
      unique:   true,              // no permite emails duplicados
      lowercase: true,             // convierte a minúsculas automáticamente
      trim:     true,
      match:    [/^.+@.+\..+$/, 'El email ingresado no es válido']
    },

    telefono: {
      type:     String,
      required: [true, 'El teléfono es requerido'],
      trim:     true
    },

    direccion: {
      type:     direccionSchema,
      required: [true, 'La dirección es requerida']
    },

    fecha_registro: {
      type:    Date,
      default: Date.now          // se asigna automáticamente al crear
    }
  },
  {
    // Agrega createdAt y updatedAt automáticamente
    timestamps: true,
    // Nombre explícito de la colección en MongoDB
    collection: 'clientes'
  }
);

// ------------------------------------------------------------
// Exportar el modelo
// El primer argumento es el nombre del modelo en Mongoose
// ------------------------------------------------------------
module.exports = mongoose.model('Cliente', clienteSchema);
