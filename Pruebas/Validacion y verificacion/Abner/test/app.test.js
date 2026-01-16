// pruebas unitarias para la gestión de productos
const request = require('supertest');
const app = require('../src/app');

describe('Product API', () => {
  test('GET /api/products - should return an empty list initially', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/products - should create a new product', async () => {
    const newProduct = { name: 'Leche', precio: 3.5 };
    const res = await request(app)
      .post('/api/products')
      .send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Leche');
    expect(res.body.precio).toBe(3.5);
  });

  test('POST /api/products - should fail if data is incomplete', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Sólo nombre' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name and precio are required');
  });

  test('GET /api/products/:id - should return 404 for non existing id', async () => {
    const res = await request(app).get('/api/products/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Producto no encontrado');
  });

  test('Full CRUD flow: POST -> GET by id -> PUT -> DELETE', async () => {
    // Create
    const newProduct = { name: 'Pan', precio: 1.2 };
    const postRes = await request(app)
      .post('/api/products')
      .send(newProduct);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body).toHaveProperty('id');
    const id = postRes.body.id;

    // Get by id
    const getRes = await request(app).get(`/api/products/${id}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty('id', id);
    expect(getRes.body.name).toBe('Pan');

    // Update name and precio
    const putRes = await request(app)
      .put(`/api/products/${id}`)
      .send({ name: 'Pan integral', precio: 1.5 });
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body).toHaveProperty('name', 'Pan integral');
    expect(putRes.body).toHaveProperty('precio', 1.5);

    // Update with invalid precio type
    const putBad = await request(app)
      .put(`/api/products/${id}`)
      .send({ precio: 'no-num' });
    expect(putBad.statusCode).toBe(400);
    expect(putBad.body).toHaveProperty('message', 'Precio debe ser un número');

    // Delete
    const delRes = await request(app).delete(`/api/products/${id}`);
    expect(delRes.statusCode).toBe(200);
    expect(delRes.body).toHaveProperty('id', id);

    // Ensure deleted
    const getAfterDel = await request(app).get(`/api/products/${id}`);
    expect(getAfterDel.statusCode).toBe(404);
  });
});
