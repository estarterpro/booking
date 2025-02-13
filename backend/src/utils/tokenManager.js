// tokenManager.js

const MAPBOX_TOKENS = [
  process.env.MAPBOX_ACCESS_TOKEN_1,
  process.env.MAPBOX_ACCESS_TOKEN_2,
].filter(Boolean); // Filtrar valores nulos o undefined

const HERE_MAPS_TOKENS = [
  process.env.HERE_MAPS_API_KEY1,
  process.env.HERE_MAPS_API_KEY2,
].filter(Boolean); // Filtrar valores nulos o undefined

// Función para alternar entre tokens
const getToken = (tokens) => {
  if (!tokens || tokens.length === 0) {
    console.warn('No se configuraron tokens válidos. Verifica las variables de entorno.');
    throw new Error('Error: No hay tokens disponibles.');
  }

  const now = new Date();
  const currentHour = now.getHours();
  const tokenIndex = currentHour < 12 ? 0 : 1;

  // Alterna entre los tokens disponibles; si hay más de dos, usa módulo
  return tokens[tokenIndex % tokens.length];
};

// Obtener el token para Mapbox
const getMapboxToken = () => {
  try {
    return getToken(MAPBOX_TOKENS);
  } catch (error) {
    console.error('Error al obtener el token de Mapbox:', error.message);
    throw error;
  }
};

// Obtener el token para Here Maps
const getHereMapsToken = () => {
  try {
    return getToken(HERE_MAPS_TOKENS);
  } catch (error) {
    console.error('Error al obtener el token de Here Maps:', error.message);
    throw error;
  }
};

// Exportar las funciones
module.exports = {
  getToken,
  getMapboxToken,
  getHereMapsToken,
};
