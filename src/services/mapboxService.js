import { MAPBOX_ACCESS_TOKEN, MAPBOX_CONFIG } from "../config/constants";

const MAPBOX_API_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const MAPBOX_DIRECTIONS_API_URL =
  "https://api.mapbox.com/directions/v5/mapbox/driving";


export const geocodeAddress = async (address) => {
  if (!address || typeof address !== "string") {
    throw new Error("La dirección proporcionada es inválida.");
  }

  try {
    const response = await fetch(
      `${MAPBOX_API_URL}/${encodeURIComponent(address)}.json?` +
        new URLSearchParams({
          access_token: MAPBOX_ACCESS_TOKEN,
          country: 'CO',
          limit: 1,
          types: ['place', 'address', 'poi', 'locality'].join(','),
          language: 'es'
        })
    );

    if (!response.ok) {
      throw new Error(`Error en la geocodificación: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      throw new Error(`No se encontraron coordenadas para: ${address}`);
    }

    return data.features[0].geometry.coordinates;
  } catch (error) {
    console.error("Error geocodificando dirección:", error);
    throw error;
  }
};

export const getRoute = async (origin, destination) => {
  if (!Array.isArray(origin) || !Array.isArray(destination)) {
    throw new Error("Las coordenadas de origen y destino deben ser arrays.");
  }

  try {
    const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
    const response = await fetch(
      `${MAPBOX_DIRECTIONS_API_URL}/${coordinates}?` +
        new URLSearchParams({
          access_token: MAPBOX_ACCESS_TOKEN,
          geometries: "geojson",
          overview: "full",
          steps: true,
        })
    );

    if (!response.ok) {
      throw new Error(`Error obteniendo la ruta: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error("No se encontró una ruta válida.");
    }

    return data.routes[0];
  } catch (error) {
    console.error("Error obteniendo la ruta:", error);
    throw error;
  }
};

export const searchLocation = async (query) => {
  if (!query || query.trim().length < 3) {
    console.error("El texto de búsqueda debe tener al menos 3 caracteres.");
    return [];
  }

  try {
    const response = await fetch(
      `${MAPBOX_API_URL}/${encodeURIComponent(query)}.json?` +
        new URLSearchParams({
          access_token: MAPBOX_ACCESS_TOKEN,
          country: MAPBOX_CONFIG.COUNTRY,
          types: MAPBOX_CONFIG.TYPES.join(","),
          language: MAPBOX_CONFIG.LANGUAGE,
          limit: MAPBOX_CONFIG.RESULT_LIMIT || 10,
        })
    );

    if (!response.ok) {
      throw new Error(`Error buscando ubicaciones: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      console.warn("No se encontraron resultados para la búsqueda.");
      return [];
    }

    return data.features.map((feature) => {
      const context = feature.context || [];
      return {
        place_name: feature.place_name,
        text: feature.text,
        coordinates: feature.geometry.coordinates,
        region: context.find((ctx) => ctx.id.startsWith("region"))?.text || "",
        city: context.find((ctx) => ctx.id.startsWith("place"))?.text || "",
        neighborhood:
          context.find((ctx) => ctx.id.startsWith("neighborhood"))?.text || "",
        locality:
          context.find((ctx) => ctx.id.startsWith("locality"))?.text || "",
      };
    });
  } catch (error) {
    console.error("Error buscando ubicaciones:", error);
    return [];
  }
};

const mapboxService = {
  geocodeAddress,
  getRoute,
  searchLocation,
};

export default mapboxService;
