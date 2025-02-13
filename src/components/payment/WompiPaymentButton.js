import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { initWompiWidget, openWompiCheckout } from '../../services/wompiService';

const WompiPaymentButton = ({
  amount,
  customerData,
  paymentMethod,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initWompiWidget().catch(error => {
      console.error('Error inicializando Wompi:', error);
      if (onError) onError(error);
    });
  }, [onError]);

  const handlePayment = async () => {
    if (!amount || !customerData || !paymentMethod) {
      onError(new Error('Faltan datos requeridos para el pago'));
      return;
    }

    try {
      setIsLoading(true);

      openWompiCheckout({
        amount,
        customerData,
        paymentMethod,
        onSuccess: (transaction) => {
          setIsLoading(false);
          if (onSuccess) onSuccess(transaction);
        },
        onError: (error) => {
          setIsLoading(false);
          if (onError) onError(error);
        }
      });
    } catch (error) {
      setIsLoading(false);
      if (onError) onError(error);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handlePayment}
      disabled={disabled || isLoading || !amount || !customerData || !paymentMethod}
      fullWidth
      size="large"
    >
      {isLoading ? <CircularProgress size={24} /> : 'Realizar Pago'}
    </Button>
  );
};

export default WompiPaymentButton;