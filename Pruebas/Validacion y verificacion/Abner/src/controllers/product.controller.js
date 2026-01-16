// Simulación de una base de datos en memoria
let products = [];

/**
 * Devuelve todos los productos
 */
function getAllProducts(req, res) {
  res.json(products);
}

/**
 * Crea un nuevo producto (name, precio)
 */
function createProduct(req, res) {
  const { name, precio } = req.body;

  // Validación básica
  if (!name || typeof precio !== 'number') {
    return res.status(400).json({ message: 'Name and precio are required' });
  }

  const newProduct = {
    id: Date.now().toString(),
    name,
    precio,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
}

/**
 * Obtiene un producto por id
 */
function getProductById(req, res) {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json(product);
}

/**
 * Actualiza un producto por id
 */
function updateProduct(req, res) {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const { name, precio } = req.body;
  if (typeof precio !== 'undefined' && typeof precio !== 'number') {
    return res.status(400).json({ message: 'Precio debe ser un número' });
  }

  if (name) products[index].name = name;
  if (typeof precio !== 'undefined') products[index].precio = precio;

  res.json(products[index]);
}

/**
 * Elimina un producto por id
 */
function deleteProduct(req, res) {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
}

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
