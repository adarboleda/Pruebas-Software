import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración con stages - Cambiar target según la prueba: 30, 50, 70, 90
export let options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp-up: subir a 30 VUs en 10s
    { duration: '30s', target: 30 }, // Mantener 30 VUs por 30s
    { duration: '10s', target: 0 }, // Ramp-down: bajar a 0 en 10s
  ],

  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:3000';

// Función principal que cada usuario virtual ejecutará
export default function () {
  // Generar un correo único usando el nombre Abner y un timestamp + VU ID
  const uniqueEmail = `abnerarboleda.${__VU}.${Date.now()}@espe.edu.ec`;
  const password = 'Password123!';

  // ==========================================
  // 1. REGISTRO DE USUARIO
  // ==========================================
  const registerPayload = JSON.stringify({
    email: uniqueEmail,
    password: password,
  });

  const registerParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const registerRes = http.post(
    `${BASE_URL}/api/auth/register`,
    registerPayload,
    registerParams,
  );

  // Verificar que el registro fue exitoso (201) o que el usuario ya existe (400/409)
  check(registerRes, {
    'registro exitoso o duplicado': (r) =>
      r.status === 201 || r.status === 400 || r.status === 409,
  });

  // Pequeña pausa entre operaciones
  sleep(0.5);

  // ==========================================
  // 2. LOGIN DE USUARIO
  // ==========================================
  const loginPayload = JSON.stringify({
    email: uniqueEmail,
    password: password,
  });

  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    loginPayload,
    loginParams,
  );

  // Verificar que el login fue exitoso
  check(loginRes, {
    'login exitoso': (r) => r.status === 200,
    'token presente': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.token !== undefined && body.token !== null;
      } catch (e) {
        return false;
      }
    },
  });

  // Extraer el token de autenticación
  let token = '';
  try {
    const loginBody = JSON.parse(loginRes.body);
    token = loginBody.token;
  } catch (e) {
    console.error('Error al parsear respuesta de login');
  }

  // Pausa entre operaciones
  sleep(0.5);

  // ==========================================
  // 3. CREAR RESERVA DE SALA
  // ==========================================
  if (token) {
    // Generar una fecha y hora para la reserva (usando el nombre Abner en los datos)
    const fecha = '2026-02-15'; // Fecha futura
    const hora = `${10 + (__VU % 8)}:00`; // Horas entre 10:00 y 17:00
    const sala = `Sala-${(__VU % 10) + 1}`; // Salas del 1 al 10

    const reservaPayload = JSON.stringify({
      fecha: fecha,
      hora: hora,
      sala: sala,
    });

    const reservaParams = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const reservaRes = http.post(
      `${BASE_URL}/api/reservas`,
      reservaPayload,
      reservaParams,
    );

    // Verificar que la reserva fue creada exitosamente
    check(reservaRes, {
      'reserva creada': (r) => r.status === 201 || r.status === 200,
    });
  }

  // Pausa final antes de repetir el ciclo
  sleep(1);
}
