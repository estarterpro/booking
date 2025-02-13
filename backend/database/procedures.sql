---------------------------------------
---       CLIENT PROCEDURES         ---
---------------------------------------
CREATE OR REPLACE PROCEDURE sp_create_or_update_client(
  p_nombre VARCHAR(255),
  p_telefono VARCHAR(20),
  p_correo VARCHAR(255),
  INOUT p_id INTEGER DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Intentar actualizar el cliente existente
  UPDATE clients 
  SET 
    nombre = p_nombre,
    telefono = p_telefono,
    updated_at = CURRENT_TIMESTAMP
  WHERE correo = p_correo
  RETURNING id INTO p_id;
  
  -- Si no existe el cliente, crearlo
  IF p_id IS NULL THEN
    INSERT INTO clients (nombre, telefono, correo)
    VALUES (p_nombre, p_telefono, p_correo)
    RETURNING id INTO p_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_clients()
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR(255),
  telefono VARCHAR(20),
  correo VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT c.* FROM clients c;
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_client_by_id(p_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR(255),
  telefono VARCHAR(20),
  correo VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT c.* FROM clients c WHERE c.id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_client(
  p_id INTEGER,
  p_nombre VARCHAR(255),
  p_telefono VARCHAR(20),
  p_correo VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE clients 
  SET nombre = p_nombre,
      telefono = p_telefono,
      correo = p_correo,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_delete_client(
  p_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM clients WHERE id = p_id;
END;
$$;



-- Existing procedures...

---------------------------------------
---      LOCATION PROCEDURES        ---
---------------------------------------
CREATE OR REPLACE PROCEDURE sp_create_location(
  p_nombre VARCHAR(255),
  INOUT p_id INTEGER DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO locations (nombre)
  VALUES (p_nombre)
  RETURNING id INTO p_id;
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_locations()
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT l.id, l.nombre, l.created_at, l.updated_at FROM locations l;
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_location_by_id(p_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT l.id, l.nombre, l.created_at, l.updated_at 
  FROM locations l 
  WHERE l.id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_location(
  p_id INTEGER,
  p_nombre VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE locations 
  SET nombre = p_nombre,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_delete_location(
  p_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM locations WHERE id = p_id;
END;
$$;

---------------------------------------
---      VEHICLE PROCEDURES         ---
---------------------------------------
CREATE OR REPLACE PROCEDURE sp_create_vehicle(
  p_tipo VARCHAR(255),
  p_cant_maxima_personas INTEGER,
  p_cant_maxima_maletas INTEGER,
  p_image_url TEXT,
  INOUT p_id INTEGER DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO vehicles (tipo, cant_maxima_personas, cant_maxima_maletas, image_url)
  VALUES (p_tipo, p_cant_maxima_personas, p_cant_maxima_maletas, p_image_url)
  RETURNING id INTO p_id;
END;
$$;


CREATE OR REPLACE FUNCTION sp_get_vehicles()
RETURNS TABLE (
  id INTEGER,
  tipo VARCHAR(255),
  cant_maxima_personas INTEGER,
  cant_maxima_maletas INTEGER,
  image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT v.* FROM vehicles v;
END;
$$;


CREATE OR REPLACE FUNCTION sp_get_vehicle_by_id(p_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  tipo VARCHAR(255),
  cant_maxima_personas INTEGER,
  cant_maxima_maletas INTEGER,
  image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT v.* FROM vehicles v WHERE v.id = p_id;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_update_vehicle(
  p_id INTEGER,
  p_tipo VARCHAR(255),
  p_cant_maxima_personas INTEGER,
  p_cant_maxima_maletas INTEGER,
  p_image_url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE vehicles 
  SET tipo = p_tipo,
      cant_maxima_personas = p_cant_maxima_personas,
      cant_maxima_maletas = p_cant_maxima_maletas,
      image_url = p_image_url,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_id;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_delete_vehicle(
  p_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM vehicles WHERE id = p_id;
END;
$$;


---------------------------------------
---       DRIVER PROCEDURES         ---
---------------------------------------
-- Procedimiento para crear conductor
CREATE OR REPLACE PROCEDURE sp_create_driver(
  p_nombre VARCHAR(255),
  p_telefono VARCHAR(20),
  p_placa VARCHAR(20),
  p_ubicacion_id INTEGER,
  p_vehiculo_id INTEGER,
  INOUT p_id INTEGER DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO drivers (
    nombre, telefono, placa, ubicacion_id, vehiculo_id, estado
  )
  VALUES (
    p_nombre, p_telefono, p_placa, p_ubicacion_id, p_vehiculo_id, 'disponible'
  )
  RETURNING id INTO p_id;
END;
$$;

-- Función para obtener conductores con filtros
CREATE OR REPLACE FUNCTION sp_get_drivers(
  p_ubicacion_id INTEGER DEFAULT NULL,
  p_estado VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR(255),
  telefono VARCHAR(20),
  placa VARCHAR(20),
  ubicacion_id INTEGER,
  vehiculo_id INTEGER,
  estado VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT d.*
  FROM drivers d
  WHERE (p_ubicacion_id IS NULL OR d.ubicacion_id = p_ubicacion_id)
  AND (p_estado IS NULL OR d.estado = p_estado);
END;
$$;

-- Función para obtener conductor por ID
CREATE OR REPLACE FUNCTION sp_get_driver_by_id(p_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR(255),
  telefono VARCHAR(20),
  placa VARCHAR(20),
  ubicacion_id INTEGER,
  vehiculo_id INTEGER,
  estado VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT d.* 
  FROM drivers d 
  WHERE d.id = p_id;
END;
$$;

-- Procedimiento para actualizar estado del conductor
CREATE OR REPLACE PROCEDURE sp_update_driver_status(
  p_id INTEGER,
  p_estado VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE drivers
  SET estado = p_estado,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_id;
END;
$$;

-- Función para obtener reservas asignadas a un conductor
CREATE OR REPLACE FUNCTION sp_get_driver_reservations(p_conductor_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  fecha DATE,
  hora TIME,
  distancia_minutos INTEGER,
  estado VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    r.id,
    r.fecha,
    r.hora,
    r.distancia_minutos,
    r.estado
  FROM reservations r
  INNER JOIN service_orders so ON r.id = so.reserva_id
  WHERE so.conductor_id = p_conductor_id
  AND r.estado NOT IN ('cancelada', 'completada')
  ORDER BY r.fecha, r.hora;
END;
$$;
---------------------------------------
---   RATES PROCEDURE (tarifas)     ---
---------------------------------------

-- Crear tarifas
CREATE OR REPLACE PROCEDURE sp_create_rate(
  p_vehiculo_id INTEGER,
  p_ubicacion_id INTEGER,
  p_tarifa_base DECIMAL(10),
  p_km_incluidos DECIMAL(10),
  p_band1_km_hasta DECIMAL(10),
  p_band1_precio_km DECIMAL(10),
  p_band2_km_hasta DECIMAL(10),
  p_band2_precio_km DECIMAL(10),
  p_band3_precio_km DECIMAL(10),
  INOUT p_id INTEGER DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO rates (
    vehiculo_id, ubicacion_id, tarifa_base, 
    km_incluidos, 
    band1_km_hasta, band1_precio_km,
    band2_km_hasta, band2_precio_km,
    band3_precio_km
  )
  VALUES (
    p_vehiculo_id, p_ubicacion_id, p_tarifa_base,
    p_km_incluidos,
    p_band1_km_hasta, p_band1_precio_km,
    p_band2_km_hasta, p_band2_precio_km,
    p_band3_precio_km
  )
  RETURNING id INTO p_id;
END;
$$;

-- Actualizar el procedimiento de obtención de tarifas
CREATE OR REPLACE FUNCTION sp_get_rates()
RETURNS TABLE (
  id INTEGER,
  vehiculo_id INTEGER,
  ubicacion_id INTEGER,
  tarifa_base DECIMAL(10),
  km_incluidos DECIMAL(10),
  band1_km_hasta DECIMAL(10),
  band1_precio_km DECIMAL(10),
  band2_km_hasta DECIMAL(10),
  band2_precio_km DECIMAL(10),
  band3_precio_km DECIMAL(10)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT r.id, r.vehiculo_id, r.ubicacion_id, r.tarifa_base,
         r.km_incluidos,
         r.band1_km_hasta, r.band1_precio_km,
         r.band2_km_hasta, r.band2_precio_km,
         r.band3_precio_km
  FROM rates r;
END;
$$;

-- Function to get rate by vehicle and location
CREATE OR REPLACE FUNCTION sp_get_rate_by_vehicle_location(
  p_vehiculo_id INTEGER,
  p_ubicacion_id INTEGER
)
RETURNS TABLE (
  id INTEGER,
  vehiculo_id INTEGER,
  ubicacion_id INTEGER,
  tarifa_base DECIMAL(10),
  km_incluidos DECIMAL(10),
  band1_km_hasta DECIMAL(10),
  band1_precio_km DECIMAL(10),
  band2_km_hasta DECIMAL(10),
  band2_precio_km DECIMAL(10),
  band3_precio_km DECIMAL(10),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT r.* 
  FROM rates r 
  WHERE r.vehiculo_id = p_vehiculo_id 
  AND r.ubicacion_id = p_ubicacion_id;
END;
$$;

-- Actualizar el procedimiento de actualización de tarifas
CREATE OR REPLACE PROCEDURE sp_update_rate(
  p_vehiculo_id INTEGER,
  p_ubicacion_id INTEGER,
  p_tarifa_base DECIMAL(10),
  p_km_incluidos DECIMAL(10),
  p_band1_km_hasta DECIMAL(10),
  p_band1_precio_km DECIMAL(10),
  p_band2_km_hasta DECIMAL(10),
  p_band2_precio_km DECIMAL(10),
  p_band3_precio_km DECIMAL(10)
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE rates 
  SET 
    tarifa_base = p_tarifa_base,
    km_incluidos = p_km_incluidos,
    band1_km_hasta = p_band1_km_hasta,
    band1_precio_km = p_band1_precio_km,
    band2_km_hasta = p_band2_km_hasta,
    band2_precio_km = p_band2_precio_km,
    band3_precio_km = p_band3_precio_km,
    updated_at = CURRENT_TIMESTAMP
  WHERE vehiculo_id = p_vehiculo_id 
  AND ubicacion_id = p_ubicacion_id;
END;
$$;

-- borrar tarifas
CREATE OR REPLACE PROCEDURE sp_delete_rate(
  p_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM rates WHERE id = p_id;
END;
$$;


---------------------------------------
---      RESERVATIONS PROCEDURE     ---
---------------------------------------
-- procedimiento para crear reserva
CREATE OR REPLACE PROCEDURE sp_create_reservation(
  p_cliente_id INTEGER,
  p_origen VARCHAR(255),
  p_destino VARCHAR(255),
  p_distancia_km DECIMAL(10,2),
  p_distancia_minutos INTEGER,
  p_fecha DATE,
  p_hora TIME,
  p_tipo_servicio VARCHAR(20),
  p_vehiculo_id INTEGER,
  p_ubicacion_id INTEGER,
  p_tarifa_total DECIMAL(10,2),
  p_notas_conductor TEXT,
  p_transaction_id VARCHAR(255),
  p_payment_reference VARCHAR(255),
  p_payment_status VARCHAR(50),
  p_payment_amount DECIMAL(10,2),
  INOUT p_id INTEGER DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO reservations (
    cliente_id, 
    origen, 
    destino, 
    distancia_km,
    distancia_minutos,
    fecha, 
    hora, 
    tipo_servicio,
    vehiculo_id,
    ubicacion_id,
    tarifa_total,
    notas_conductor,
    estado,
    transaction_id,
    payment_reference,
    payment_status,
    payment_amount
  )
  VALUES (
    p_cliente_id,
    p_origen,
    p_destino,
    p_distancia_km,
    p_distancia_minutos,
    p_fecha,
    p_hora,
    p_tipo_servicio,
    p_vehiculo_id,
    p_ubicacion_id,
    p_tarifa_total,
    p_notas_conductor,
    'pendiente',
    p_transaction_id,
    p_payment_reference,
    p_payment_status,
    p_payment_amount
  )
  RETURNING id INTO p_id;
END;
$$;

-- procedimiento para obtener reservas con filtros
CREATE OR REPLACE FUNCTION sp_get_reservations(
  p_date_group VARCHAR DEFAULT NULL,
  p_specific_filter VARCHAR DEFAULT NULL,
  p_week_offset INTEGER DEFAULT 0,
  p_month_offset INTEGER DEFAULT 0,
  p_reservation_id INTEGER DEFAULT NULL,
  p_location VARCHAR DEFAULT NULL,
  p_status VARCHAR DEFAULT NULL,
  p_include_cancelled BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id INTEGER,
  cliente_id INTEGER,
  origen VARCHAR(255),
  destino VARCHAR(255),
  distancia_km DECIMAL(10,2),
  distancia_minutos INTEGER,
  fecha DATE,
  hora TIME,
  tipo_servicio VARCHAR(20),
  vehiculo_id INTEGER,
  ubicacion_id INTEGER,
  tarifa_total DECIMAL(10),
  estado VARCHAR(20),
  notas_conductor TEXT,
  transaction_id VARCHAR(255),
  payment_reference VARCHAR(255),
  payment_status VARCHAR(50),
  payment_amount DECIMAL(10),
  conductor_asignado BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_start_date DATE;
  v_end_date DATE;
BEGIN
  -- Calcular fechas basadas en filtros
  CASE 
    WHEN p_specific_filter = 'today' THEN
      v_start_date := CURRENT_DATE;
      v_end_date := CURRENT_DATE;
    WHEN p_specific_filter = 'tomorrow' THEN
      v_start_date := CURRENT_DATE + INTERVAL '1 day';
      v_end_date := CURRENT_DATE + INTERVAL '1 day';
    WHEN p_specific_filter = 'yesterday' THEN
      v_start_date := CURRENT_DATE - INTERVAL '1 day';
      v_end_date := CURRENT_DATE - INTERVAL '1 day';
    WHEN p_specific_filter = 'week' THEN
      v_start_date := DATE_TRUNC('week', CURRENT_DATE + (p_week_offset * INTERVAL '1 week'));
      v_end_date := v_start_date + INTERVAL '6 days';
    WHEN p_specific_filter = 'month' THEN
      v_start_date := DATE_TRUNC('month', CURRENT_DATE + (p_month_offset * INTERVAL '1 month'));
      v_end_date := (DATE_TRUNC('month', v_start_date) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    ELSE
      v_start_date := NULL;
      v_end_date := NULL;
  END CASE;

  RETURN QUERY 
  SELECT 
    r.id,
    r.cliente_id,
    r.origen,
    r.destino,
    r.distancia_km,
    r.distancia_minutos,
    r.fecha,
    r.hora,
    r.tipo_servicio,
    r.vehiculo_id,
    r.ubicacion_id,
    r.tarifa_total,
    r.estado,
    r.notas_conductor,
    r.transaction_id,
    r.payment_reference,
    r.payment_status,
    r.payment_amount,
    (EXISTS (SELECT 1 FROM service_orders so WHERE so.reserva_id = r.id)) as conductor_asignado,
    r.created_at,
    r.updated_at
  FROM reservations r
  WHERE 
    -- Filtro de fecha
    (p_date_group IS NULL OR 
      (p_date_group = 'past' AND r.fecha < CURRENT_DATE) OR 
      (p_date_group = 'present' AND r.fecha >= CURRENT_DATE))
    
    -- Filtro de rango de fechas específico
    AND (v_start_date IS NULL OR r.fecha BETWEEN v_start_date AND v_end_date)
    
    -- Filtro por ID de reserva
    AND (p_reservation_id IS NULL OR r.id = p_reservation_id)
    
    -- Filtro por ubicación
    AND (p_location IS NULL OR r.origen ILIKE '%' || p_location || '%' OR r.destino ILIKE '%' || p_location || '%')
    
    -- Filtro por estado y reservas canceladas
    AND (
      CASE 
        WHEN NOT p_include_cancelled AND p_date_group = 'present' THEN
          r.estado != 'cancelada'
        WHEN p_status IS NOT NULL THEN
          CASE p_status
            WHEN 'with_driver' THEN EXISTS (SELECT 1 FROM service_orders so WHERE so.reserva_id = r.id)
            WHEN 'without_driver' THEN NOT EXISTS (SELECT 1 FROM service_orders so WHERE so.reserva_id = r.id)
            WHEN 'cancelled' THEN r.estado = 'cancelada'
            ELSE r.estado = p_status
          END
        ELSE TRUE
      END
    )
  ORDER BY r.fecha, r.hora;
END;
$$;


-- procedimiento para actualizar reserva
CREATE OR REPLACE PROCEDURE sp_update_reservation_status(
  p_id INTEGER,
  p_estado VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE reservations
  SET estado = p_estado,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_id;
END;
$$;


---------------------------------------
---   SERVICE ORDER PROCEDURES      ---
---------------------------------------
DROP PROCEDURE IF EXISTS sp_create_service_order(INTEGER, INTEGER, INTEGER);
CREATE OR REPLACE PROCEDURE sp_create_service_order(
  p_reserva_id INTEGER,
  p_conductor_id INTEGER,
  INOUT p_id INTEGER DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO service_orders (reserva_id, conductor_id)
  VALUES (p_reserva_id, p_conductor_id)
  RETURNING id INTO p_id;
  
  -- Update driver status
  --UPDATE drivers SET estado = 'ocupado' WHERE id = p_conductor_id;
  
  -- Update reservation status
  UPDATE reservations SET estado = '' WHERE id = p_reserva_id;
END;
$$;



DROP FUNCTION IF EXISTS sp_get_service_orders();
CREATE OR REPLACE FUNCTION sp_get_service_orders()
RETURNS TABLE (
  id INTEGER,
  reserva_id INTEGER,
  conductor_id INTEGER,
  fecha_asignacion TIMESTAMP,
  estado VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    so.id,
    so.reserva_id,
    so.conductor_id,
    so.fecha_asignacion,
    so.estado,
    so.created_at,
    so.updated_at
  FROM service_orders so;
END;
$$;

-- procedimiento para buscar cliente por email.
CREATE OR REPLACE FUNCTION sp_get_client_by_email(p_email VARCHAR)
RETURNS TABLE (
  id INTEGER,
  nombre VARCHAR(255),
  telefono VARCHAR(20),
  correo VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT c.* 
  FROM clients c 
  WHERE c.correo = p_email;
END;
$$;
