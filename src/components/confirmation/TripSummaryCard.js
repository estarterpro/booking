import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import {
  LocationOn,
  DirectionsCar,
  Schedule,
} from "@mui/icons-material";
import TripMap from "../map/TripMap";
import { formatDateTime } from "../../utils/dateUtils";

function TripSummaryCard({ tripData, vehicle }) {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resumen del viaje
        </Typography>

        <Box sx={{ mb: 3, borderRadius: 1, overflow: "hidden" }}>
          <TripMap origin={tripData.origen} destination={tripData.destino} />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn color="primary" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Origen
                </Typography>
                <Typography>{tripData.origen}</Typography>
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
                <Typography>{tripData.destino}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Schedule />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Fecha y hora
                </Typography>
                <Typography>
                  {formatDateTime(tripData.fecha_ida, tripData.hora_ida)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DirectionsCar />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Vehículo
                </Typography>
                <Typography>{vehicle.tipo}</Typography>
              </Box>
            </Box>
          </Grid>
{/* 
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Pasajeros
                </Typography>
                <Typography>
                  {tripData.cant_personas}{" "}
                  {tripData.cant_personas === 1 ? "persona" : "personas"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AttachMoney />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Tarifa total
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(vehicle.tarifa_total)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          */}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default TripSummaryCard;
