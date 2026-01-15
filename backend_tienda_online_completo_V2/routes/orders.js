const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.create);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;