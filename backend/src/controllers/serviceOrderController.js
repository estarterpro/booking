const ServiceOrder = require('../models/ServiceOrder');
const Driver = require('../models/Driver');
const Reservation = require('../models/Reservation');
const {checkDriverAvailability, updateDriverStatusBasedOnTime} = require('../services/driverStatusService');

const validateServiceOrder = (data) => {
  const errors = [];

  if (!data.reserva_id || typeof data.reserva_id !== 'number') {
    errors.push('El ID de la reserva es requerido y debe ser un número');
  }

  if (!data.conductor_id || typeof data.conductor_id !== 'number') {
    errors.push('El ID del conductor es requerido y debe ser un número');
  }

  return errors;
};

const createServiceOrder = async (req, res) => {
  try {
    const validationErrors = validateServiceOrder(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const { reserva_id, conductor_id } = req.body;

    const reservation = await Reservation.findByPk(reserva_id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const reservationDateTime = `${reservation.fecha} ${reservation.hora}`;
    const isAvailable = await checkDriverAvailability(
      conductor_id,
      reservationDateTime,
      reservation.distancia_minutos
    );

    if (!isAvailable) {
      return res.status(400).json({ 
        message: 'El conductor no está disponible para este horario debido a otras reservas'
      });
    }

    const serviceOrder = await ServiceOrder.create({
      reserva_id,
      conductor_id
    });

    await updateDriverStatusBasedOnTime(
      conductor_id,
      reservationDateTime,
      reservation.distancia_minutos
    );

    res.status(201).json(serviceOrder);
  } catch (error) {
    console.error('Error creating service order:', error);
    res.status(400).json({ message: error.message });
  }
};

const getServiceOrders = async (req, res) => {
  try {
    const serviceOrders = await ServiceOrder.findAll();
    res.json(serviceOrders);
  } catch (error) {
    console.error('Error fetching service orders:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createServiceOrder,
  getServiceOrders
};
