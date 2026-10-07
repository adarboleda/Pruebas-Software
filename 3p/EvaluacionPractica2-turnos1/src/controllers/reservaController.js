const Turno = require('../models/Turno');

// Crear nuevo turno médico
exports.crearTurno = async (req, res) => {
  try {
    const turno = new Turno({ ...req.body, userId: req.user.id });
    await turno.save();
    res.status(201).json({ msg: 'Turno creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
