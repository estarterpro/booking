const db = require('../config/database');

class Location {
  static async findAll() {
    const { rows } = await db.query('SELECT * FROM sp_get_locations()');
    return rows;
  }

  static async findByPk(id) {
    const { rows } = await db.query('SELECT * FROM sp_get_location_by_id($1)', [id]);
    return rows[0];
  }

  static async create(data) {
    const { rows } = await db.query('CALL sp_create_location($1, $2)', [data.nombre, null]);
    return this.findByPk(rows[0].p_id);
  }

  static async update(id, data) {
    await db.query('CALL sp_update_location($1, $2)', [id, data.nombre]);
    return this.findByPk(id);
  }

  static async destroy(id) {
    await db.query('CALL sp_delete_location($1)', [id]);
  }
}

module.exports = Location;
