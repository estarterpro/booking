const { Driver, Location, Vehicle } = require('../models');

const validateDriver = (data) => {
  const errors = [];
  
  if (!data.nombre) {
    errors.push('El nombre es requerido');
  }
  
  if (!data.telefono) {
    errors.push('El teléfono es requerido');
  } else if (!/^\d{10}$/.test(data.telefono)) {
    errors.push('El teléfono debe tener 10 dígitos');
  }
  
  if (!data.placa) {
    errors.push('La placa es requerida');
  }
  
  if (!data.ubicacion_id || typeof data.ubicacion_id !== 'number') {
    errors.push('La ubicación es requerida');
  }
  
  if (!data.vehiculo_id || typeof data.vehiculo_id !== 'number') {
    errors.push('El vehículo es requerido');
  }

  return errors;
};

const createDriver = async (req, res) => {
  try {
    const validationErrors = validateDriver(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(400).json({ message: error.message });
  }
};

const getDrivers = async (req, res) => {
  try {
    const { ubicacion_id, estado } = req.query;
    const where = {};

    if (ubicacion_id) where.ubicacion_id = ubicacion_id;
    if (estado) where.estado = estado;

    const drivers = await Driver.findAll({
      where,
      include: [
        { model: Location },
        { model: Vehicle }
      ]
    });
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['disponible', 'ocupado'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const driver = await Driver.findByPk(id);
    if (!driver) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    driver.estado = estado;
    await driver.save();

    res.json(driver);
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  updateDriverStatus
};
