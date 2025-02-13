//const { calculateDistance } = require('./mapbox');
const { calculateDistance } = require('./hereService');
const { calculateTotalRate } = require('./rateService');
const Vehicle = require('../models/Vehicle');

async function searchAvailableVehicles(searchData) {
  try {
    const {
      origen,
      destino,
      fecha_ida,
      hora_ida,
      cant_personas,
      tipo_servicio,
      fecha_regreso,
      hora_regreso,
      includeFullVehicleDetails
    } = searchData;

    // Calcular distancia y obtener ubicacion_id
    const routeData = await calculateDistance(origen, destino);
    
    // Buscar vehículos disponibles
    const vehicles = await Vehicle.findAll();
    const availableVehicles = vehicles.filter(v => v.cant_maxima_personas >= cant_personas);

    // Calcular tarifas para cada vehículo
    const outboundResults = await Promise.all(
      availableVehicles.map(async (vehicle) => {
        try {
          const tarifa_total = await calculateTotalRate(
            vehicle.id,
            routeData.ubicacion_id,
            routeData.distancia_km
          );
    
          return {
            vehiculo_id: vehicle.id,
            tipo: vehicle.tipo,
            cant_maxima_personas: vehicle.cant_maxima_personas,
            cant_maxima_maletas: vehicle.cant_maxima_maletas,
            image_url: vehicle.image_url,
            distancia_km: routeData.distancia_km,
            distancia_minutos: routeData.distancia_minutos,
            tiempo_estimado: routeData.tiempo_estimado,
            ubicacion_id: routeData.ubicacion_id,
            tarifa_total,
            route_geometry: routeData.geometry
          };
        } catch (error) {
          console.error(`Error calculating rate for vehicle ${vehicle.id}:`, error);
          return null;
        }
      })
    );

    // Filtrar resultados nulos y calcular viaje de regreso si es necesario
    const filteredOutbound = outboundResults.filter(result => result !== null);
    
    if (tipo_servicio === 'ida_y_regreso' && fecha_regreso && hora_regreso) {
      const returnRouteData = await calculateDistance(destino, origen);
      
      const returnResults = await Promise.all(
        filteredOutbound.map(async (vehicle) => {
          try {
            const tarifa_total = await calculateTotalRate(
              vehicle.vehiculo_id,
              returnRouteData.ubicacion_id,
              returnRouteData.distancia_km
            );

            return {
              ...vehicle,
              distancia_km: returnRouteData.distancia_km,
              distancia_minutos: returnRouteData.distancia_minutos,
              tiempo_estimado: returnRouteData.tiempo_estimado,
              tarifa_total,
              route_geometry: returnRouteData.geometry
            };
          } catch (error) {
            console.error(`Error calculating return rate for vehicle ${vehicle.vehiculo_id}:`, error);
            return null;
          }
        })
      );

      const filteredReturn = returnResults.filter(result => result !== null);

      return filteredOutbound.map((outbound, index) => ({
        ...outbound,
        ida: {
          distancia_km: outbound.distancia_km,
          distancia_minutos: outbound.distancia_minutos,
          tiempo_estimado: outbound.tiempo_estimado,
          tarifa: outbound.tarifa_total,
          route_geometry: outbound.route_geometry
        },
        regreso: {
          distancia_km: filteredReturn[index].distancia_km,
          distancia_minutos: filteredReturn[index].distancia_minutos,
          tiempo_estimado: filteredReturn[index].tiempo_estimado,
          tarifa: filteredReturn[index].tarifa_total,
          route_geometry: filteredReturn[index].route_geometry
        },
        tarifa_total: outbound.tarifa_total + filteredReturn[index].tarifa_total
      }));
    }

    return filteredOutbound;
  } catch (error) {
    console.error('Error in searchAvailableVehicles:', error);
    throw error;
  }
}

module.exports = {
  searchAvailableVehicles
};
