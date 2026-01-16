// Pruebas unitarias para examen - Abner Arboleda
const request = require('supertest');
const app = require('../src/app');

describe('User API - Abner Arboleda', () => {
  const baseUrl = '/api/abnerarboleda/users';

  // Crear usuario válido
  test('POST - should create a valid user - Abner Arboleda', async () => {
    const newUser = {
      name: 'Abner Arboleda',
      email: 'abnerarboleda@ejemplo.com',
    };
    const res = await request(app).post(baseUrl).send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Abner Arboleda');
    expect(res.body.email).toBe('abnerarboleda@ejemplo.com');
  });

  // Error por datos inválidos (email vacío)
  test('POST - should return 400 if email is missing', async () => {
    const res = await request(app).post(baseUrl).send({ name: 'Test' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status', 400);
    expect(res.body).toHaveProperty('message', 'Email es requerido');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('path');
  });

  // Error por nombre inválido (número)
  test('POST - should return 400 if name is a number', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({ name: '123', email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status', 400);
    expect(res.body).toHaveProperty('message');
  });

  // Error por email duplicado (409)
  test('POST - should return 409 if email already exists', async () => {
    const user = { name: 'Usuario Uno', email: 'duplicado@test.com' };
    await request(app).post(baseUrl).send(user);
    const res = await request(app).post(baseUrl).send(user);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('status', 409);
    expect(res.body).toHaveProperty('message', 'Email ya existe');
  });

  // Listado de usuarios
  test('GET - should return list of users - Abner Arboleda', async () => {
    const res = await request(app).get(baseUrl);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Obtener usuario por ID
  test('GET/:id - should return user by ID - Abner Arboleda', async () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@example.com',
    };
    const createRes = await request(app).post(baseUrl).send(newUser);
    const userId = createRes.body.id;

    const res = await request(app).get(`${baseUrl}/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body.name).toBe('Test User');
  });

  // Error al obtener usuario inexistente
  test('GET/:id - should return 404 for non-existent user', async () => {
    const res = await request(app).get(`${baseUrl}/10`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', 404);
    expect(res.body).toHaveProperty('message', 'Usuario no encontrado');
  });

  // Eliminar usuario y verificar que ya no existe
  test('DELETE/:id - should delete user - Abner Arboleda', async () => {
    const newUser = {
      name: 'Abner Arboledaa',
      email: 'adarboleda@example.com',
    };
    const createRes = await request(app).post(baseUrl).send(newUser);
    const userId = createRes.body.id;

    const deleteRes = await request(app).delete(`${baseUrl}/${userId}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty('id', userId);

    const getRes = await request(app).get(`${baseUrl}/${userId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
