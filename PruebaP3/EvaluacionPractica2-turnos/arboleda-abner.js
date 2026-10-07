import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración con stages
export let options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 200 },
    { duration: '10s', target: 0 },
  ],

  thresholds: {
    http_req_duration: ['p(95)<15000'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const uniqueEmail = `abnerarboleda.${__VU}.${Date.now()}@espe.edu.ec`;
  const password = 'abner123';

  //Resgistro de usuario
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

  // Verificar que el registro fue exitoso o que el usuario ya existe
  check(registerRes, {
    'registro exitoso o duplicado': (r) =>
      r.status === 201 || r.status === 400 || r.status === 409,
  });

  sleep(0.5);

  //Login de usuario
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

  // Extraer el token
  let token = '';
  try {
    const loginBody = JSON.parse(loginRes.body);
    token = loginBody.token;
  } catch (e) {
    console.error('Error al parsear respuesta de login');
  }

  sleep(0.5);

  //Crear turno medico
  if (token) {
    // Generar una fecha y datos para el turno
    const fecha = '2026-02-01';
    const especialidades = [
      'Cardiología',
      'Pediatría',
      'Traumatología',
      'Oftalmología',
      'Dermatología',
    ];
    const medicos = [
      'Dr. Abner Arboleda',
      'Dr. Abner D Arboleda',
      'Dr. David Arboleda',
      'Dra. Abner Roman',
      'Dr. Abner D Roman',
    ];

    const especialidad = especialidades[__VU % especialidades.length];
    const medico = medicos[__VU % medicos.length];

    const turnoPayload = JSON.stringify({
      fecha: fecha,
      especialidad: especialidad,
      medico: medico,
    });

    const turnoParams = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const turnoRes = http.post(
      `${BASE_URL}/api/reservas`,
      turnoPayload,
      turnoParams,
    );

    // Verificar que el turno fue creado exitosamente
    check(turnoRes, {
      'turno creado': (r) => r.status === 201 || r.status === 200,
    });
  }

  sleep(1);
}
