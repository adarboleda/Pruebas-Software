const Order = require('../models/Order');

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener las órdenes', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { items } = req.body;

    // Validar cada item
    for (const item of items) {
      if (
        !item.productId ||
        item.quantity === undefined ||
        item.price === undefined
      ) {
        return res.status(400).json({
          message: 'Cada item debe tener productId, quantity y price',
        });
      }
      if (item.quantity <= 0) {
        return res.status(400).json({
          message: 'La cantidad debe ser mayor a 0',
        });
      }
      if (item.price < 0) {
        return res.status(400).json({
          message: 'El precio no puede ser negativo',
        });
      }
    }

    // Calcular el total
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({ items, total });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al crear la orden', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ message: 'Orden no encontrada' });
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar la orden', error: error.message });
  }
};
