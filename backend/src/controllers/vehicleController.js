const { Vehicle } = require('../models');

const validateVehicle = (data) => {
  const errors = [];
  
  if (!data.tipo) {
    errors.push("El tipo de Vehículo es requerido");
  }
  if (!data.cant_maxima_personas || data.cant_maxima_personas < 1) {
    errors.push("La cantidad máxima de personas debe ser mayor a 0");
  }
  if (typeof data.cant_maxima_maletas !== "number" || data.cant_maxima_maletas < 0) {
    errors.push("La cantidad de maletas debe ser un número mayor o igual a 0");
  }
  if (data.image_url && typeof data.image_url !== "string") {
    errors.push("La URL de la imagen debe ser una cadena de texto");
  }
  
  return errors;
};

const createVehicle = async (req, res) => {
  try {
    const validationErrors = validateVehicle(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    const vehicle = await Vehicle.create(req.body);
    console.log(`Vehículo creado con ID: ${vehicle.id}`);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Error al crear el vehículo:", error);
    res.status(400).json({ message: error.message });
  }
};

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    console.error("Error al obtener los vehículos:", error);
    res.status(400).json({ message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error al encontrar el vehículo:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const validationErrors = validateVehicle(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const vehicle = await Vehicle.update(id, req.body);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    console.log(`Vehículo actualizado con ID: ${vehicle.id}`);
    res.json(vehicle);
  } catch (error) {
    console.error('Error actualizando el vehículo:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await Vehicle.destroy(id);
    console.log(`Vehículo eliminado con éxito: ${id}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el vehículo:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};
