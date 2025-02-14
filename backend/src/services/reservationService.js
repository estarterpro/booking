//const { calculateDistance } = require('./mapbox');
const { calculateDistance } = require('./hereService');
const { calculateTotalRate } = require('./rateService');


async function prepareReservationData(reservationInput) {
  try {
    const {
      cliente_id,
      origen,
      destino,
      fecha,
      hora,
      tipo_servicio,
      vehiculo_id,
      ubicacion_id,
      notas_conductor
    } = reservationInput;

    const distanceData = await calculateDistance(origen, destino);
    const tarifa_total = await calculateTotalRate(vehiculo_id, ubicacion_id, distanceData.distancia_km);

    return {
      cliente_id,
      origen,
      destino,
      distancia_km: distanceData.distancia_km,
      distancia_minutos: distanceData.distancia_minutos,
      fecha,
      hora,
      tipo_servicio,
      vehiculo_id,
      ubicacion_id,
      tarifa_total,
      notas_conductor
    };
  } catch (error) {
    console.error('Error preparing reservation data:', error);
    throw error;
  }
}

module.exports = {
  prepareReservationData
};