const crypto = require('crypto');
const { validateWompiSignature } = require('../utils/wompiUtils');
const Reservation = require('../models/Reservation');

const generateWompiSignature = async (req, res) => {
  try {
    const { reference, amountInCents, currency } = req.body;

    if (!reference || !amountInCents || !currency) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }

    const concatenatedString = `${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_KEY}`;
    const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');

    res.json({
      "data-signature:integrity": hash,
      "data-client": concatenatedString
    });
  } catch (error) {
    console.error('Error generating Wompi signature:', error);
    res.status(500).json({ 
      error: 'Error generating signature' 
    });
  }
};

const handleWompiWebhook = async (req, res) => {
  try {
    const event = req.body;
    
    // Validar firma del evento
    if (!validateWompiSignature(req)) {
      console.error('Invalid Wompi signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { transaction } = event.data;
    const { reference, status, id: transactionId } = transaction;

   // Buscar todas las reservas por referencia
const reservations = await Reservation.findByPaymentReference(reference);

if (!reservations || reservations.length === 0) {
  console.error(`No reservations found for reference: ${reference}`);
  return res.status(404).json({ error: 'Reservations not found' });
}

// Recorrer todas las reservas y actualizarlas
for (const reservation of reservations) {
  // Actualizar estado de la reserva
  await Reservation.updateStatus(
    reservation.id, 
    status === 'APPROVED' ? 'CONFIRMADA' : 'DECLINADA'
  );

  // Actualizar información de pago
  await Reservation.update(reservation.id, {
    payment_status: status,
    transaction_id: transactionId
  });
}

    res.status(200).json();
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// consultar el estado de una transaccion * poner el link de wompi
const getTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const reservation = await Reservation.findByTransactionId(transactionId);

    if (!reservation) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
      status: reservation.payment_status,
      reference: reservation.payment_reference,
      amount: reservation.payment_amount
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  generateWompiSignature,
  handleWompiWebhook,
  getTransactionStatus
};