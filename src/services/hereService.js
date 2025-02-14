import axios from "axios";
import { HERE_MAPS_API_KEY, MAPBOX_ACCESS_TOKEN } from "../config/constants";
import { APP_CONFIG } from "../config/appConfig";

const HERE_AUTOSUGGEST_URL = "https://autosuggest.search.hereapi.com/v1/autosuggest";
const MAPBOX_DIRECTIONS_API_URL =
  "https://api.mapbox.com/directions/v5/mapbox/driving";

// Función para encontrar aeropuertos que coincidan con la búsqueda
const findMatchingAirports = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  return APP_CONFIG.airports.filter(airport => 
    airport.city.toLowerCase().includes(normalizedQuery) ||
    airport.name.toLowerCase().includes(normalizedQuery) ||
    airport.keywords.some(keyword => normalizedQuery.includes(keyword)) ||
    normalizedQuery.includes('aeropuerto') && airport.city.toLowerCase().includes(normalizedQuery.replace('aeropuerto', '').trim())
  );
};

// Función para categorizar resultados de HERE
const categorizeResult = (item) => {
  if (!item.categories || item.categories.length === 0) {
    return 'other';
  }

  const categoryId = item.categories[0].id;
  const categoryName = item.categories[0].name.toLowerCase();

  // **Aeropuertos y transporte**
  if (categoryId.startsWith('400-4000') || categoryName.includes('aeropuerto')) {
    return 'airport';
  }
  if (categoryId.startsWith('400-4100') || categoryName.includes('transporte') || 
      categoryName.includes('terminal') || categoryName.includes('estacion') || 
      categoryName.includes('paradero') || categoryName.includes('metro') || 
      categoryName.includes('autobús')) {
    return 'transport';
  }

  // **Hoteles y alojamiento**
  if (categoryId.startsWith('500') || categoryName.includes('hotel') || 
      categoryName.includes('hospedaje') || categoryName.includes('alojamiento') || 
      categoryName.includes('resort')) {
    return 'hotel';
  }

  // **Restaurantes, bares y cafeterías**
  if (categoryId.startsWith('100') || categoryName.includes('restaurant') || 
      categoryName.includes('comida') || categoryName.includes('cafe') || 
      categoryName.includes('bar') || categoryName.includes('pub') || 
      categoryName.includes('bistro') || categoryName.includes('pizzeria')) {
    return 'restaurant';
  }

  // **Entretenimiento y vida nocturna**
  if (categoryId.startsWith('200') || categoryName.includes('entretenimiento') || 
      categoryName.includes('casino') || categoryName.includes('cine') || 
      categoryName.includes('teatro') || categoryName.includes('club') || 
      categoryName.includes('discoteca') || categoryName.includes('karaoke')) {
    return 'entertainment';
  }

  // **Compras y centros comerciales**
  if (categoryId.startsWith('600') || categoryName.includes('shopping') || 
      categoryName.includes('mall') || categoryName.includes('tienda') || 
      categoryName.includes('mercado') || categoryName.includes('supermercado') || 
      categoryName.includes('farmacia') || categoryName.includes('ropa') || 
      categoryName.includes('electrónica') || categoryName.includes('libros')) {
    return 'shopping';
  }

  // **Atracciones turísticas y lugares de interés**
  if (categoryId.startsWith('300') || categoryId.startsWith('600') || 
      categoryName.includes('turistic') || categoryName.includes('comercial') || 
      categoryName.includes('museum') || categoryName.includes('monument') || 
      categoryName.includes('montaña') || categoryName.includes('playa') || 
      categoryName.includes('parque') || categoryName.includes('zoologico') || 
      categoryName.includes('acuario') || categoryName.includes('histórico') || 
      categoryName.includes('galeria')) {
    return 'poi';
  }

  // **Negocios y servicios profesionales**
  if (categoryId.startsWith('700') || categoryName.includes('banco') || 
      categoryName.includes('cajero') || categoryName.includes('dinero') || 
      categoryName.includes('correo') || categoryName.includes('turismo') || 
      categoryName.includes('emergencia') || categoryName.includes('policia') || 
      categoryName.includes('bomber') || categoryName.includes('publicidad') || 
      categoryName.includes('diseño') || categoryName.includes('marketing') || 
      categoryName.includes('fotocopiado')) {
    return 'business';
  }

  // **Salud y hospitales**
  if (categoryId.startsWith('800') || categoryName.includes('hospital') || 
      categoryName.includes('salud') || categoryName.includes('clinica') || 
      categoryName.includes('doctor') || categoryName.includes('dentista') || 
      categoryName.includes('farmacia') || categoryName.includes('enfermería')) {
    return 'health';
  }

  // **Educación e instituciones gubernamentales**
  if (categoryId.startsWith('800') || categoryName.includes('escuela') || 
      categoryName.includes('universidad') || categoryName.includes('colegio') || 
      categoryName.includes('biblioteca') || categoryName.includes('gobierno') || 
      categoryName.includes('comunidad') || categoryName.includes('instituto') || 
      categoryName.includes('registro')) {
    return 'education';
  }

  // **Deportes y eventos**
  if (categoryId.startsWith('800') || categoryName.includes('deporte') || 
      categoryName.includes('estadio') || categoryName.includes('gimnasio') || 
      categoryName.includes('piscina') || categoryName.includes('evento') || 
      categoryName.includes('feria') || categoryName.includes('convención')) {
    return 'sports';
  }

  // **Estacionamientos y renta de autos**
  if (categoryId.startsWith('800') || categoryName.includes('parking') || 
      categoryName.includes('estacionamiento') || categoryName.includes('renta') || 
      categoryName.includes('alquiler') || categoryName.includes('vehículo') || 
      categoryName.includes('reparación')) {
    return 'parking';
  }

  // **Calles y vías**
  if (item.resultType === 'street') {
    return 'street';
  }

  return 'other';
};



async function geocodeAddress(address) {
  try {
    if (!address || typeof address !== 'string') {
      throw new Error('Dirección inválida');
    }

    const url = 'https://geocode.search.hereapi.com/v1/geocode';

    const response = await axios.get(url, {
      params: {
        apiKey: HERE_MAPS_API_KEY,
        q: address,
        in: 'countryCode:COL',
        limit: 1, 
        lang: 'es-ES'
      }
    });

    const data = response.data;
    if (!data || !data.items || data.items.length === 0) {
      throw new Error(`No se encontraron coordenadas para: ${address}`);
    }
    
    return data.items[0].position;
  } catch (error) {
    console.error("Error geocodificando dirección:", error);
    throw error;
  }
}

export const getRoute = async (originCoordinates, destinationCoordinates) => {
  if (!originCoordinates || !destinationCoordinates) {
    throw new Error("Las coordenadas de origen y destino son obligatorias.");
  }

  const origin = `${originCoordinates.lng},${originCoordinates.lat}`;
  const destination = `${destinationCoordinates.lng},${destinationCoordinates.lat}`;

  try {
    const url = `${MAPBOX_DIRECTIONS_API_URL}/${origin};${destination}?` +
      new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        geometries: "geojson",
        overview: "full",
        steps: true,
        language: "es",
      });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error obteniendo la ruta: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No se encontró una ruta válida.");
    }

    const route = data.routes[0];

    return {
      distance_km: (route.distance / 1000).toFixed(2),
      duration_minutes: Math.ceil(route.duration / 60),
      geometry: route.geometry,
      steps: route.legs[0]?.steps || [],
    };
  } catch (error) {
    console.error("Error obteniendo la ruta:", error);
    throw error;
  }
};

export const searchLocation = async (query) => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    // Buscar aeropuertos que coincidan con la búsqueda
    const matchingAirports = findMatchingAirports(query);
    
    // Realizar la búsqueda con HERE
    const url = `${HERE_AUTOSUGGEST_URL}?${new URLSearchParams({
      q: query,
      in: 'countryCode:COL',
      at: '0,0',
      apiKey: HERE_MAPS_API_KEY,
      limit: 15
    })}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error buscando ubicaciones: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Procesar y categorizar resultados de HERE
    const processedResults = data.items
      .filter(item => item.position && item.title)
      .map(item => {
        const category = categorizeResult(item);
        return {
          place_name: item.title,
          text: item.title,
          coordinates: { lat: item.position.lat, lng: item.position.lng },
          category,
          address: {
            label: item.address?.label || item.title,
            city: item.address?.city || "",
            state: item.address?.state || "",
            district: item.address?.district || "",
            county: item.address?.county || ""
          },
          categories: item.categories || []
        };
      })
      .filter(result => 
        // Excluir resultados que ya están en los aeropuertos encontrados
        !matchingAirports.some(airport => 
          result.place_name.toLowerCase().includes(airport.name.toLowerCase())
        )
      );

    // Convertir aeropuertos encontrados al formato correcto
    const airportResults = matchingAirports.map(airport => ({
      place_name: airport.name,
      text: airport.name,
      category: 'airport',
      isAirport: true,
      city: airport.city,
      address: {
        label: `${airport.name}, ${airport.city}, Colombia`,
        city: airport.city,
        state: "",
        district: "",
        county: ""
      }
    }));

    // Ordenar resultados por categoría
    const sortedResults = [
      ...airportResults,
      ...processedResults.filter(r => r.category === 'hotel'),
      ...processedResults.filter(r => r.category === 'poi'),
      ...processedResults.filter(r => !['airport', 'hotel', 'poi'].includes(r.category))
    ];

    return sortedResults;
  } catch (error) {
    console.error("Error buscando ubicaciones:", error);
    return [];
  }
};

const hereService = {
  geocodeAddress,
  getRoute,
  searchLocation,
};

export default hereService;