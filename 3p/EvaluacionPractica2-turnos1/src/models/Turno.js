const mongoose = require('mongoose');

// Esquema para los turnos médicos
const turnoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fecha: String,
  especialidad: String,
  medico: String
});

// Exporta el modelo Turno
module.exports = mongoose.model('Turno', turnoSchema);
