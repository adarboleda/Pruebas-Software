const express = require('express'); // Framework para construir servidores web
const mongoose = require('mongoose'); // ODM para MongoDB
const cors = require('cors'); // Permite el acceso desde otros orígenes
const authRoutes = require('./routes/auth'); // Rutas de autenticación
const productRoutes = require('./routes/products'); // Rutas de productos
const orderRoutes = require('./routes/orders'); // Rutas de pedidos
require('dotenv').config(); // Carga variables de entorno desde .env

const app = express();
app.use(cors()); // Habilita CORS
app.use(express.json()); // Permite parsear cuerpos JSON

// Enrutamiento
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error capturado:', err);
  res.status(err.status || 500).json({
    msg: err.message || 'Error del servidor',
    error: err.message,
  });
});

// Conexión a MongoDB y levantamiento del servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
  })
  .catch((err) => console.error(err));
