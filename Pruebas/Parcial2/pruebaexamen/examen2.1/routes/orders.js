const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// Todas las rutas de pedidos requieren autenticación

// POST /api/orders - Crear un nuevo pedido
router.post('/', auth, orderController.createOrder);

// GET /api/orders - Obtener todos los pedidos del usuario autenticado
router.get('/', auth, orderController.getUserOrders);

// GET /api/orders/all - Obtener todos los pedidos (para admin/testing)
router.get('/all', auth, orderController.getAllOrders);

// GET /api/orders/:id - Obtener un pedido específico
router.get('/:id', auth, orderController.getOrderById);

module.exports = router;
