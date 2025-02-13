const moment = require('moment');
const Driver = require('../models/Driver');

const PREPARATION_TIME_MINUTES = 30;
const COMPLETION_TIME_MINUTES = 60;

async function updateDriverStatusBasedOnTime(driverId, reservationDateTime, distanceMinutes) {
  try {
    const startTime = moment(reservationDateTime).subtract(PREPARATION_TIME_MINUTES, 'minutes');
    const endTime = moment(reservationDateTime).add(distanceMinutes, 'minutes').add(COMPLETION_TIME_MINUTES, 'minutes');
    const now = moment();

    // Si estamos dentro del período de la reserva
    if (now.isBetween(startTime, endTime)) {
      await Driver.updateStatus(driverId, 'ocupado');
      return true;
    }

    // Programar la actualización del estado para el inicio
    if (now.isBefore(startTime)) {
      const msUntilStart = startTime.diff(now);
      setTimeout(async () => {
        await Driver.updateStatus(driverId, 'ocupado');
      }, msUntilStart);
    }

    // Programar la actualización del estado para el final
    if (now.isBefore(endTime)) {
      const msUntilEnd = endTime.diff(now);
      setTimeout(async () => {
        await Driver.updateStatus(driverId, 'disponible');
      }, msUntilEnd);
    }

    return true;
  } catch (error) {
    console.error('Error updating driver status:', error);
    throw error;
  }
}

async function checkDriverAvailability(driverId, reservationDateTime, distanceMinutes) {
  try {
    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      throw new Error('Conductor no encontrado');
    }

    // Obtener todas las reservas asignadas al conductor
    const assignedReservations = await Driver.getAssignedReservations(driverId);
    
    // Verificar superposición con otras reservas
    const newReservationStart = moment(reservationDateTime).subtract(PREPARATION_TIME_MINUTES, 'minutes');
    const newReservationEnd = moment(reservationDateTime)
      .add(distanceMinutes, 'minutes')
      .add(COMPLETION_TIME_MINUTES, 'minutes');

    const hasOverlap = assignedReservations.some(reservation => {
      const existingStart = moment(reservation.fecha + ' ' + reservation.hora)
        .subtract(PREPARATION_TIME_MINUTES, 'minutes');
      const existingEnd = moment(reservation.fecha + ' ' + reservation.hora)
        .add(reservation.distancia_minutos, 'minutes')
        .add(COMPLETION_TIME_MINUTES, 'minutes');

      return (
        newReservationStart.isBetween(existingStart, existingEnd) ||
        newReservationEnd.isBetween(existingStart, existingEnd) ||
        existingStart.isBetween(newReservationStart, newReservationEnd) ||
        existingEnd.isBetween(newReservationStart, newReservationEnd)
      );
    });

    return !hasOverlap;
  } catch (error) {
    console.error('Error checking driver availability:', error);
    throw error;
  }
}

module.exports = {
  updateDriverStatusBasedOnTime,
  checkDriverAvailability,
  PREPARATION_TIME_MINUTES,
  COMPLETION_TIME_MINUTES
};