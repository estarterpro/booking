const db = require('../config/database');

class Driver {
  static async findAll(filters = {}) {
    const { rows } = await db.query(
      'SELECT * FROM sp_get_drivers($1, $2)',
      [filters.ubicacion_id, filters.estado]
    );
    return rows;
  }

  static async findByPk(id) {
    const { rows } = await db.query('SELECT * FROM sp_get_driver_by_id($1)', [id]);
    return rows[0];
  }

  static async create(data) {
    const { rows } = await db.query(
      'CALL sp_create_driver($1, $2, $3, $4, $5, $6)',
      [data.nombre, data.telefono, data.placa, data.ubicacion_id, data.vehiculo_id, null]
    );
    return this.findByPk(rows[0].p_id);
  }

  static async updateStatus(id, estado) {
    await db.query('CALL sp_update_driver_status($1, $2)', [id, estado]);
    return this.findByPk(id);
  }

  static async getAssignedReservations(driverId) {
    const { rows } = await db.query(
      `SELECT r.* 
       FROM reservations r
       INNER JOIN service_orders so ON r.id = so.reserva_id
       WHERE so.conductor_id = $1
       AND r.estado NOT IN ('cancelada', 'completada')
       ORDER BY r.fecha, r.hora`,
      [driverId]
    );
    return rows;
  }
}

module.exports = Driver;
