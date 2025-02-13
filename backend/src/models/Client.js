const db = require('../config/database');

class Client {
  static async findAll() {
    const { rows } = await db.query('SELECT * FROM sp_get_clients()');
    return rows;
  }

  static async findByPk(id) {
    const { rows } = await db.query('SELECT * FROM sp_get_client_by_id($1)', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM sp_get_client_by_email($1)', [email]);
    return rows[0];
  }

  static async createOrUpdate(data) {
    try {
      const { rows } = await db.query(
        'CALL sp_create_or_update_client($1, $2, $3, $4)',
        [data.nombre, data.telefono, data.correo, null]
      );
      return this.findByPk(rows[0].p_id);
    } catch (error) {
      console.error('Error in createOrUpdate client:', error);
      throw error;
    }
  }

  static async update(id, data) {
    await db.query(
      'CALL sp_update_client($1, $2, $3, $4)',
      [id, data.nombre, data.telefono, data.correo]
    );
    return this.findByPk(id);
  }

  static async destroy(id) {
    await db.query('CALL sp_delete_client($1)', [id]);
  }
}

module.exports = Client;
