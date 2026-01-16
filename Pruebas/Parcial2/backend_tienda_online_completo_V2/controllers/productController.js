const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al obtener los productos',
        error: error.message,
      });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener el producto', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || price === undefined || stock === undefined)
      return res
        .status(400)
        .json({ message: 'Nombre, precio y stock son obligatorios' });
    if (price < 0 || stock < 0)
      return res
        .status(400)
        .json({ message: 'El precio y stock no pueden ser negativos' });
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al crear el producto', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { price, stock } = req.body;
    if (price !== undefined && price < 0)
      return res
        .status(400)
        .json({ message: 'El precio no puede ser negativo' });
    if (stock !== undefined && stock < 0)
      return res
        .status(400)
        .json({ message: 'El stock no puede ser negativo' });

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product)
      return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al actualizar el producto',
        error: error.message,
      });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar el producto', error: error.message });
  }
};
