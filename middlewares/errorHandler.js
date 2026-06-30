
const errorHandler = (err, req, res, next) => {

  // Mostrar error en consola del servidor 
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);

 
  // Error de validación de Mongoose


  // Ocurre cuando un campo requerido falta o tiene formato incorrecto
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      ok:      false,
      tipo:    'Error de validación',
      errores: mensajes
    });
  }

 
  // Error de ID inválido (CastError)
  // Ocurre cuando el :id en la URL no es un ObjectId válido de MongoDB
 
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      ok:      false,
      tipo:    'ID inválido',
      mensaje: `El ID '${err.value}' no tiene el formato correcto`
    });
  }

 
  // Error de duplicado (índice único)
  // Código 11000 = violación de restricción unique en MongoDB
 
  if (err.code === 11000) { // error de duplicado
    const campo = Object.keys(err.keyValue)[0]; // obtiene el nombre del campo duplicado
    return res.status(400).json({ // error de duplicado
      ok:      false,
      tipo:    'Valor duplicado',
      mensaje: `Ya existe un registro con ese valor en el campo '${campo}'` // mensaje de error
    });
  }

 

  // Cualquier otro error no clasificado
  res.status(500).json({
    ok:      false,
    tipo:    'Error interno del servidor',
    mensaje: err.message || 'Ocurrió un error inesperado'
  });
};

module.exports = errorHandler; // Exporta el middleware para usarlo en app.js
