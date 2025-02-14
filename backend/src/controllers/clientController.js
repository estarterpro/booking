const { Client } = require('../models');

const validateClient = (data) => {
  const errors = [];
  
  if (!data.nombre) {
    errors.push('El nombre es requerido');
  }
  
  if (!data.telefono) {
    errors.push('El teléfono es requerido');
  } else if (!/^\d{10}$/.test(data.telefono)) {
    errors.push('El teléfono debe tener 10 dígitos');
  }
  
  if (!data.correo) {
    errors.push('El correo es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
    errors.push('El correo no es válido');
  }
  
  return errors;
};

const createOrUpdateClient = async (req, res) => {
  try {
    const validationErrors = validateClient(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const client = await Client.createOrUpdate(req.body);
    res.status(200).json(client);
  } catch (error) {
    console.error('Error creating/updating client:', error);
    res.status(400).json({ message: error.message });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateClient,
  getClients
};