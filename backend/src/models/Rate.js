const db = require('../config/database');

class Rate {
  static async findAll() {
    try {
      const { rows } = await db.query('SELECT * FROM sp_get_rates()');
      return rows;
    } catch (error) {
      throw new Error(`Error fetching rates: ${error.message}`);
    }
  }

  static async findByVehicleAndLocation(vehiculo_id, ubicacion_id) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM rates WHERE vehiculo_id = $1 AND ubicacion_id = $2',
        [vehiculo_id, ubicacion_id]
      );
      return rows[0] || null; // Retorna la primera fila o `null` si no existe.
    } catch (error) {
      throw new Error(`Error finding rate: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      const result = await db.query(
        'CALL sp_create_rate($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [
          data.vehiculo_id,
          data.ubicacion_id,
          parseFloat(data.tarifa_base),
          parseFloat(data.km_incluidos),
          parseFloat(data.band1_km_hasta),
          parseFloat(data.band1_precio_km),
          parseFloat(data.band2_km_hasta),
          parseFloat(data.band2_precio_km),
          parseFloat(data.band3_precio_km),
          null,
        ]
      );

      if (result.rows && result.rows[0]) {
        const rateId = result.rows[0].p_id;
        const { rows } = await db.query(
          'SELECT * FROM sp_get_rates() WHERE id = $1',
          [rateId]
        );
        return rows[0];
      }
      throw new Error('Failed to create rate');
    } catch (error) {
      throw new Error(`Error creating rate: ${error.message}`);
    }
  }

  static async update(vehiculo_id, ubicacion_id, data) {
    try {
      const existingRate = await Rate.findByVehicleAndLocation(vehiculo_id, ubicacion_id);
      if (!existingRate) {
        throw new Error(`Rate not found for vehicle ID ${vehiculo_id} and location ID ${ubicacion_id}`);
      }

      const updatedData = {
        tarifa_base: parseFloat(data.tarifa_base || existingRate.tarifa_base),
        km_incluidos: parseFloat(data.km_incluidos || existingRate.km_incluidos),
        band1_km_hasta: parseFloat(data.band1_km_hasta || existingRate.band1_km_hasta),
        band1_precio_km: parseFloat(data.band1_precio_km || existingRate.band1_precio_km),
        band2_km_hasta: parseFloat(data.band2_km_hasta || existingRate.band2_km_hasta),
        band2_precio_km: parseFloat(data.band2_precio_km || existingRate.band2_precio_km),
        band3_precio_km: parseFloat(data.band3_precio_km || existingRate.band3_precio_km),
      };

      Object.entries(updatedData).forEach(([key, value]) => {
        if (isNaN(value)) throw new Error(`Invalid value for ${key}: ${value}`);
      });


      await db.query('CALL sp_update_rate($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
        vehiculo_id,
        ubicacion_id,
        updatedData.tarifa_base,
        updatedData.km_incluidos,
        updatedData.band1_km_hasta,
        updatedData.band1_precio_km,
        updatedData.band2_km_hasta,
        updatedData.band2_precio_km,
        updatedData.band3_precio_km,
      ]);

      return Rate.findByVehicleAndLocation(vehiculo_id, ubicacion_id);
    } catch (error) {
      throw new Error(`Error updating rate: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      await db.query('CALL sp_delete_rate($1)', [id]);
    } catch (error) {
      throw new Error(`Error deleting rate: ${error.message}`);
    }
  }
}

module.exports = Rate;
