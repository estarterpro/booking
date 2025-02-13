import React from 'react';
import { Box, Typography, Divider, Paper } from "@mui/material";
import PaymentMethods from './PaymentMethods';
import WompiPaymentButton from './WompiPaymentButton';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDateTime } from '../../utils/dateUtils';

const PaymentSection = ({ 
  total,
  customerData,
  selectedMethod,
  onMethodSelect,
  onPaymentSuccess,
  onPaymentError,
  disabled,
  vehicle,
  tripData
}) => {
  if (!total || !vehicle || !tripData) {
    return null;
  }

  // Preparar datos completos para la reserva
  const reservationData = {
    ...customerData,
    ...tripData,
    ubicacion_id: vehicle.ubicacion_id,
    vehiculo_id: vehicle.vehiculo_id,
    tarifa_total: vehicle.tarifa_total,
    distancia_km: vehicle.ida?.distancia_km || vehicle.distancia_km,
    distancia_minutos: vehicle.ida?.distancia_minutos || vehicle.distancia_minutos,
  };


  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumen del pago
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Vehículo</Typography>
          <Typography>{vehicle.tipo}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
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
      </Box>

      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Total a pagar
        </Typography>
        <Typography variant="h4" color="primary" fontWeight="bold">
          {formatCurrency(total)}
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        Método de Pago
      </Typography>

      <PaymentMethods
        selectedMethod={selectedMethod}
        onMethodSelect={onMethodSelect}
      />

      <Box sx={{ mt: 3 }}>
        <WompiPaymentButton
          amount={total}
          customerData={reservationData}
          paymentMethod={selectedMethod}
          onSuccess={onPaymentSuccess}
          onError={onPaymentError}
          disabled={disabled || !selectedMethod}
        />
      </Box>
    </Paper>
  );
};

export default PaymentSection;
