import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button
} from '@mui/material';
import { Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../services/api';

function ReservationsDashboard() {
  const [reservations, setReservations] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [dateFilter, setDateFilter] = useState('today');

  useEffect(() => {
    fetchReservations();
    fetchDrivers();
  }, [dateFilter]);

  const fetchReservations = async () => {
    try {
      const response = await api.get(`/reservas?dateGroup=present&specificFilter=${dateFilter}`);
      setReservations(response.data.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/conductores');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleAssignDriver = async (reservaId, driverId) => {
    try {
      await api.post('/ordenes-servicio', { reserva_id: reservaId, conductor_id: driverId });
      fetchReservations(); // Refresh reservations after assignment
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
  };

  const getAvailableDriversForLocation = (location) => {
    return drivers.filter(driver => driver.ubicacion_id === location);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'EEEE d MMMM yyyy', { locale: es });
  };

  const formatTime = (timeString) => {
    const date = new Date(`2000-01-01T${timeString}`);
    return format(date, 'h:mm a');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reservations Dashboard
      </Typography>

      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="date-filter-label">Date Filter</InputLabel>
          <Select
            labelId="date-filter-label"
            id="date-filter"
            value={dateFilter}
            label="Date Filter"
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="tomorrow">Tomorrow</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="reservations table">
          <TableHead>
            <TableRow>
              <TableCell>Passenger</TableCell>
              <TableCell>Pickup Time</TableCell>
              <TableCell>Pickup Location</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    {row.nombre}
                  </Box>
                </TableCell>
                <TableCell>{formatTime(row.hora)}</TableCell>
                <TableCell>{row.origen}</TableCell>
                <TableCell>{row.destino}</TableCell>
                <TableCell>{row.distancia_km} km</TableCell>
                <TableCell>{row.tarifa_total}</TableCell>
                <TableCell>{row.estado}</TableCell>
                <TableCell>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="driver-select-label">Assign Driver</InputLabel>
                    <Select
                      labelId="driver-select-label"
                      id="driver-select"
                      value={selectedDriver[row.id] || ''}
                      label="Assign Driver"
                      onChange={(e) => setSelectedDriver({ ...selectedDriver, [row.id]: e.target.value })}
                    >
                      {getAvailableDriversForLocation(row.ubicacion_id).map((driver) => (
                        <MenuItem key={driver.id} value={driver.id}>
                          {driver.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button onClick={() => handleAssignDriver(row.id, selectedDriver[row.id])}>Assign</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ReservationsDashboard;
