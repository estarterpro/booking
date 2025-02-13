// API y URLs base
import { getMapboxToken, getHereMapsToken } from '../utils/tokenManager';
export const MAPBOX_ACCESS_TOKEN = getMapboxToken();

export const HERE_MAPS_API_KEY = getHereMapsToken();

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const WOMPI_PUBLIC_KEY = process.env.REACT_APP_WOMPI_PUBLIC_KEY;
export const WOMPI_ENVIRONMENT = process.env.WOMPI_ENVIRONMENT || 'sandbox';

// Configuración de Mapbox
export const MAPBOX_CONFIG = {
  COUNTRY: 'CO',
  LANGUAGE: 'es',
  RESULT_LIMIT: 10,
  TYPES: ["place", "poi", "address", "neighborhood", "locality"]
};
 
// Constantes de la aplicación
export const TRIP_TYPES = {
  ONE_WAY: 'ida',
  ROUND_TRIP: 'ida_y_regreso'
};

export const MAX_PASSENGERS = 19;
export const MIN_PASSENGERS = 1;
