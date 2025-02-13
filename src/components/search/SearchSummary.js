import React from 'react';
import { Grid, Typography, Divider, Box } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function SearchSummary({ formData }) {
  const {
    origen,
    destino,
    fecha_ida,
    hora_ida,
    cant_personas,
    tipo_servicio,
    fecha_regreso,
    hora_regreso
  } = formData;

  const formatDateTime = (date, time) => {
    if (!date || !time) return 'No especificado';
    return `${format(new Date(date), "d 'de' MMMM, yyyy", { locale: es })} a las ${time}`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Detalles del viaje
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Origen
          </Typography>
          <Typography variant="body1" gutterBottom>
            {origen}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Destino
          </Typography>
          <Typography variant="body1" gutterBottom>
            {destino}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Fecha y hora de ida
          </Typography>
          <Typography variant="body1" gutterBottom>
            {formatDateTime(fecha_ida, hora_ida)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Pasajeros
          </Typography>
          <Typography variant="body1" gutterBottom>
            {cant_personas} {cant_personas === 1 ? 'persona' : 'personas'}
          </Typography>
        </Grid>
        {tipo_servicio === 'ida_y_regreso' && (
          <>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Fecha y hora de regreso
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDateTime(fecha_regreso, hora_regreso)}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default SearchSummary;
