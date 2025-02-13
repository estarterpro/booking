const db = require('../config/database');

class Vehicle {
  static async findAll() {
    try {
      const { rows } = await db.query('SELECT * FROM vehicles');
      return rows;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  }

  static async findByPk(id) {
    try {
      const { rows } = await db.query('SELECT * FROM vehicles WHERE id = $1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching vehicle by id:', error);
      throw error;
    }
  }

  static async create(data) {
    const { rows } = await db.query(
      'CALL sp_create_vehicle($1, $2, $3, $4, $5)',
      [data.tipo, data.cant_maxima_personas, data.cant_maxima_maletas, data.image_url, null]
    );
    return this.findByPk(rows[0].p_id);
  }

  static async update(id, data) {
    await db.query(
      'CALL sp_update_vehicle($1, $2, $3, $4, $5)',
      [id, data.tipo, data.cant_maxima_personas, data.cant_maxima_maletas, data.image_url]
    );
    return this.findByPk(id);
  }

  static async destroy(id) {
    await db.query('CALL sp_delete_vehicle($1)', [id]);
  }
}

module.exports = Vehicle;