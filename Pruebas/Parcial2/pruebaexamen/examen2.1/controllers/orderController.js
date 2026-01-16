const Order = require('../models/Order');
const Product = require('../models/Product');

// Crear un nuevo pedido
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: 'Debe incluir al menos un producto' });
    }

    // Calcular el total
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Producto ${item.product} no encontrado` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Stock insuficiente para ${product.name}` });
      }
      total += item.price * item.quantity;
      //total += item.price;
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      total,
    });

    // Actualizar stock de productos
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const orderComplete = await Order.findById(newOrder._id)
      .populate('user', 'nombre email')
      .populate('items.product');

    res.status(201).json(orderComplete);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los pedidos
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'nombre email')
      .populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pedidos del usuario autenticado
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('user', 'nombre email')
      .populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'nombre email')
      .populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
