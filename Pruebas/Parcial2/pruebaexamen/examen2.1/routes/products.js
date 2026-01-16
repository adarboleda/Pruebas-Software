const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

// CRUD de productos
// GET /api/products - Obtener todos los productos (público)
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Obtener un producto por ID (público)
router.get('/:id', productController.getProductById);

// POST /api/products - Crear un nuevo producto (requiere autenticación)
router.post('/', auth, productController.createProduct);

// PUT /api/products/:id - Actualizar un producto (requiere autenticación)
router.put('/:id', auth, productController.updateProduct);

// DELETE /api/products/:id - Eliminar un producto (requiere autenticación)
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
