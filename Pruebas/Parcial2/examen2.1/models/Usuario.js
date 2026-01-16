const mongoose = require('mongoose');

// Define el esquema del usuario
const usuarioSchema = new mongoose.Schema({
  username: String, // Email del usuario
  password: String, // Contraseña encriptada
});

// Exporta el modelo Usuario
module.exports = mongoose.model('Usuario', usuarioSchema);
