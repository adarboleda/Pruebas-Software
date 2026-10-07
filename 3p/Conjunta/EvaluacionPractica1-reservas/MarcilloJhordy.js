import http from "k6/http"
import {sleep, check} from 'k6'

const test = __ENV.TEST;

export let options = {
    stages: [
        {duration: '5s', target: 20},
        {duration: '20s', target: 90 },
        {duration: '5s', target: 0}
    ],

    thresholds:{
        http_req_duration: ['p(95)<8000'],
        http_req_failed: ['rate<0.50'],
        http_reqs: ['count > 100'],
    }
};

function generarCorreoUnico() {
  return `user${__VU}_${__ITER}@test.com`;
}

export default function(){
    const token = autenticarUsuario()
    const email = generarCorreoUnico()
    const password = '12345'

    let resRegister = http.post('http://localhost:3000/api/auth/register', JSON.stringify({
        email: email,
        password: password
    }),{
        headers: { 'Content-Type': 'application/json' }
    })

    check(resRegister, {
      'registro exitoso': (res) => res.status === 201
    });

    let resLogin = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
        email: email,
        password: password
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

  check(resLogin, {
    'login exitoso': (res) => res.status === 200 && res.json('token') !== undefined,
    'token presente': (res) => !!res.json('token')
  });

  sleep(1);

  let resReserva = http.post('http://localhost:3000/api/reservas', JSON.stringify({
        fecha: "2025-08-26",
        sala: "A",
        hora: "13:22 PM"
    }), {
        headers: { 'Content-Type': 'application/json' },
        Authorization: `Bearer ${token}`
    });

    check(resReserva, {
        'Reserva creada con éxito': (res) => res.status === 200
    });

    sleep(1);
}

function autenticarUsuario(){
    const email = generarCorreoUnico()
    const password = '12345'

    http.post('http://localhost:3000/api/auth/register', JSON.stringify({
        email: email,
        password: password
    }),{
        headers: { 'Content-Type': 'application/json' }
    })

    const resLogin = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
        email,
        password: password
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    return resLogin.json('token')
} 