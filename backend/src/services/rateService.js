const Rate = require('../models/Rate');

async function calculateTotalRate(vehiculo_id, ubicacion_id, distancia_km) {
  try {
    const rates = await Rate.findAll();
    const rate = rates.find(r => r.vehiculo_id === vehiculo_id && r.ubicacion_id === ubicacion_id);

    if (!rate) {
      throw new Error('No se encontró tarifa para el vehículo y ubicación especificados');
    }

    let totalCost = parseFloat(rate.tarifa_base);
    let remainingDistance = parseFloat(distancia_km);

    // Si la distancia es menor o igual a los kilómetros incluidos, solo se cobra la tarifa base
    if (remainingDistance <= rate.km_incluidos) {
      return Math.round(totalCost);
    }

    // Restar los kilómetros incluidos
    remainingDistance -= rate.km_incluidos;

    // Calcular costo para Band 1
    if (remainingDistance > 0) {
      const band1Distance = Math.min(remainingDistance, rate.band1_km_hasta - rate.km_incluidos);
      if (band1Distance > 0) {
        totalCost += band1Distance * rate.band1_precio_km;
        remainingDistance -= band1Distance;
      }
    }

    // Calcular costo para Band 2
    if (remainingDistance > 0) {
      const band2Distance = Math.min(remainingDistance, rate.band2_km_hasta - rate.band1_km_hasta);
      if (band2Distance > 0) {
        totalCost += band2Distance * rate.band2_precio_km;
        remainingDistance -= band2Distance;
      }
    }

    // Calcular costo para Band 3 (kilómetros restantes)
    if (remainingDistance > 0) {
      totalCost += remainingDistance * rate.band3_precio_km;
    }

    return Math.round(totalCost);
  } catch (error) {
    console.error('Error calculating total rate:', error);
    throw error;
  }
}

module.exports = {
  calculateTotalRate
};