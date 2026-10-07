const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (_req, res) => {
  res.send('Integracion continua trabajando!');
});

app.listen(PORT, () => {
  console.log(`Servidor trabajando en el puerto http://localhost:${PORT}`);
});
