import React from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { formatCurrency } from "../../utils/formatUtils";
import { formatDateTime } from "../../utils/dateUtils";

function PaymentSummary({ total, vehicle, tripData }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumen del pago
      </Typography>
 
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap:3, mb: 1 }}>
          <Typography>Vehiculo</Typography>
          <Typography>{vehicle.tipo}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap:3, mb: 1 }}>
          <Typography>Trayecto</Typography>
          <Typography>
            {tripData.tipo_servicio === "ida" ? "Solo ida" : "Ida y vuelta"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap:3, mb: 1 }}>
          <Typography>Descripcion </Typography>
          <Typography>
            Servicio de transporte especial{" "}
            {tripData.tipo_servicio === "ida"
              ? "Solo ida"
              : "Ida y vuelta"}{" "}
            para {tripData.cant_personas} {tripData.cant_personas === 1 ? 'persona' : 'personas'} {" "}
            el dia {formatDateTime(tripData.fecha_ida, tripData.hora_ida)} desde {tripData.origen} hasta {tripData.destino}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            Total a pagar
          </Typography>
          <Typography variant="h4" color="primary" fontWeight="bold">
            {formatCurrency(total)} 
          </Typography>
          <Typography> {" "}
            </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default PaymentSummary;
