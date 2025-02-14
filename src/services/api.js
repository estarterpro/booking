import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const searchTransport = async (searchData) => {
  try {
    const response = await api.post("/search", searchData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createReservation = async (reservationData) => {
  try {
    const reservationPayload = {
      cliente_id: reservationData.cliente_id,
      origen: reservationData.origen,
      destino: reservationData.destino,
      distancia_km: reservationData.distancia_km,
      distancia_minutos: reservationData.distancia_minutos,
      fecha: reservationData.fecha_ida,
      hora: reservationData.hora_ida,
      tipo_servicio: reservationData.tipo_servicio,
      vehiculo_id: reservationData.vehiculo_id,
      ubicacion_id: reservationData.ubicacion_id,
      tarifa_total: reservationData.tarifa_total,
      notas_conductor: reservationData.notas_conductor,
      // Datos de la transacción
      transaction_id: reservationData.transaction_id,
      payment_reference: reservationData.payment_reference,
      payment_status: reservationData.payment_status || 'PENDING',
      payment_amount: reservationData.payment_amount
    };

    const response = await api.post('/reservas', reservationPayload);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const createOrUpdateClient = async (clientData) => {
  try {
    const response = await api.post('/clientes', clientData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating client:', error);
    throw error;
  }
};

export const getLocations = async () => {
  try {
    const response = await api.get("/ubicaciones");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehicles = async () => {
  try {
    const response = await api.get("/vehiculos");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getReservations = async (filters) => {
  try {
    const response = await api.get('/reservas', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export const getDrivers = async () => {
  try {
    const response = await api.get('/conductores');
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
};

export const assignDriver = async (reservaId, conductorId) => {
  try {
    const response = await api.post('/ordenes-servicio', { reserva_id: reservaId, conductor_id: conductorId });
    return response.data;
  } catch (error) {
    console.error('Error assigning driver:', error);
    throw error;
  }
};

export default api;