# Pruebas de Carga con K6 - Sistema de Reservas

**Estudiante:** Abner Arboleda  
**Examen:** Unidad 3 - Pruebas de Rendimiento

## Preparación

### 1. Asegurarse de que el servidor esté corriendo

```bash
npm start
```

El servidor debe estar disponible en `http://localhost:3000`

### 2. Verificar que k6 esté instalado

```bash
k6 version
```

## Ejecución de Pruebas

### Prueba 1: 30 Usuarios Virtuales por 30 segundos

Editar `arboleda-abner.js` líneas 6-8:

```javascript
stages: [
    { duration: '10s', target: 30 },
    { duration: '30s', target: 30 },
    { duration: '10s', target: 0 }
],
```

Ejecutar:

```bash
k6 run arboleda-abner.js
```

### Prueba 2: 50 Usuarios Virtuales por 30 segundos

Editar el archivo `arboleda-abner.js` y cambiar las líneas 6-8:

```javascript
stages: [
    { duration: '10s', target: 50 },
    { duration: '30s', target: 50 },
    { duration: '10s', target: 0 }
],
```

Luego ejecutar:

```bash
k6 run arboleda-abner.js
```

### Prueba 3: 70 Usuarios Virtuales por 30 segundos

Editar el archivo `arboleda-abner.js` y cambiar las líneas 6-8:

```javascript
stages: [
    { duration: '10s', target: 70 },
    { duration: '30s', target: 70 },
    { duration: '10s', target: 0 }
],
```

Luego ejecutar:

```bash
k6 run arboleda-abner.js
```

### Prueba 4: 90 Usuarios Virtuales por 30 segundos

Editar el archivo `arboleda-abner.js` y cambiar las líneas 6-8:

```javascript
stages: [
    { duration: '10s', target: 90 },
    { duration: '30s', target: 90 },
    { duration: '10s', target: 0 }
],
```

Luego ejecutar:

```bash
k6 run arboleda-abner.js
```

## Métricas a Registrar

Para cada prueba, registrar:

1. **Checks totales** - Total de verificaciones realizadas
2. **Checks exitosos** - Verificaciones que pasaron exitosamente
3. **Checks fallidos** - Verificaciones que fallaron
4. **http_req_failed rate** - Porcentaje de solicitudes HTTP fallidas
5. **http_req_duration (p95)** - Tiempo de respuesta del percentil 95
6. **Iterations** - Número total de iteraciones completadas
7. **http_reqs** - Número total de solicitudes HTTP realizadas
8. **Duración iteración (avg)** - Duración promedio de cada iteración

### Checks específicos por operación:

- ✅ registro exitoso o duplicado
- ✅ login exitoso
- ✅ token presente
- ✅ reserva creada

## Tabla Comparativa de Resultados

| Métrica                      | 30 VUs | 50 VUs | 70 VUs | 90 VUs |
| ---------------------------- | ------ | ------ | ------ | ------ |
| Checks totales               |        |        |        |        |
| Checks exitosos              |        |        |        |        |
| Checks fallidos              |        |        |        |        |
| http_req_failed rate         |        |        |        |        |
| http_req_duration (p95)      |        |        |        |        |
| Iterations                   |        |        |        |        |
| http_reqs                    |        |        |        |        |
| Duración iteración (avg)     |        |        |        |        |
| registro exitoso o duplicado |        |        |        |        |
| login exitoso                |        |        |        |        |
| token presente               |        |        |        |        |
| reserva creada               |        |        |        |        |

## Análisis Esperado

1. **¿A partir de qué carga el sistema comienza a degradarse?**
   - Observar cuándo el p95 supera los 3 segundos
   - Verificar cuándo aumenta significativamente el % de errores

2. **¿Qué parte del flujo es más crítica?**
   - Analizar qué check falla primero al incrementar la carga
   - Identificar el cuello de botella (registro, login, o creación de reservas)

## Notas Importantes

- Limpiar la base de datos entre pruebas si es necesario para evitar acumulación de datos
- Asegurarse de que el servidor esté en condiciones óptimas antes de cada prueba
- Guardar la salida de cada ejecución para análisis posterior
