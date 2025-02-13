import React from "react";
import { Paper, Typography, Box, Divider, Grid } from "@mui/material";
import { LocationOn, Schedule, Route, Person } from "@mui/icons-material";
import { formatDateTime } from "../../utils/dateUtils";
import { formatDistance } from "../../utils/formatUtils";

function TripDetails({ formData, searchResults }) {
  const firstVehicle = searchResults[0]; // Use first vehicle for distance/time info

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Detalles del viaje
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn color="primary" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Origen
                </Typography>
                <Typography>{formData.origen}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Route />
              <Box>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                ></Typography>
                <Typography>
                  {formatDistance(
                    firstVehicle.distancia_km || firstVehicle.ida.distancia_km
                  )}{" "}
                  y{" "}
                  {firstVehicle.tiempo_estimado ||
                    firstVehicle.ida.tiempo_estimado}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn color="red" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Destino
                </Typography>
                <Typography>{formData.destino}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Schedule />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Fecha y hora
                </Typography>
                <Typography>
                  {formatDateTime(formData.fecha_ida, formData.hora_ida)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Pasajeros
                </Typography>
                <Typography>
                  {formData.cant_personas}{" "}
                  {formData.cant_personas === 1 ? "persona" : "personas"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          {/* 
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Route />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Distancia y tiempo estimado
                </Typography>
                <Typography>
                  {formatDistance(firstVehicle.distancia_km)} - {firstVehicle.tiempo_estimado}
                </Typography>
              </Box>
            </Box>
          </Grid> 
          */}
        </Grid>
      </Box>
    </Paper>
  );
}

export default TripDetails;
