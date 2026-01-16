// Arreglo en memoria
let users = [];

//Respuesta de Error
function errorResponse(status, message, path) {
  return {
    timestamp: new Date().toISOString(),
    status,
    message,
    path,
  };
}

//Obtener todos los usuarios almacenados
function getAllUsers(req, res) {
  res.json(users);
}

//Crear un nuevo usuario
function createUser(req, res) {
  const { name, email } = req.body;
  // Validación de email obligatorio
  if (!email) {
    return res.status(400).json(errorResponse(400, 'Email es requerido', req.originalUrl));
  }
  // Validación de que el nombre no puede ser un número y es obligatorio
  if (!name || !isNaN(name)) {
    return res.status(400).json(errorResponse(400, 'Nombre es requerido y no puede ser un numero', req.originalUrl));
  }
  // Validación de email debe ser único
  const emailExists = users.find((u) => u.email === email);
  if (emailExists) {
    return res.status(409).json(errorResponse(409, 'Email ya existe', req.originalUrl));
  }
  // Crear usuario
  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
}

//Obtener un usuario por ID
function getUserById(req, res) {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json(errorResponse(404, 'Usuario no encontrado', req.originalUrl));
  }
  res.json(user);
}

//Eliminar un usuario por ID
function deleteUser(req, res) {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json(errorResponse(404, 'Usuario no encontrado', req.originalUrl));
  }
  const deleted = users.splice(index, 1);
  res.json(deleted[0]);
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
};
