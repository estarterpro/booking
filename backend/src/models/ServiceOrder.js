const db = require('../config/database');

class ServiceOrder {
  static async findAll() {
    try {
      const { rows } = await db.query('SELECT * FROM sp_get_service_orders()');
      return rows;
    } catch (error) {
      throw new Error(`Error fetching service orders: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      const result = await db.query(
        'CALL sp_create_service_order($1, $2, $3)',
        [data.reserva_id, data.conductor_id, null]
      );
      
      if (result.rows && result.rows[0]) {
        const orderId = result.rows[0].p_id;
        const { rows } = await db.query(
          'SELECT * FROM sp_get_service_orders() WHERE id = $1',
          [orderId]
        );
        return rows[0];
      }
      throw new Error('Failed to create service order');
    } catch (error) {
      throw new Error(`Error creating service order: ${error.message}`);
    }
  }
}

module.exports = ServiceOrder;