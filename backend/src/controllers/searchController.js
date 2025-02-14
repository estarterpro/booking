const { searchAvailableVehicles } = require('../services/searchService');
//const { calculateDistance } = require('../services/mapbox');
const { calculateDistance } = require('../services/hereService');

const searchTransport = async (req, res) => {
  try {
    const {
      origen,
      destino,
      fecha_ida,
      hora_ida,
      cant_personas,
      tipo_servicio,
      fecha_regreso,
      hora_regreso
    } = req.body;

    // Validar datos requeridos
    if (!origen || !destino || !fecha_ida || !hora_ida || !cant_personas || !tipo_servicio) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos para la búsqueda'
      });
    }

    // Validar datos adicionales para viaje redondo
    if (tipo_servicio === 'ida_y_regreso' && (!fecha_regreso || !hora_regreso)) {
      return res.status(400).json({
        success: false,
        message: 'Para viajes de ida y regreso, se requieren fecha y hora de regreso'
      });
    }

    // Calcular distancia y obtener ubicacion_id
    const routeData = await calculateDistance(origen, destino);
    
    // Buscar vehículos disponibles con toda la información incluyendo imagen
    const searchResults = await searchAvailableVehicles({
      origen,
      destino,
      fecha_ida,
      hora_ida,
      cant_personas,
      tipo_servicio,
      ubicacion_id: routeData.ubicacion_id,
      fecha_regreso,
      hora_regreso,
      distancia_km: routeData.distancia_km,
      distancia_minutos: routeData.distancia_minutos,
      tiempo_estimado: routeData.tiempo_estimado,
      includeFullVehicleDetails: true 
    });

    res.json({
      success: true,
      data: searchResults
    });
  } catch (error) {
    console.error('Error al buscar el trayecto:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al procesar la búsqueda'
    });
  }
};

module.exports = {
  searchTransport
};