const Reservation = require('../models/Reservation');
const Client = require('../models/Client');
const { prepareReservationData } = require('../services/reservationService');

const validateReservation = (data) => {
  const errors = [];

  if (!data.nombre) errors.push('El nombre del cliente es requerido');
  if (!data.telefono) {
    errors.push('El teléfono es requerido');
  } else if (!/^\d{10}$/.test(data.telefono)) {
    errors.push('El teléfono debe tener 10 dígitos');
  }
  if (!data.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
    errors.push('El correo electrónico es inválido');
  }

  if (!data.origen) errors.push('El origen es requerido');
  if (!data.destino) errors.push('El destino es requerido');
  if (!data.fecha_ida) errors.push('La fecha de ida es requerida');
  if (!data.hora_ida) errors.push('La hora de ida es requerida');
  if (!data.vehiculo_id) errors.push('El vehículo es requerido');
  if (!data.ubicacion_id) errors.push('La ubicación es requerida');
  
  if (data.tipo_servicio === 'ida_y_regreso') {
    if (!data.fecha_regreso) errors.push('La fecha de regreso es requerida para viajes redondos');
    if (!data.hora_regreso) errors.push('La hora de regreso es requerida para viajes redondos');
  }

  return errors;
};

const createReservation = async (req, res) => {
  try {
    const validationErrors = validateReservation(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const {
      nombre,
      telefono,
      correo,
      origen,
      destino,
      fecha_ida,
      hora_ida,
      fecha_regreso,
      hora_regreso,
      tipo_servicio,
      vehiculo_id,
      ubicacion_id,
      notas_conductor,
      distancia_km,
      distancia_minutos,
      tarifa_total,
      transaction_id,
      payment_reference,
      payment_status,
      payment_amount
    } = req.body;

    // Crear o actualizar cliente
    let client = await Client.findByEmail(correo);
    if (!client) {
      client = await Client.create({
        nombre,
        telefono,
        correo
      });
    }

    const reservations = [];

    // Crear reserva de ida
    const outboundReservation = await Reservation.create({
      cliente_id: client.id,
      origen,
      destino,
      distancia_km,
      distancia_minutos,
      fecha: fecha_ida,
      hora: hora_ida,
      tipo_servicio,
      vehiculo_id,
      ubicacion_id,
      tarifa_total: tipo_servicio === 'ida_y_regreso' ? tarifa_total / 2 : tarifa_total,
      notas_conductor,
      estado: 'pendiente',
      payment_reference,
      payment_status,
      payment_amount,
      transaction_id
    });
    
    reservations.push(outboundReservation);

    // Si es viaje redondo, crear reserva de regreso
    if (tipo_servicio === 'ida_y_regreso' && fecha_regreso && hora_regreso) {
      const returnReservation = await Reservation.create({
        cliente_id: client.id,
        origen: destino,
        destino: origen,
        fecha: fecha_regreso,
        hora: hora_regreso,
        tipo_servicio,
        vehiculo_id,
        ubicacion_id,
        distancia_km,
        distancia_minutos,
        tarifa_total: tarifa_total / 2,
        notas_conductor,
        estado: 'pendiente',
        payment_reference,
        payment_status,
        payment_amount,
        transaction_id
      });
      
      reservations.push(returnReservation);
    }

    res.status(201).json({
      success: true,
      data: {
        client,
        reservations: reservations.map(r => ({
          id: r.id,
          tarifa_total: r.tarifa_total,
          estado: r.estado
        }))
      }
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const getReservations = async (req, res) => {
  try {
    const {
      dateGroup,
      specificFilter,
      weekOffset,
      monthOffset,
      reservationId,
      location,
      status,
      includeCancelled
    } = req.query;

    // Convert string numbers to integers where needed
    const filters = {
      dateGroup,
      specificFilter,
      weekOffset: weekOffset ? parseInt(weekOffset) : 0,
      monthOffset: monthOffset ? parseInt(monthOffset) : 0,
      reservationId: reservationId ? parseInt(reservationId) : null,
      location,
      status,
      includeCancelled: includeCancelled === 'true'
    };

    const reservations = await Reservation.findAll(filters);

    res.json({
      success: true,
      data: {
        filters: {
          ...filters,
          weekOffset: filters.weekOffset,
          monthOffset: filters.monthOffset
        },
        reservations
      }
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    
    const updatedReservation = await Reservation.updateStatus(id, estado);
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservations,
  updateReservationStatus
};