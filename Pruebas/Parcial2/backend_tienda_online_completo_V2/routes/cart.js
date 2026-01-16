const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, ctrl.getCart);
router.post('/', auth, ctrl.addToCart);
router.put('/', auth, ctrl.updateCartItem);
router.delete('/:productId', auth, ctrl.removeFromCart);
router.delete('/', auth, ctrl.clearCart);

module.exports = router;
