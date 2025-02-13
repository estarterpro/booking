const Rate = require('../models/Rate');

const validateRate = (data, isUpdate = false) => {
  const errors = [];
  
  // For updates, vehiculo_id and ubicacion_id are always required
  if (!isUpdate) {
    if (!data.vehiculo_id || typeof data.vehiculo_id !== 'number') {
      errors.push('El ID del vehículo es requerido y debe ser un número');
    }
    
    if (!data.ubicacion_id || typeof data.ubicacion_id !== 'number') {
      errors.push('El ID de la ubicación es requerido y debe ser un número');
    }
  }
  
  // Validate tarifa_base if provided
  if (data.tarifa_base !== undefined) {
    const tarifa = parseFloat(data.tarifa_base);
    if (isNaN(tarifa) || tarifa <= 0) {
      errors.push('La tarifa base debe ser un número mayor a 0');
    }
  }
  
  // Validate km_incluidos if provided
  if (data.km_incluidos !== undefined) {
    const km = parseFloat(data.km_incluidos);
    if (isNaN(km) || km <= 0) {
      errors.push('Los kilómetros incluidos deben ser un número mayor a 0');
    }
  }
  
  // Validate band ranges and prices if provided
  if (data.band1_km_hasta !== undefined) {
    const km = parseFloat(data.band1_km_hasta);
    if (isNaN(km) || km <= 0) {
      errors.push('El límite de kilómetros de la banda 1 debe ser un número mayor a 0');
    }
  }
  
  if (data.band1_precio_km !== undefined) {
    const precio = parseFloat(data.band1_precio_km);
    if (isNaN(precio) || precio <= 0) {
      errors.push('El precio por kilómetro de la banda 1 debe ser un número mayor a 0');
    }
  }
  
  if (data.band2_km_hasta !== undefined) {
    const km = parseFloat(data.band2_km_hasta);
    if (isNaN(km) || km <= 0) {
      errors.push('El límite de kilómetros de la banda 2 debe ser un número mayor a 0');
    }
  }
  
  if (data.band2_precio_km !== undefined) {
    const precio = parseFloat(data.band2_precio_km);
    if (isNaN(precio) || precio <= 0) {
      errors.push('El precio por kilómetro de la banda 2 debe ser un número mayor a 0');
    }
  }
  
  if (data.band3_precio_km !== undefined) {
    const precio = parseFloat(data.band3_precio_km);
    if (isNaN(precio) || precio <= 0) {
      errors.push('El precio por kilómetro de la banda 3 debe ser un número mayor a 0');
    }
  }

  return errors;
};

const createRate = async (req, res) => {
  try {
    const validationErrors = validateRate(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const rate = await Rate.create(req.body);
    res.status(201).json(rate);
  } catch (error) {
    console.error('Error creating rate:', error);
    res.status(400).json({ message: error.message });
  }
};

const getRates = async (req, res) => {
  try {
    const rates = await Rate.findAll();
    res.json(rates);
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateRate = async (req, res) => {
  try {
    const { vehiculo_id, ubicacion_id } = req.body;
    
    if (!vehiculo_id || !ubicacion_id) {
      return res.status(400).json({ 
        message: 'Se requieren vehiculo_id y ubicacion_id para actualizar la tarifa' 
      });
    }

    const validationErrors = validateRate(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const updatedRate = await Rate.update(vehiculo_id, ubicacion_id, req.body);
    if (!updatedRate) {
      return res.status(404).json({ 
        message: 'No se encontró la tarifa para el vehículo y ubicación especificados' 
      });
    }

    res.json(updatedRate);
  } catch (error) {
    console.error('Error updating rate:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteRate = async (req, res) => {
  try {
    const { id } = req.params;
    await Rate.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting rate:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRate,
  getRates,
  updateRate,
  deleteRate
};