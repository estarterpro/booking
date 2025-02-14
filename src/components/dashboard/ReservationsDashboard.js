import React, { useState, useEffect } from "react";
import {
  Box,
  Collapse,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  ArrowForward as ArrowIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Note as DescriptionIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import api from "../../services/api";
import { formatCurrency } from "../../utils/formatUtils";
import { formatDateTime } from "../../utils/dateUtils";

function ReservationsDashboard() {
  const [reservations, setReservations] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [timeFilter, setTimeFilter] = useState("present");
  const [dateFilter, setDateFilter] = useState("today");
  const [loading, setLoading] = useState(true);
  const [clientsData, setClientsData] = useState({});
  const [vehiclesData, setVehiclesData] = useState({});

  useEffect(() => {
    fetchReservations();
    fetchDrivers();
  }, [timeFilter, dateFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reservas`, {
        params: {
          dateGroup: timeFilter,
          specificFilter: dateFilter,
        },
      });
      const reservationsData = response.data.data.reservations;
      setReservations(reservationsData);

      // Obtener IDs únicos de clientes y vehículos
      const clientIds = [...new Set(reservationsData.map((r) => r.cliente_id))];
      const vehicleIds = [
        ...new Set(reservationsData.map((r) => r.vehiculo_id)),
      ];

      // Fetch clientes y vehículos
      await Promise.all([
        fetchClientsData(clientIds),
        fetchVehiclesData(vehicleIds),
      ]);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsData = async (clientIds) => {
    try {
      const response = await api.get("/clientes");
      const clients = response.data;
      const clientsMap = {};
      clients.forEach((client) => {
        clientsMap[client.id] = client;
      });
      setClientsData(clientsMap);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchVehiclesData = async (vehicleIds) => {
    try {
      const response = await api.get("/vehiculos");
      const vehicles = response.data;
      const vehiclesMap = {};
      vehicles.forEach((vehicle) => {
        vehiclesMap[vehicle.id] = vehicle;
      });
      setVehiclesData(vehiclesMap);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await api.get("/conductores");
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

const handleAssignDriver = async (reservaId, driverId) => {
  try {
    const response = await api.get('/ordenes-servicio');
    const existingOrder = response.data.find(order => order.reserva_id === reservaId);

    if (existingOrder) {
      await api.patch(`/ordenes-servicio/${existingOrder.id}`, {
        conductor_id: driverId
      });
    } else {
      await api.post("/ordenes-servicio", {
        reserva_id: reservaId,
        conductor_id: driverId,
      });
    }
    fetchReservations(); // Vuelve a cargar las reservas para reflejar los cambios
  } catch (error) {
    console.error("Error assigning driver:", error);
  }
};


  const formatDateTime = (fecha, hora) => {
    try {
      if (!fecha || !hora) return "Fecha no disponible";
      const dateTimeString = `${fecha.split("T")[0]}T${hora}`;
      const dateObj = parseISO(dateTimeString);
      if (isNaN(dateObj.getTime())) {
        return "Fecha inválida";
      }
      return format(dateObj, "d 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      console.error("Error formatting date time:", error);
      return "Fecha inválida";
    }
  };

  const formatTime = (time) => {
    try {
      if (!time) return "--:--";
      const dateObj = parseISO(`2000-01-01T${time}`);
      if (isNaN(dateObj.getTime())) {
        return "--:--";
      }
      return format(dateObj, "HH:mm");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "--:--";
    }
  };

  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pendiente":
        return "warning";
      case "confirmada":
        return "success";
      case "cancelada":
        return "error";
      default:
        return "default";
    }
  };

const ReservationCard = ({ reservation }) => {
  const client = clientsData[reservation.cliente_id] || {};
  const vehicle = vehiclesData[reservation.vehiculo_id] || {};
  const [showDetails, setShowDetails] = useState(false);
  const [assignedDriver, setAssignedDriver] = useState(null); // Declara el estado aquí
  const [localSelectedDriver, setLocalSelectedDriver] = useState(""); // Estado local para el conductor seleccionado

  // Obtener el conductor asignado cuando se carga la tarjeta
  useEffect(() => {
    const fetchAssignedDriver = async () => {
      try {
        const response = await api.get('/ordenes-servicio');
        const serviceOrder = response.data.find(order => order.reserva_id === reservation.id);
        if (serviceOrder) {
          const driver = drivers.find(d => d.id === serviceOrder.conductor_id);
          setAssignedDriver(driver); // Actualiza el estado del conductor asignado
          setLocalSelectedDriver(serviceOrder.conductor_id); // Actualiza el estado local
        }
      } catch (error) {
        console.error('Error fetching assigned driver:', error);
      }
    };

    fetchAssignedDriver();
  }, [reservation.id, drivers]);
  
    return (
      <Card elevation={3} sx={{ mb: 2, position: "relative" }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Time and Status Section */}
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  {formatTime(reservation.hora)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {formatDateTime(reservation.fecha, reservation.hora)}
                </Typography>
                <Chip
                  label={(reservation.estado || "PENDIENTE").toUpperCase()}
                  color={getStatusChipColor(reservation.estado)}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>

            {/* Customer and Trip Details */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Detalles del Viaje
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon color="primary" />
                      <Typography>
                        Origen: {reservation.origen || "No especificado"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ArrowIcon color="action" />
                      <Typography>
                        Destino: {reservation.destino || "No especificado"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CarIcon color="primary" />
                      <Typography>
                        Vehículo: {vehicle.tipo || "No especificado"}
                        {vehicle.cant_maxima_personas &&
                          ` (${vehicle.cant_maxima_personas} pasajeros)`}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {reservation.tipo_servicio === "ida"
                        ? "Solo ida"
                        : "Ida y vuelta"}
                      {reservation.distancia_km
                        ? ` • ${reservation.distancia_km} km`
                        : ""}
                    </Typography>
                  </Stack>
                </Box>

                <Divider />
                <Collapse in={showDetails}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Detalles del Cliente
                    </Typography>
                    <Grid container spacing={2}>
                      {/* Columna izquierda: Detalles del cliente */}
                      <Grid item xs={6}>
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <PersonIcon color="primary" />
                            <Typography>
                              {client.nombre || "Sin nombre"}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <PhoneIcon color="primary" />
                            <Typography>
                              {client.telefono || "Sin teléfono"}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <EmailIcon color="primary" />
                            <Typography>
                              {client.correo || "Sin correo"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>

                      {/* Columna derecha: Notas */}
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <DescriptionIcon color="primary" />
                          <Typography>
                            {reservation.notas_conductor || "sin notas"}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>
              </Stack>
            </Grid>

            {/* Price and Actions */}
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    color="primary.main"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {formatCurrency(reservation.tarifa_total || 0)}
                  </Typography>
                  
                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
  <InputLabel>
    {assignedDriver ? "Conductor Asignado" : "Asignar Conductor"}
  </InputLabel>
  <Select
    value={localSelectedDriver}
    onChange={(e) => setLocalSelectedDriver(e.target.value)}
    label={assignedDriver ? "Conductor Asignado" : "Asignar Conductor"}
  >
    <MenuItem value="">
      <em>Sin asignar</em>
    </MenuItem>
    {drivers.map((driver) => (
      <MenuItem key={driver.id} value={driver.id}>
        {driver.nombre} {"-"} {driver.placa}
      </MenuItem>
    ))}
  </Select>
  <Button
    variant="contained"
    color="primary"
    fullWidth
    sx={{ mt: 1 }}
    disabled={!localSelectedDriver}
    onClick={() => handleAssignDriver(reservation.id, localSelectedDriver)}
  >
    {assignedDriver ? "Actualizar Conductor" : "Asignar Conductor"}
  </Button>
</FormControl>
         
                </Box>
                
                <Button 
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#1565c0", color: "white" },
                    borderRadius: "8px",
                    padding: "5px 10px",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px", 
                  }}
                  onClick={() => setShowDetails(!showDetails)}
                  startIcon={showDetails ? <ExpandLess /> : <ExpandMore />} 
                >
                  {showDetails
                    ? "Ver menos detalles"
                    : "Ver detalles del cliente"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, backgroundColor: "primary.main", color: "white" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Reservas
        </Typography>
        <Typography variant="subtitle1">
          Gestiona las reservas y asigna conductores
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Tabs
              value={timeFilter}
              onChange={(e, v) => setTimeFilter(v)}
              sx={{
                "& .MuiTab-root": {
                  minWidth: 100,
                },
              }}
            >
              <Tab label="Actuales" value="present" />
              <Tab label="Pasadas" value="past" />
            </Tabs>
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filtro de fecha</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Filtro de fecha"
              >
                <MenuItem value="today">Hoy</MenuItem>
                {timeFilter === "past" ? (
                  <MenuItem value="yesterday">Ayer</MenuItem>
                ) : (
                  <MenuItem value="tomorrow">Mañana</MenuItem>
                )}
                <MenuItem value="week">Esta semana</MenuItem>
                <MenuItem value="month">Este mes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Typography>Cargando reservas...</Typography>
      ) : reservations.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No hay reservas para mostrar
        </Typography>
      ) : (
        <Box>
          {reservations.map((reservation) => (
            <ReservationCard
  key={reservation.id}
  reservation={reservation}
  handleAssignDriver={handleAssignDriver}
/>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ReservationsDashboard;
