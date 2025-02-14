const { Location } = require('../models');

const validateLocation = (data) => {
  const errors = [];
  
  if (!data.nombre) {
    errors.push('El nombre de la ubicación es requerido');
  } else if (typeof data.nombre !== 'string') {
    errors.push('El nombre debe ser texto');
  } else if (data.nombre.trim().length < 3) {
    errors.push('El nombre debe tener al menos 3 letras');
  }
  
  return errors;
};

const createLocation = async (req, res) => {
  try {
    const validationErrors = validateLocation(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const location = await Location.create(req.body);
    console.info(`Location created with ID: ${location.id}`);
    res.status(201).json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(400).json({ message: error.message });
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(400).json({ message: error.message });
  }
};

const getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const validationErrors = validateLocation(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const location = await Location.update(id, req.body);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    console.info(`Location updated with ID: ${location.id}`);
    res.json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.destroy(id);
    console.info(`Location deleted with ID: ${id}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation
};