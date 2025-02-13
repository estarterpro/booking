import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel,
  Alert,
  Snackbar 
} from '@mui/material';
import { useError } from '../context/ErrorContext';
import PassengerForm from '../components/confirmation/PassengerForm';
import PaymentSection from '../components/payment/PaymentSection';
import TripSummaryCard from "../components/confirmation/TripSummaryCard";
import { createReservation, createOrUpdateClient } from '../services/api';

const steps = ['Datos del pasajero', 'Pago'];

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showError } = useError();
  
  const [activeStep, setActiveStep] = useState(0);
  const [passengerData, setPassengerData] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { vehicle, formData } = location.state || {};

  useEffect(() => {
    if (!vehicle || !formData) {
      showError('Información de reserva incompleta. Por favor, inicia una nueva búsqueda.', 'warning');
      navigate('/');
    }
  }, [vehicle, formData, navigate, showError]);

  const handlePassengerSubmit = async (data) => {
    try {
      // Crear o actualizar cliente primero
      const clientResponse = await createOrUpdateClient(data);
      setClientId(clientResponse.id);
      setPassengerData(data);
      setActiveStep(1);
    } catch (error) {
      showError('Error al guardar los datos del cliente. Por favor, intenta nuevamente.');
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setIsProcessing(true);

      const reservationData = {
        ...formData,
        cliente_id: clientId,
        ...passengerData,
        vehiculo_id: vehicle.vehiculo_id,
        tarifa_total: vehicle.tarifa_total,
        distancia_km: vehicle.ida?.distancia_km || vehicle.distancia_km,
        distancia_minutos: vehicle.ida?.distancia_minutos || vehicle.distancia_minutos,
        transaction_id: paymentData.transactionId,
        payment_reference: paymentData.reference,
        payment_status: paymentData.status,
        payment_amount: paymentData.amount
      };

      await createReservation(reservationData);
      
      setSuccessMessage('¡Reserva creada exitosamente! Te enviaremos los detalles por correo electrónico.');
      
      // Redirigir al inicio después de 3 segundos
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } catch (error) {
      console.error('Error creating reservation:', error);
      if (error.response?.status === 400) {
        showError('Error en la reserva. Por favor, verifica la información.');
      } else if (error.response?.status === 409) {
        showError('El vehículo ya no está disponible. Por favor, selecciona otro.');
      } else {
        showError('Error al procesar la reserva. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    showError('Error en el proceso de pago: ' + error.message);
  };

  if (!vehicle || !formData) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Confirmación de reserva
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          {activeStep === 0 ? (
            <PassengerForm onSubmit={handlePassengerSubmit} />
          ) : (
            <PaymentSection
              total={vehicle.tarifa_total}
              customerData={passengerData}
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={setSelectedPaymentMethod}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              disabled={isProcessing}
              vehicle={vehicle}
              tripData={formData}
            />
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <TripSummaryCard 
            tripData={formData} 
            vehicle={vehicle}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Confirmation;