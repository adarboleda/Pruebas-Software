// Simulación de una base de datos en memoria
let users = [];

/**
 * Devuelve todos los usuarios almacenados
 */
function getAllUsers(req, res) {
  res.json(users);
}

/**
 * Crea un nuevo usuario si se proveen name y email válidos
 */
function createUser(req, res) {
  const { name, email } = req.body;

  // Validación básica de entrada
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  // Creamos un objeto usuario
  const newUser = {
    id: Date.now(), // ID simulado
    name,
    email,
  };

  // Lo añadimos al arreglo de usuarios
  users.push(newUser);

  // Respondemos con el usuario creado
  res.status(201).json(newUser);
}

module.exports = { getAllUsers, createUser };
