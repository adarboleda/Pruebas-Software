# Documentación de Cambios - Sistema Backend Tienda Online

## Resumen de Correcciones y Mejoras

### 1. **Corrección del OrderController**

#### Antes:

```javascript
exports.create = async (req, res) => {
  const { productId, quantity, price } = req.body;
  const { items } = req.body;
  if (quantity <= 0 || price < 0)
    return res.status(400).json({
      message:
        'La cantidad debe ser mayor a 0 y el precio no puede ser negativo',
    });
  // LÍNEA CLAVE PARA REGRESIÓN
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = new Order({ items, total });
  await order.save();
  res.status(201).json(order);
};
```

**Problemas identificados:**

- Validaba `productId`, `quantity` y `price` pero usaba un array `items`
- No validaba que `items` existiera o fuera un array
- **NO VALIDABA SI EL CARRITO ESTABA VACÍO** (requerimiento de regresión)
- No tenía manejo de errores (try-catch)

#### Después:

```javascript
exports.create = async (req, res) => {
  try {
    const { items } = req.body;

    // Validar que items existe y es un array
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        message: 'Debe proporcionar un array de items',
      });
    }

    // VALIDACIÓN DE REGRESIÓN: Verificar que el carrito no esté vacío
    if (items.length === 0) {
      return res.status(400).json({
        message: 'No se puede crear una orden con el carrito vacío',
      });
    }

    // Validar cada item individualmente
    for (const item of items) {
      if (!item.productId || !item.quantity || item.price === undefined) {
        return res.status(400).json({
          message: 'Cada item debe tener productId, quantity y price',
        });
      }
      if (item.quantity <= 0) {
        return res.status(400).json({
          message: 'La cantidad debe ser mayor a 0',
        });
      }
      if (item.price < 0) {
        return res.status(400).json({
          message: 'El precio no puede ser negativo',
        });
      }
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({ items, total });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al crear la orden', error: error.message });
  }
};
```

**Mejoras aplicadas:**

- ✅ Validación correcta del array `items`
- ✅ **VALIDACIÓN DE CARRITO VACÍO** (línea 20-25)
- ✅ Validación individual de cada item
- ✅ Manejo de errores con try-catch
- ✅ Mensajes de error descriptivos

---

### 2. **Prueba de Regresión - Cambio de Regla de Negocio**

#### Regla de Negocio Implementada:

**"No se debe permitir generar una orden si el carrito está vacío. El sistema debe responder con un error 400."**

#### Comportamiento ANTES del cambio:

- El sistema permitía crear órdenes sin validar si `items` estaba vacío
- Podía crear órdenes con `items: []`
- Comportamiento: **PERMITIDO** ❌

#### Comportamiento DESPUÉS del cambio:

- El sistema rechaza órdenes con carrito vacío
- Respuesta: `400 - "No se puede crear una orden con el carrito vacío"`
- Comportamiento: **RECHAZADO CORRECTAMENTE** ✅

#### ¿Por qué es una Prueba de Regresión?

Una **prueba de regresión** verifica que después de realizar cambios en el código, las funcionalidades existentes continúen funcionando correctamente y los nuevos cambios se comporten como se espera.

En este caso:

1. **Estado inicial**: Sistema permitía órdenes vacías (bug)
2. **Cambio aplicado**: Agregamos validación de carrito vacío
3. **Prueba de regresión**: Verificamos que:
   - ✅ Órdenes con productos siguen funcionando
   - ✅ Órdenes vacías son rechazadas correctamente
   - ✅ Otros endpoints no fueron afectados

---

### 3. **Mejoras Adicionales en el Sistema**

#### 3.1 Modelos Mejorados

**User Model:**

```javascript
- Agregado campo 'cart' para gestión de carrito
- Validaciones en el esquema
- Campo createdAt
```

**Product Model:**

```javascript
- Campos marcados como required
- Validaciones min: 0 para price y stock
- Campo createdAt
```

#### 3.2 Nuevo CartController

Se creó un controlador completo para gestión de carrito:

- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar producto al carrito
- `PUT /api/cart` - Actualizar cantidad de producto
- `DELETE /api/cart/:productId` - Eliminar producto del carrito
- `DELETE /api/cart` - Vaciar carrito completo

Validaciones incluidas:

- Verificación de stock disponible
- Cantidades positivas
- Productos existentes
- Carrito del usuario autenticado

#### 3.3 Manejo de Errores Global

Todos los controladores ahora incluyen:

- Bloques try-catch
- Mensajes de error descriptivos
- Códigos HTTP apropiados (400, 401, 404, 500)
- Información del error en respuestas

#### 3.4 Validaciones de AuthController

- Validación de campos obligatorios antes de procesamiento
- Retorno de userId en login y registro
- Mensajes de error más descriptivos

---

## Endpoints Disponibles

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Productos

- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Carrito (requiere autenticación)

- `GET /api/cart` - Ver carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart` - Actualizar carrito
- `DELETE /api/cart/:productId` - Eliminar del carrito
- `DELETE /api/cart` - Vaciar carrito

### Órdenes (requiere autenticación)

- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `DELETE /api/orders/:id` - Eliminar orden

---

## Pruebas Recomendadas en Postman

### 1. Pruebas Funcionales

#### Test 1: Registro de Usuario

```
POST http://localhost:3000/api/auth/register
Body: {
  "username": "Abner [TU_APELLIDO]",
  "password": "password123"
}
Esperado: 201 Created
```

#### Test 2: Login

```
POST http://localhost:3000/api/auth/login
Body: {
  "username": "Abner [TU_APELLIDO]",
  "password": "password123"
}
Esperado: 200 OK con token
```

#### Test 3: Crear Producto

```
POST http://localhost:3000/api/products
Body: {
  "name": "Laptop Abner [TU_APELLIDO]",
  "price": 999.99,
  "stock": 10
}
Esperado: 201 Created
```

#### Test 4: Agregar al Carrito

```
POST http://localhost:3000/api/cart
Headers: Authorization: Bearer [token]
Body: {
  "productId": "[id_del_producto]",
  "quantity": 2
}
Esperado: 200 OK
```

#### Test 5: Crear Orden VACÍA (DEBE FALLAR)

```
POST http://localhost:3000/api/orders
Headers: Authorization: Bearer [token]
Body: {
  "items": []
}
Esperado: 400 Bad Request
Mensaje: "No se puede crear una orden con el carrito vacío"
```

#### Test 6: Crear Orden Válida

```
POST http://localhost:3000/api/orders
Headers: Authorization: Bearer [token]
Body: {
  "items": [
    {
      "productId": "[id]",
      "quantity": 2,
      "price": 999.99
    }
  ]
}
Esperado: 201 Created
```

### 2. Pruebas de Errores

#### Campos Faltantes

- Registro sin username o password → 400
- Login sin credenciales → 400
- Producto sin nombre, precio o stock → 400

#### Valores Inválidos

- Precio negativo en producto → 400
- Stock negativo → 400
- Cantidad 0 o negativa en orden → 400
- Carrito vacío en orden → 400

#### Autenticación

- Acceso sin token a rutas protegidas → 401
- Token inválido → 401

#### Recursos No Encontrados

- Producto inexistente → 404
- Orden inexistente → 404

---

## Resumen de Cambios para Regresión

| Aspecto                      | Antes             | Después         |
| ---------------------------- | ----------------- | --------------- |
| **Validación carrito vacío** | ❌ No existía     | ✅ Implementada |
| **Validación items array**   | ⚠️ Incompleta     | ✅ Completa     |
| **Manejo de errores**        | ❌ Sin try-catch  | ✅ Completo     |
| **Mensajes de error**        | ⚠️ Genéricos      | ✅ Descriptivos |
| **Códigos HTTP**             | ⚠️ Inconsistentes | ✅ Correctos    |
| **Gestión de carrito**       | ❌ No existía     | ✅ Implementada |

---

## Conclusión

El sistema ha sido corregido y mejorado significativamente:

1. ✅ **Regla de negocio implementada**: No se permiten órdenes con carrito vacío
2. ✅ **Validaciones robustas**: Todos los endpoints validan datos correctamente
3. ✅ **Manejo de errores**: Try-catch en todos los controllers
4. ✅ **Gestión de carrito**: Sistema completo de carrito implementado
5. ✅ **Códigos HTTP apropiados**: Respuestas correctas según el caso
6. ✅ **Mensajes descriptivos**: Errores claros y útiles para el usuario

El sistema está listo para pruebas funcionales y de regresión en Postman.
