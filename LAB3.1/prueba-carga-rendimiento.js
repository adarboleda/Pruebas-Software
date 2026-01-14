import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 10 }, // Subir a 10 usuarios en 10 segundos
    { duration: '30s', target: 50 }, // Mantener 50 usuarios por 30 segundos
    { duration: '10s', target: 0 }, // Bajar a 0 usuarios en 10 segundos
  ],

  thresholds: {
    http_req_duration: ['p(95)<500'], // El 95% de las solicitudes deben completarse en menos de 500ms
    http_req_failed: ['rate<0.01'], // Menos del 1% de las solicitudes deben fallar
  },
};

export default function () {
  // Prueba de la ruta GET
  const res = http.get('http://localhost:3000/api/hello');
  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo de respuesta es menos de 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1); // Esperar 1 segundo entre solicitudes
}
