const axios = require('axios');
const { MAPBOX_ACCESS_TOKEN } = require('../utils/constantes');
const { determineLocationId } = require('../utils/locationMapping');

async function geocodeAddress(address) {
  try {
    if (!address || typeof address !== 'string') {
      throw new Error('Dirección inválida');
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;

    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_ACCESS_TOKEN,
        country: 'CO',
        limit: 1,
        types: ['place', 'address', 'poi', 'locality'].join(','),
        language: 'es'
      }
    });

    if (!response.data || !response.data.features || response.data.features.length === 0) {
      throw new Error(`No se encontraron coordenadas para: ${address}`);
    }

    const feature = response.data.features[0];
    const locationId = determineLocationId(feature);

    if (!locationId) {
      console.warn('No se encontró ubicacion_id para:', feature.place_name);
      throw new Error('No se pudo determinar la ubicación para la dirección proporcionada');
    }

    return {
      coordinates: feature.geometry.coordinates,
      ubicacion_id: locationId,
      place_name: feature.place_name
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

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originData.coordinates[0]},${originData.coordinates[1]};${destData.coordinates[0]},${destData.coordinates[1]}`;

    const response = await axios.get(url, {
      params: {
        access_token: process.env.MAPBOX_ACCESS_TOKEN,
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