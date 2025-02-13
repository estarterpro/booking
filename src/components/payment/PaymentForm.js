import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { initWompiWidget, openWompiCheckout } from '../../services/wompiService';
import { formatCurrency } from '../../utils/formatUtils';

function PaymentForm({ onSubmit, total, passengerData, disabled = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initWompiWidget().catch(error => {
      console.error('Error initializing Wompi:', error);
      setError('Error al inicializar el sistema de pagos');
    });
  }, []);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await openWompiCheckout({
        amount: total,
        customerData: passengerData,
        onSuccess: (transactionData) => {
          setIsLoading(false);
          onSubmit(transactionData);
        },
        onError: (error) => {
          setIsLoading(false);
          setError(error.message);
          console.error('Error en el pago:', error);
        }
      });
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      console.error('Error procesando el pago:', error);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={disabled || isLoading}
        fullWidth
        size="large"
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Pagar ${formatCurrency(total)}`
        )}
      </Button>
    </Box>
  );
}

export default PaymentForm;
