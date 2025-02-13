import { WOMPI_PUBLIC_KEY } from '../config/constants';
import api from './api';

export const initWompiWidget = () => {
  return new Promise((resolve, reject) => {
    try {
      if (window.WidgetCheckout) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.wompi.co/widget.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Error al cargar Wompi'));
      document.body.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

export const openWompiCheckout = async ({
  amount,
  customerData,
  paymentMethod,
  onSuccess,
  onError
}) => {
  try {
    if (!window.WidgetCheckout) {
      throw new Error('Widget de Wompi no inicializado');
    }

    // Generar referencia única
    const reference = `ESTARTER-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const amountInCents = Math.round(amount * 100);
    const currency = 'COP';
    
    // Obtener firma del backend
    const { data } = await api.post('/payments/signature', {
      reference,
      amountInCents,
      currency,
    });

    const reservationPayload = {
      ...customerData,
      payment_reference: reference,
      payment_status: 'PENDING',
      payment_amount: amountInCents,
      origen: customerData.origen,
      destino: customerData.destino,
      fecha: customerData.fecha_ida,
      hora: customerData.hora_ida,
      tipo_servicio: customerData.tipo_servicio,
      vehiculo_id: customerData.vehiculo_id,
      ubicacion_id: customerData.ubicacion_id,
      tarifa_total: customerData.tarifa_total,
      distancia_km: customerData.distancia_km,
      distancia_minutos: customerData.distancia_minutos
    };

    await api.post('/reservas', reservationPayload);

    const checkout = new window.WidgetCheckout({
      currency,
      amountInCents,
      reference,
      publicKey: WOMPI_PUBLIC_KEY,
      
      signature: {
        integrity: data['data-signature:integrity']
      },
      
      customerData: {
        email: customerData.correo,
        fullName: customerData.nombre,
        phoneNumber: customerData.telefono?.replace(/\D/g, ''),
        phoneNumberPrefix: '+57',
      },

      paymentMethod: {
        type: paymentMethod,
        ...(paymentMethod === 'PSE' && {
          payment_description: 'Reserva de transporte'
        })
      },
    });

    // Manejar resultado del checkout
    checkout.handleResult = async (result) => {
      try {
        const transactionId = result.transaction.id;
        
        // Actualizar la reserva con el ID de transacción
        await api.patch(`/reservas/${reference}`, {
          transaction_id: transactionId,
          payment_status: result.transaction.status
        });

        if (result.transaction.status === 'APPROVED') {
          onSuccess({
            transactionId,
            reference,
            status: result.transaction.status,
            amount
          });
        } else {
          onError(new Error(`Pago ${result.transaction.status.toLowerCase()}`));
        }
      } catch (error) {
        onError(error);
      }
    };

    checkout.open(checkout.handleResult);

  } catch (error) {
    console.error('Error abriendo Wompi checkout:', error);
    onError(error);
  }
};