const axios = require('axios');
const { determineLocationId } = require('../utils/locationMappingHere');
const { MAPBOX_ACCESS_TOKEN, HERE_MAPS_API_KEY } = require('../utils/constantes');

async function geocodeAddress(address) {
  try {
    if (!address || typeof address !== 'string') {
      throw new Error('Dirección inválida');
    }

    const url = 'https://geocode.search.hereapi.com/v1/geocode';

    // Realizar la solicitud a la API de HERE
    const response = await axios.get(url, {
      params: {
        apiKey: HERE_MAPS_API_KEY,
        q: address,
        in: 'countryCode:COL', // Limitar la búsqueda a Colombia
        limit: 1, 
        lang: 'es-ES'
      }
    });

    if (!response.data || !response.data.items || response.data.items.length === 0) {
      throw new Error(`No se encontraron coordenadas para: ${address}`);
    }

    // Mapear los resultados y determinar ubicaciones
    const feature = response.data.items[0];
    const locationId = determineLocationId(feature);

    if (!locationId) {
      console.warn('No se encontró ubicacion_id para:', feature.address.label);
      throw new Error('No se pudo determinar la ubicación para la dirección proporcionada');
    }

return {
  coordinates: { lat: feature.position.lat, lng: feature.position.lng }, // Extraer coordenadas correctamente
  ubicacion_id: locationId,
  place_name: feature.address.label,
};
  } catch (error) {
    console.error('Error en geocodeAddress:', error);
    throw error;
  }
}

async function calculateDistance(origin, destination) {
  try {
    const originData = await geocodeAddress(origin);
    const destData = await geocodeAddress(destination);

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originData.coordinates.lng},${originData.coordinates.lat};${destData.coordinates.lng},${destData.coordinates.lat}`;

    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_ACCESS_TOKEN,
        geometries: 'geojson',
        overview: 'full'
      }
    });

    if (!response.data.routes || response.data.routes.length === 0) {
      throw new Error('No se encontró ruta entre los puntos indicados');
    }

    const route = response.data.routes[0];
    const distanceKm = (route.distance / 1000).toFixed(1);
    const durationMinutes = Math.ceil(route.duration / 60);

    return {
      distancia_km: parseFloat(distanceKm),
      distancia_minutos: durationMinutes,
      tiempo_estimado: formatDuration(durationMinutes),
      ubicacion_id: originData.ubicacion_id,
      //geometry: route.geometry
    };
  } catch (error) {
    console.error('Error en calculateDistance:', error);
    throw error;
  }
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 
    ? `${hours} h ${remainingMinutes} min`
    : `${remainingMinutes} min`;
}

module.exports = {
  geocodeAddress,
  calculateDistance
};
