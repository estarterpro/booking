# DOCUMENTACION API DEL SISTEMA DE RESERVAS AEROPUERTOS

## Índice

1. [Autenticación](#authentication)
2. [Clientes](#clients)
3. [Conductores](#drivers)
4. [Tarifas](#rates)
5. [Reservas](#reservations)
6. [Órdenes de Servicio](#service-orders)
7. [Pagos](#payments)
8. [Búsqueda](#search)
9. [Ubicaciones](#locations)
10. [Vehículos](#vehicles)

## Authentication

### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Clients

### Create Client

```http
POST /api/clientes
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "telefono": "3001234567",
  "correo": "juan.perez@email.com"
}

Response:
{
  "id": 1,
  "nombre": "Juan Pérez",
  "telefono": "3001234567",
  "correo": "juan.perez@email.com"
}
```

### Get Clients

```http
GET /api/clientes
Authorization: Bearer YOUR_TOKEN

Response:
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "telefono": "3001234567",
    "correo": "juan.perez@email.com"
  }
]
```

## Drivers

### Create Driver

```http
POST /api/conductores
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "nombre": "Carlos Gómez",
  "telefono": "3109876543",
  "placa": "ABC123",
  "ubicacion_id": 1,
  "vehiculo_id": 1
}

Response:
{
  "id": 1,
  "nombre": "Carlos Gómez",
  "telefono": "3109876543",
  "placa": "ABC123",
  "ubicacion_id": 1,
  "vehiculo_id": 1,
  "estado": "disponible"
}
```

### Get Drivers

```http
GET /api/conductores?ubicacion_id=1&estado=disponible
Authorization: Bearer YOUR_TOKEN

Response:
[
  {
    "id": 1,
    "nombre": "Carlos Gómez",
    "telefono": "3109876543",
    "placa": "ABC123",
    "ubicacion_id": 1,
    "vehiculo_id": 1,
    "estado": "disponible"
  }
]
```

### Update Driver Status

```http
PATCH /api/conductores/1/estado
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "estado": "ocupado"
}

Response:
{
  "id": 1,
  "estado": "ocupado"
}
```

## Rates

### Create Rate

```http
POST /api/tarifas
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "vehiculo_id": 1,
  "ubicacion_id": 1,
  "tarifa_base": 90000,
  "km_incluidos": 8,
  "band1_km_hasta": 12,
  "band1_precio_km": 7500,
  "band2_km_hasta": 16,
  "band2_precio_km": 15000,
  "band3_precio_km": 20000
}

Response:
{
  "id": 1,
  "vehiculo_id": 1,
  "ubicacion_id": 1,
  "tarifa_base": 90000,
  "km_incluidos": 8,
  "band1_km_hasta": 12,
  "band1_precio_km": 7500,
  "band2_km_hasta": 16,
  "band2_precio_km": 15000,
  "band3_precio_km": 20000
}
```

### Get Rates

```http
GET /api/tarifas
Authorization: Bearer YOUR_TOKEN

Response:
[
  {
    "id": 1,
    "vehiculo_id": 1,
    "ubicacion_id": 1,
    "tarifa_base": 90000,
    "km_incluidos": 8,
    "band1_km_hasta": 12,
    "band1_precio_km": 7500,
    "band2_km_hasta": 16,
    "band2_precio_km": 15000,
    "band3_precio_km": 20000
  }
]
```

### Update Rate

```http
PATCH /api/tarifas/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "tarifa_base": 95000,
  "km_incluidos": 10,
  "band1_km_hasta": 14,
  "band1_precio_km": 7700,
  "band2_km_hasta": 18,
  "band2_precio_km": 15500,
  "band3_precio_km": 21000
}

Response:
{
  "id": 1,
  "tarifa_base": 95000,
  "km_incluidos": 10,
  "band1_km_hasta": 14,
  "band1_precio_km": 7700,
  "band2_km_hasta": 18,
  "band2_precio_km": 15500,
  "band3_precio_km": 21000
}
```

### Delete Rate

```http
DELETE /api/tarifas/1
Authorization: Bearer YOUR_TOKEN

Response: 204 No Content
```

## Reservations

### Create Reservation

```http
POST /api/reservas
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "telefono": "3001234567",
  "correo": "juan.perez@email.com",
  "origen": "Bogotá",
  "destino": "Chía",
  "fecha_ida": "2024-12-01",
  "hora_ida": "08:00",
  "fecha_regreso": "2024-12-02",
  "hora_regreso": "18:00",
  "tipo_servicio": "ida_y_regreso",
  "vehiculo_id": 1,
  "ubicacion_id": 1,
  "distancia_km": 20.5,
  "distancia_minutos": 40,
  "tarifa_total": 120000,
  "notas_conductor": "El cliente tiene 3 maletas grandes.",
  "transaction_id": "1234-5678",
  "payment_reference": "RESERVA-123",
  "payment_status": "APPROVED",
  "payment_amount": 12000000
}

Response:
{
  "success": true,
  "data": {
    "client": {
      "id": 1,
      "nombre": "Juan Pérez",
      "telefono": "3001234567",
      "correo": "juan.perez@email.com"
    },
    "reservations": [
      {
        "id": 1,
        "tarifa_total": 60000,
        "estado": "pendiente"
      },
      {
        "id": 2,
        "tarifa_total": 60000,
        "estado": "pendiente"
      }
    ]
  }
}
```

### Get Reservations with Advanced Filtering

```http
GET /api/reservas
Authorization: Bearer YOUR_TOKEN

Query Parameters:
- dateGroup: "past" | "present" (optional)
- specificFilter: "today" | "tomorrow" | "yesterday" | "week" | "month" (optional)
- weekOffset: number (optional, default: 0)
- monthOffset: number (optional, default: 0)
- reservationId: number (optional)
- location: string (optional)
- status: "with_driver" | "without_driver" | "cancelled" (optional)

Response:
{
  "success": true,
  "data": {
    "filters": {
      "dateGroup": "present",
      "specificFilter": "week",
      "weekOffset": 1,
      "monthOffset": 0,
      "location": "Bogotá",
      "status": "with_driver"
    },
    "reservations": [
      {
        "id": 1,
        "cliente_id": 1,
        "origen": "Bogotá",
        "destino": "Chía",
        "distancia_km": 20.5,
        "distancia_minutos": 40,
        "fecha": "2024-12-01",
        "hora": "08:00",
        "tipo_servicio": "ida_y_regreso",
        "vehiculo_id": 1,
        "ubicacion_id": 1,
        "tarifa_total": 120000,
        "estado": "pendiente",
        "notas_conductor": "El cliente tiene 3 maletas grandes.",
        "conductor_asignado": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Update Reservation Status

```http
PATCH /api/reservas/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "estado": "completada"
}

Response:
{
  "id": 1,
  "estado": "completada"
}
```

## Service Orders

### Create Service Order

```http
POST /api/ordenes-servicio
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "reserva_id": 1,
  "conductor_id": 2
}

Response:
{
  "id": 1,
  "reserva_id": 1,
  "conductor_id": 2,
  "fecha_asignacion": "2024-01-15T10:30:00Z",
  "estado": "asignado"
}
```

### Get Service Orders

```http
GET /api/ordenes-servicio
Authorization: Bearer YOUR_TOKEN

Response:
[
  {
    "id": 1,
    "reserva_id": 1,
    "conductor_id": 2,
    "fecha_asignacion": "2024-01-15T10:30:00Z",
    "estado": "asignado"
  }
]
```

## Payments

### Generate Wompi Signature

```http
POST /api/payments/signature
Content-Type: application/json

{
  "reference": "RESERVA-123",
  "amountInCents": 9000000,
  "currency": "COP"
}

Response:
{
  "data-signature:integrity": "hash_generado",
  "data-client": "datos_concatenados"
}
```

### Wompi Webhook

```http
POST /api/payments/webhook
Content-Type: application/json

{
  "data": {
    "transaction": {
      "id": "1234-5678",
      "status": "APPROVED",
      "reference": "RESERVA-123"
    }
  },
  "timestamp": 1234567890,
  "signature": {
    "properties": ["transaction.id", "transaction.status"],
    "checksum": "abc123"
  }
}

Response: 200 OK
```

### Get Transaction Status

```http
GET /api/payments/transactions/1234-5678
Authorization: Bearer YOUR_TOKEN

Response:
{
  "status": "APPROVED",
  "reference": "RESERVA-123",
  "amount": 90000
}
```

## Search

### Search Transport

```http
POST /api/search
Content-Type: application/json

{
  "origen": "Bogotá",
  "destino": "Chía",
  "fecha_ida": "2024-12-01",
  "hora_ida": "08:00",
  "cant_personas": 4,
  "tipo_servicio": "ida",
  "ubicacion_id": 1
}

Response:
{
  "success": true,
  "data": [
    {
      "vehiculo_id": 1,
      "tipo": "SUV",
      "cant_maxima_personas": 4,
      "cant_maxima_maletas": 3,
      "distancia_km": 20.5,
      "distancia_minutos": 40,
      "tiempo_estimado": "40 min",
      "tarifa_total": 120000
    }
  ]
}
```

### Search Round Trip Transport

```http
POST /api/search
Content-Type: application/json

{
  "origen": "Bogotá",
  "destino": "Chía",
  "fecha_ida": "2024-12-01",
  "hora_ida": "08:00",
  "fecha_regreso": "2024-12-02",
  "hora_regreso": "18:00",
  "cant_personas": 4,
  "tipo_servicio": "ida_y_regreso",
  "ubicacion_id": 1
}

Response:
{
  "success": true,
  "data": [
    {
      "vehiculo_id": 1,
      "tipo": "SUV",
      "cant_maxima_personas": 4,
      "cant_maxima_maletas": 3,
      "ida": {
        "distancia_km": 20.5,
        "distancia_minutos": 40,
        "tiempo_estimado": "40 min",
        "tarifa": 120000
      },
      "regreso": {
        "distancia_km": 20.5,
        "distancia_minutos": 40,
        "tiempo_estimado": "40 min",
        "tarifa": 120000
      },
      "tarifa_total": 240000
    }
  ]
}
```
