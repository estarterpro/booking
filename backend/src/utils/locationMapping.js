// Definición de ciudades principales y sus áreas cercanas
const LOCATION_MAPPINGS = {
  1: { // Bogotá
    mainCity: 'bogota',
    nearbyAreas: ['chia', 'zipaquira', 'cajica', 'soacha', 'funza', 'mosquera', 'madrid', 'facatativa', 'cota', 'tocancipa', 'sopo'],
    keywords: ['el dorado', 'bogota', 'bogotá', 'distrito capital', 'cundinamarca']
  },
  2: { // Medellín
    mainCity: 'medellin',
    nearbyAreas: ['rionegro', 'bello', 'envigado', 'itagui', 'sabaneta', 'la estrella', 'caldas', 'copacabana'],
    keywords: ['jose maria cordova', 'josé maría córdova', 'medellin', 'medellín', 'antioquia']
  },
  3: { // Cartagena
    mainCity: 'cartagena',
    nearbyAreas: ['turbaco', 'arjona', 'turbana', 'santa rosa'],
    keywords: ['rafael nunez', 'rafael núñez', 'cartagena', 'bolivar', 'bolívar']
  },
  4: { // Barranquilla
    mainCity: 'barranquilla',
    nearbyAreas: ['soledad', 'malambo', 'galapa', 'puerto colombia'],
    keywords: ['ernesto cortissoz', 'barranquilla', 'atlantico', 'atlántico']
  },
  5: { // Santa Marta
    mainCity: 'santa marta',
    nearbyAreas: ['taganga', 'rodadero', 'gaira', 'bonda'],
    keywords: ['simon bolivar', 'simón bolívar', 'santa marta', 'magdalena']
  },
  6: { // Cali
    mainCity: 'cali',
    nearbyAreas: ['yumbo', 'jamundi', 'palmira', 'candelaria'],
    keywords: ['alfonso bonilla aragon', 'alfonso bonilla aragón', 'cali', 'valle del cauca']
  },
  7: { // Valledupar
    mainCity: 'valledupar',
    nearbyAreas: ['la paz', 'manaure', 'san diego', 'agustin codazzi'],
    keywords: ['alfonso lopez', 'alfonso lópez', 'valledupar', 'cesar']
  },
    8: { // Villavicencio
    mainCity: 'villavicencio',
    nearbyAreas: ['acacias', 'cumaral', 'restrepo', 'granada', 'guamal'],
    keywords: ['la vanguardia', 'villavicencio', 'meta']
  }
}; 
 

/**
 * Normaliza el texto para comparación
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

/**
 * Determina el ID de ubicación basado en el lugar y su contexto
 * @param {Object} place - Objeto de lugar de Mapbox
 * @returns {number|null} ID de ubicación o null si no se encuentra coincidencia
 */
const determineLocationId = (place) => {
  if (!place) return null;

  // Normalizar el texto del lugar y contexto
  const placeName = normalizeText(place.place_name || '');
  const context = place.context || [];
  
  // Extraer región y ciudad del contexto
  const region = context.find(item => item.id.startsWith('region'))?.text || '';
  const city = context.find(item => item.id.startsWith('place'))?.text || '';
  
  const normalizedRegion = normalizeText(region);
  const normalizedCity = normalizeText(city);

  // Buscar coincidencia en los mapeos
  for (const [locationId, mapping] of Object.entries(LOCATION_MAPPINGS)) {
    const id = parseInt(locationId);
    
    // Verificar ciudad principal
    if (normalizedCity === mapping.mainCity) {
      return id;
    }

    // Verificar áreas cercanas
    if (mapping.nearbyAreas.some(area => normalizeText(area) === normalizedCity)) {
      return id;
    }

    // Verificar palabras clave en el nombre del lugar o región
    if (mapping.keywords.some(keyword => 
      placeName.includes(normalizeText(keyword)) || 
      normalizedRegion.includes(normalizeText(keyword))
    )) {
      return id;
    }
  }

  return null;
};

module.exports = {
  determineLocationId,
  LOCATION_MAPPINGS
};
