import React from "react";
import { Typography, Box, Divider, Grid } from "@mui/material";
import {
  DirectionsCar,
  AirlineSeatReclineNormal,
  Luggage,
  Timer,
  AttachMoney,
  Route,
} from "@mui/icons-material";

function VehicleDetails({ vehicle }) {
  const {
    tipo,
    cant_maxima_personas,
    cant_maxima_maletas,
    image_url,
    ida,
    regreso,
    tiempo_estimado,
    distancia_km,
    tarifa_total,
  } = vehicle;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Detalles del vehículo
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DirectionsCar />
            <Typography>{tipo}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AirlineSeatReclineNormal />
            <Typography>{cant_maxima_personas} pasajeros</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Luggage />
            <Typography>{cant_maxima_maletas} maletas</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {image_url && (
          <CardMedia
            component="img"
            height=""
            image={image_url}
            alt={tipo}
            sx={{ objectFit: "cover" }}
          />
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AttachMoney />
            <Typography variant="h6" color="primary">
              {formatCurrency(tarifa_total)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VehicleDetails;
