const User = require('../models/User');
const Product = require('../models/Product');

// Obtener carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ cart: user.cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener el carrito', error: error.message });
  }
};

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: 'productId y quantity son obligatorios' });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: 'La cantidad debe ser mayor a 0' });
    }

    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar stock disponible
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      // Actualizar cantidad
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Agregar nuevo item
      user.cart.push({
        productId: productId,
        quantity: quantity,
        price: product.price,
      });
    }

    await user.save();
    res.json({ message: 'Producto agregado al carrito', cart: user.cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al agregar al carrito', error: error.message });
  }
};

// Actualizar cantidad de un producto en el carrito
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: 'productId y quantity son obligatorios' });
    }

    if (quantity < 0) {
      return res
        .status(400)
        .json({ message: 'La cantidad no puede ser negativa' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado en el carrito' });
    }

    if (quantity === 0) {
      // Eliminar el item del carrito
      user.cart.splice(itemIndex, 1);
    } else {
      // Actualizar cantidad
      user.cart[itemIndex].quantity = quantity;
    }

    await user.save();
    res.json({ message: 'Carrito actualizado', cart: user.cart });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al actualizar el carrito',
        error: error.message,
      });
  }
};

// Eliminar producto del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.cart = user.cart.filter((item) => item.productId !== productId);

    await user.save();
    res.json({ message: 'Producto eliminado del carrito', cart: user.cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar del carrito', error: error.message });
  }
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.cart = [];
    await user.save();
    res.json({ message: 'Carrito vaciado', cart: user.cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al vaciar el carrito', error: error.message });
  }
};
