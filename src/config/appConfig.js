export const APP_CONFIG = {
  // Flag para activar/desactivar la restricción de aeropuertos
  requireAirportRoute: true,
  
  // Lista de aeropuertos reconocidos
  airports: [
    {
      name: "Aeropuerto Internacional El Dorado",
      keywords: ["dorado", "eldorado", "el dorado", "aeropuerto internacional el dorado"],
      city: "Bogotá"
    },
    {
      name: "Aeropuerto José María Córdova",
      keywords: ["cordova", "córdova", "jose maria", "josé maría", "rionegro", ],
      city: "Medellín"
    },
    {
      name: "Aeropuerto Olaya Herrera",
      keywords: ["Herrera", "Olaya", "Olaya Herrera", "aeropuerto olaya herrera"],
      city: "Medellín"
    },    
    {
      name: "Aeropuerto Internacional Rafael Núñez",
      keywords: ["rafael nuñez", "rafael nunez", "nuñez", "nunez"],
      city: "Cartagena"
    },
    {
      name: "Aeropuerto Internacional Ernesto Cortissoz",
      keywords: ["ernesto cortissoz", "cortissoz", "soledad"],
      city: "Barranquilla"
    },
    {
      name: "Aeropuerto Internacional Simón Bolívar",
      keywords: ["simon bolivar", "simón bolívar", "bolivar"],
      city: "Santa Marta"
    },
    {
      name: "Aeropuerto Internacional Alfonso Bonilla Aragón",
      keywords: ["bonilla aragon", "bonilla aragón", "palmaseca"],
      city: "Cali"
    },
    {
      name: "Aeropuerto La Nubia",
      keywords: ["la nubia", "nubia"],
      city: "Manizales"
    },
    {
      name: "Aeropuerto Internacional Matecaña",
      keywords: ["matecaña", "matecana"],
      city: "Pereira"
    },
    {
      name: "Aeropuerto Gerardo Tobar López",
      keywords: ["gerardo tobar", "tobar lopez", "tobar lópez"],
      city: "Buenaventura"
    },
    {
      name: "Aeropuerto Vanguardia",
      keywords: ["vanguardia"],
      city: "Villavicencio"
    }
  ]
};

// Función helper para verificar si una ubicación es un aeropuerto
export const isAirport = (location) => {
  if (!location) return false;
  
  const searchText = typeof location === 'string' 
    ? location.toLowerCase()
    : location.place_name?.toLowerCase() || '';

  return APP_CONFIG.airports.some(airport => 
    airport.keywords.some(keyword => searchText.includes(keyword)) ||
    searchText.includes(airport.name.toLowerCase()) ||
    searchText.includes(airport.city.toLowerCase() + " aeropuerto")
  );
};

// Función para validar la ruta
export const validateRoute = (origin, destination) => {
  if (!APP_CONFIG.requireAirportRoute) {
    return { valid: true };
  }

  const hasAirportOrigin = isAirport(origin);
  const hasAirportDestination = isAirport(destination);

  if (!hasAirportOrigin && !hasAirportDestination) {
    return {
      valid: false,
      message: "Por el momento, solo realizamos trayectos desde o hacia aeropuertos. Por favor, actualiza tu búsqueda."
    };
  }

  return { valid: true };
};