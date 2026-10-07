const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { crearTurno } = require('../controllers/reservaController');

// Ruta protegida para crear turno
router.post('/', auth, crearTurno);

module.exports = router;
