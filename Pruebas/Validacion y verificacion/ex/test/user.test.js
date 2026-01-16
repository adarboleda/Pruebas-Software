// creacion de pruebas unitarias para la gestion de usuarios
const request = require("supertest");
const app = require("../src/app");

describe("User API", () => {
  // Prueba que Get de usuarios devuelve una lista vacia inicialmente
  test("GET /api/users - should return an empty list initially", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
  // Prueba que POST de usuario crea un nuevo usuario
  test("POST /api/users - should create a new user", async () => {
    const newUser = {
      name: "Abner",
      email: "abnerarboleda@ejemplo.com",
    };
    const res = await request(app).post("/api/users").send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Abner");
    expect(res.body.email).toBe("abnerarboleda@ejemplo.com");
  });
  //Prueba que el endpoint rechace las peticiones invalidas
  test("POST /api/users - should fail if data is incomplete", async () => {
    const res = await request(app).post("/api/users").send({ name: "Abner" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Name and email are required");
  });
});
