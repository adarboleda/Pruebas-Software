import { Pedido } from '../models/pedido.js';
import { Producto } from '../models/producto.js';

// Función  para calcular el total del pedido
const calcularTotalPedido = async (productos) => {
  let total = 0;

  for (const item of productos) {
    // Buscar el producto por ID para obtener su precio
    const producto = await Producto.findById(item.productoId);

    if (!producto) {
      throw new Error(`Producto con ID ${item.productoId} no encontrado`);
    }

    // Verificar que hay suficiente stock
    if (producto.stock < item.cantidad) {
      throw new Error(
        `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`
      );
    }

    // Calcular subtotal: precio * cantidad
    total += producto.precio * item.cantidad;
  }

  return total;
};

// Crear un nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { cliente, productos } = req.body;

    // Validar que se envió la información necesaria
    if (!cliente || !productos || productos.length === 0) {
      return res.status(400).json({
        error: 'Debe proporcionar el nombre del cliente y al menos un producto',
      });
    }

    // Calcular el total automáticamente
    const total = await calcularTotalPedido(productos);

    // Crear el pedido con el total calculado
    const nuevoPedido = await Pedido.create({
      cliente,
      productos,
      total,
    });

    // Actualizar el stock de los productos
    for (const item of productos) {
      await Producto.findByIdAndUpdate(
        item.productoId,
        { $inc: { stock: -item.cantidad } } // Decrementar el stock
      );
    }

    // Obtener el pedido con los datos de productos poblados
    const pedidoCompleto = await Pedido.findById(nuevoPedido._id).populate(
      'productos.productoId'
    );

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: pedidoCompleto,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Obtener todos los pedidos
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('productos.productoId');
    res.status(200).json({
      success: true,
      cantidad: pedidos.length,
      data: pedidos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Obtener un pedido por ID
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate(
      'productos.productoId'
    );
    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      data: pedido,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Actualizar un pedido por ID
export const actualizarPedido = async (req, res) => {
  try {
    const { productos, cliente } = req.body;

    // Si se actualizan los productos, recalcular el total
    let datosActualizacion = { ...req.body };

    if (productos && productos.length > 0) {
      const total = await calcularTotalPedido(productos);
      datosActualizacion.total = total;
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      datosActualizacion,
      {
        new: true,
        runValidators: true,
      }
    ).populate('productos.productoId');

    if (!pedidoActualizado) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pedido actualizado exitosamente',
      data: pedidoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Eliminar un pedido por ID
export const eliminarPedido = async (req, res) => {
  try {
    const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedidoEliminado) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Pedido eliminado exitosamente',
      data: pedidoEliminado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
