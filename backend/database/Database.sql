CREATE DATABASE aeropuertos_db;

\c aeropuertos_db;

-- Create tables
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(255) NOT NULL,
  cant_maxima_personas INTEGER NOT NULL,
  cant_maxima_maletas INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS rates (
  id SERIAL PRIMARY KEY,
  vehiculo_id INTEGER REFERENCES vehicles(id),
  ubicacion_id INTEGER REFERENCES locations(id),
  tarifa_base DECIMAL(10) NOT NULL,
  km_incluidos DECIMAL(10) NOT NULL DEFAULT 0,
  band1_km_hasta DECIMAL(10) NOT NULL DEFAULT 0,
  band1_precio_km DECIMAL(10) NOT NULL DEFAULT 0,
  band2_km_hasta DECIMAL(10) NOT NULL DEFAULT 0,
  band2_precio_km DECIMAL(10) NOT NULL DEFAULT 0,
  band3_precio_km DECIMAL(10) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(vehiculo_id, ubicacion_id)
);



CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  placa VARCHAR(20) NOT NULL UNIQUE,
  ubicacion_id INTEGER REFERENCES locations(id),
  vehiculo_id INTEGER REFERENCES vehicles(id),
  estado VARCHAR(20) DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clients(id),
  origen VARCHAR(255) NOT NULL,
  destino VARCHAR(255) NOT NULL,
  distancia_km DECIMAL(10,2) NOT NULL,
  distancia_minutos INTEGER NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  tipo_servicio VARCHAR(20) NOT NULL,
  vehiculo_id INTEGER REFERENCES vehicles(id),
  ubicacion_id INTEGER REFERENCES locations(id),
  tarifa_total DECIMAL(10) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente',
  notas_conductor TEXT,
  transaction_id VARCHAR(255),
  payment_reference VARCHAR(255),
  payment_status VARCHAR(50),
  payment_amount DECIMAL(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS service_orders (
  id SERIAL PRIMARY KEY,
  reserva_id INTEGER REFERENCES reservations(id),
  conductor_id INTEGER REFERENCES drivers(id),
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'ASIGNADO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--NO SE VA A USAR ESTA TABLA AUN 
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(255) UNIQUE NOT NULL,
  wompi_transaction_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  payment_method VARCHAR(50),
  reservation_id INTEGER REFERENCES reservations(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for dashboard access
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'coordinator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
