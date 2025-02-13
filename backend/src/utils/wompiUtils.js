const crypto = require('crypto');

const validateWompiSignature = (req) => {
  try {
    const event = req.body;
    const timestamp = event.timestamp;
    const properties = event.signature.properties;
    const receivedChecksum = event.signature.checksum.toLowerCase(); 

    let concatenatedData = properties.reduce((acc, prop) => {
      const value = prop.split('.').reduce((obj, key) => obj[key], event.data);
      return acc + value;
    }, '');

    // Concatenar timestamp y secret key
    concatenatedData += timestamp + process.env.WOMPI_EVENTS_KEY;

    // Generar checksum
    const calculatedChecksum = crypto
      .createHash('sha256')
      .update(concatenatedData)
      .digest('hex')
      .toLowerCase();  

    return calculatedChecksum === receivedChecksum;
  } catch (error) {
    console.error('Error validating Wompi signature:', error);
    return false;
  }
};


module.exports = {
  validateWompiSignature
};
