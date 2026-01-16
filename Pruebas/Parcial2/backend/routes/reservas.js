const express = require('express');
const Reserva = require('../models/Reserva');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protege todas las rutas siguientes con autenticación
router.use(authMiddleware);

// Listar todas las reservas del usuario autenticado
router.get('/', async (req, res) => {
  const reservas = await Reserva.find({ usuario: req.userId });
  res.json(reservas);
});

// Crear nueva reserva
router.post('/', async (req, res) => {
  const { fecha, sala, hora } = req.body;

  const formato12Horas = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  if (!hora || !formato12Horas.test(hora)) {
    return res.status(400).json({
      msg: 'Formato de hora inválido. Debe usar formato de 12 horas con AM/PM (ej. "03:30 PM")',
    });
  }

  if (fecha) {
    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.getDay();
    if (diaSemana === 0) {
      return res.status(400).json({
        msg: 'No se permiten reservas los domingos',
      });
    }
  }

  if (!sala || !['A', 'B', 'C'].includes(sala)) {
    return res.status(400).json({ msg: 'Sala inválida' });
  }

  const nueva = new Reserva({
    usuario: req.userId,
    fecha,
    sala,
    hora,
  });

  await nueva.save();
  res.status(201).json(nueva);
});

// Eliminar una reserva (solo si pertenece al usuario)
router.delete('/:id', async (req, res) => {
  const result = await Reserva.deleteOne({
    _id: req.params.id,
    usuario: req.userId,
  });
  await Reserva.deleteOne({ _id: req.params.id, usuario: req.userId });

  //si no se elimino ninguna reserva, significa que no existia o no pertenecia al usuario
  if (result.deletedCount === 0) {
    return res
      .status(404)
      .json({ msg: 'Reserva no encontrada o no autorizada' });
  }
  res.json({ msg: 'Reserva cancelada' });
});

module.exports = router;
