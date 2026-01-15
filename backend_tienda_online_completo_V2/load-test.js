import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de carga
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Rampa de 0 a 10 usuarios en 30 segundos
    { duration: '1m', target: 20 }, // Incrementa a 20 usuarios en 1 minuto
    { duration: '30s', target: 0 }, // Reduce a 0 usuarios en 30 segundos
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% de las peticiones deben ser < 1 segundo
    http_req_failed: ['rate<0.1'], // Menos del 10% de fallos
  },
};

const BASE_URL = 'http://localhost:3000/api';

// Función que se ejecuta por cada usuario virtual en cada iteración
export default function () {
  // Generar datos únicos usando el número de VU e iteración
  const vu = __VU; // Número de usuario virtual
  const iter = __ITER; // Número de iteración
  const timestamp = Date.now();

  // Usuario único para este VU e iteración
  const username = `user_${vu}_${iter}_${timestamp}`;
  const email = `user${vu}_${iter}_${timestamp}@test.com`;
  const password = `pass${vu}${iter}`;

  // 1. REGISTRO DE USUARIO
  const registerPayload = JSON.stringify({
    username: username,
    email: email,
    password: password,
  });

  const registerHeaders = { 'Content-Type': 'application/json' };

  const registerRes = http.post(`${BASE_URL}/auth/register`, registerPayload, {
    headers: registerHeaders,
  });

  check(registerRes, {
    'Registro exitoso (status 201)': (r) => r.status === 201,
    'Registro retorna token': (r) => r.json('token') !== undefined,
  });

  // 2. LOGIN
  const loginPayload = JSON.stringify({
    username: username,
    password: password,
  });

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: registerHeaders,
  });

  const loginSuccess = check(loginRes, {
    'Login exitoso (status 200)': (r) => r.status === 200,
    'Login retorna token': (r) => r.json('token') !== undefined,
  });

  let token = '';
  if (loginSuccess) {
    token = loginRes.json('token');
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 3. OBTENER TODOS LOS PRODUCTOS
  const getProductsRes = http.get(`${BASE_URL}/products`);

  check(getProductsRes, {
    'Obtener productos (status 200)': (r) => r.status === 200,
    'Productos retorna array': (r) => Array.isArray(r.json()),
  });

  // 4. CREAR UN PRODUCTO (requiere autenticación)
  const productPayload = JSON.stringify({
    name: `Producto ${vu}_${iter}`,
    price: Math.floor(Math.random() * 1000) + 10,
    description: `Descripción del producto ${vu}_${iter}`,
    stock: Math.floor(Math.random() * 100) + 1,
  });

  const createProductRes = http.post(`${BASE_URL}/products`, productPayload, {
    headers: authHeaders,
  });

  const productCreated = check(createProductRes, {
    'Crear producto (status 201)': (r) => r.status === 201,
    'Producto creado tiene ID': (r) => r.json('_id') !== undefined,
  });

  let productId = '';
  if (productCreated) {
    productId = createProductRes.json('_id');
  }

  // 5. OBTENER UN PRODUCTO POR ID
  if (productId) {
    const getProductRes = http.get(`${BASE_URL}/products/${productId}`);

    check(getProductRes, {
      'Obtener producto por ID (status 200)': (r) => r.status === 200,
      'Producto tiene nombre': (r) => r.json('name') !== undefined,
    });

    // 6. ACTUALIZAR EL PRODUCTO
    const updatePayload = JSON.stringify({
      name: `Producto Actualizado ${vu}_${iter}`,
      price: Math.floor(Math.random() * 2000) + 50,
      description: `Descripción actualizada ${vu}_${iter}`,
      stock: Math.floor(Math.random() * 150) + 10,
    });

    const updateProductRes = http.put(
      `${BASE_URL}/products/${productId}`,
      updatePayload,
      { headers: authHeaders }
    );

    check(updateProductRes, {
      'Actualizar producto (status 200)': (r) => r.status === 200,
    });
  }

  // 7. CREAR UNA ORDEN
  if (productId) {
    const orderPayload = JSON.stringify({
      items: [
        {
          productId: productId,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 1000) + 10,
        },
      ],
      total: Math.floor(Math.random() * 5000) + 100,
    });

    const createOrderRes = http.post(`${BASE_URL}/orders`, orderPayload, {
      headers: authHeaders,
    });

    check(createOrderRes, {
      'Crear orden (status 201)': (r) => r.status === 201,
      'Orden tiene ID': (r) => r.json('_id') !== undefined,
    });
  }

  // 8. OBTENER TODAS LAS ÓRDENES
  const getOrdersRes = http.get(`${BASE_URL}/orders`, { headers: authHeaders });

  check(getOrdersRes, {
    'Obtener órdenes (status 200)': (r) => r.status === 200,
    'Órdenes retorna array': (r) => Array.isArray(r.json()),
  });

  // 9. ELIMINAR EL PRODUCTO
  if (productId) {
    const deleteProductRes = http.del(
      `${BASE_URL}/products/${productId}`,
      null,
      { headers: authHeaders }
    );

    check(deleteProductRes, {
      'Eliminar producto (status 200)': (r) => r.status === 200,
    });
  }

  // Esperar 1 segundo antes de repetir (simula comportamiento realista)
  sleep(1);
}
