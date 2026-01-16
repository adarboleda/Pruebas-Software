const express = require('express');
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const router = express.Router();

// Ruta GET para obtener todos los productos
router.get('/', getAllProducts);

// Ruta POST para crear un nuevo producto
router.post('/', createProduct);

// Obtener un producto por id
router.get('/:id', getProductById);

// Actualizar un producto por id
router.put('/:id', updateProduct);

// Eliminar un producto por id
router.delete('/:id', deleteProduct);

module.exports = router;
