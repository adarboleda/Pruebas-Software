const Order = require('../models/Order');

exports.getAll = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

exports.create = async (req, res) => {
  try {
    const { items, products } = req.body;

    // Aceptar tanto 'items' como 'products' para compatibilidad
    const orderItems = items || products;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'Se requieren items o products' });
    }

    // LÍNEA CLAVE PARA REGRESIÓN
    const total = orderItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    const order = new Order({ items: orderItems, total });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al crear orden', error: error.message });
  }
};

exports.delete = async (req, res) => {
  const result = await Order.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Orden eliminada' });
};
