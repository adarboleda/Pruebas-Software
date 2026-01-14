const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta get para simular una respuesta sencilla
app.get('/api/hello', (req, res) => {
  setTimeout(() => {
    res.json({ message: '¡Hola, mundo!' });
  }, Math.random() * 500); // Simula un retraso de 0 a 500 ms
});

// Ruta post para recibir datos y responder con los datos recibidos
app.post('/api/data', (req, res) => {
  const data = req.body;
  setTimeout(() => {
    res.json({ received: data });
  }, Math.random() * 500); // Simula un retraso de 0 a 500 ms
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
