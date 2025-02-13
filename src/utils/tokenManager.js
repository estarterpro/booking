const MAPBOX_TOKENS = [
  process.env.REACT_APP_MAPBOX_ACCESS_TOKEN_1,
  process.env.REACT_APP_MAPBOX_ACCESS_TOKEN_2,
];

const HERE_MAPS_TOKENS = [
  process.env.REACT_APP_HERE_MAPS_API_KEY1,
  process.env.REACT_APP_HERE_MAPS_API_KEY2,
];

export const getToken = (tokens) => {
  const now = new Date();

  // Obtiene las horas actuales (en formato 24 horas)
  const currentHour = now.getHours();

  // Alterna el token basado en si estamos antes o después de las 12:00
  const tokenIndex = currentHour < 12 ? 0 : 1;

  return tokens[tokenIndex];
};

export const getMapboxToken = () => getToken(MAPBOX_TOKENS);
export const getHereMapsToken = () => getToken(HERE_MAPS_TOKENS);
