//const { calculateDistance } = require('../services/mapbox');
const { calculateDistance } = require('../services/hereService');

const testMapboxDistance = async (req, res) => {
  try {
    const { origen, destino } = req.body;

    if (!origen || !destino) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren origen y destino'
      });
    }

    const result = await calculateDistance(origen, destino);

    res.json({
      success: true,
      data: {
        origen,
        destino,
        distancia_km: result.distancia_km,
        tiempo_estimado: result.tiempo_estimado,
        detalles: {
          distancia_metros: result.distancia_km * 1000,
          distancia_minutos: result.distancia_minutos,
          tiempo_segundos: result.distancia_minutos * 60
        }
      }
    });
  } catch (error) {
    console.error('Error testing Mapbox:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.stack
    });
  }
};

module.exports = {
  testMapboxDistance
};
