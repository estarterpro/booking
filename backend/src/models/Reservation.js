const db = require("../config/database");

class Reservation {
  static async findAll(filters = {}) {
    try {
      const {
        dateGroup,
        specificFilter,
        weekOffset,
        monthOffset,
        reservationId,
        location,
        status,
        includeCancelled = false
      } = filters;

      const { rows } = await db.query(
        "SELECT * FROM sp_get_reservations($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          dateGroup || null,
          specificFilter || null,
          weekOffset || 0,
          monthOffset || 0,
          reservationId || null,
          location || null,
          status || null,
          includeCancelled
        ]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching reservations: ${error.message}`);
    }
  }

static async findByPaymentReference(reference) {
  try {
    const { rows } = await db.query(
      `SELECT * FROM reservations 
       WHERE payment_reference = $1`,
      [reference]
    );

    if (rows.length === 0) {
      throw new Error('No reservations found with the given payment reference.');
    }

    return rows; // Devuelve todas las reservas con la misma referencia
  } catch (error) {
    throw new Error(`Error finding reservations: ${error.message}`);
  }
}


  static async findByTransactionId(transactionId) {
    try {
      const { rows } = await db.query(
        `SELECT * FROM reservations 
         WHERE transaction_id = $1`,
        [transactionId]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding reservation: ${error.message}`);
    }
  }

  static async findByPk(id) {
    try {
      const { rows } = await db.query(
        "SELECT * FROM sp_get_reservations($1, $2, $3, $4, $5, $6, $7)",
        [null, null, 0, 0, id, null, null]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding reservation: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      const result = await db.query(
        "CALL sp_create_reservation($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
        [
          data.cliente_id,
          data.origen,
          data.destino,
          data.distancia_km,
          data.distancia_minutos,
          data.fecha,
          data.hora,
          data.tipo_servicio,
          data.vehiculo_id,
          data.ubicacion_id,
          data.tarifa_total,
          data.notas_conductor,
          data.transaction_id || null,
          data.payment_reference || null,
          data.payment_status || 'PENDING',
          data.payment_amount / 100 || null,
          null // p_id OUT parameter
        ]
      );


      if (result.rows && result.rows[0]) {
        const reservationId = result.rows[0].p_id;
        const { rows } = await db.query(
          "SELECT * FROM sp_get_reservations($1, $2, $3, $4, $5, $6, $7)",
          [null, null, 0, 0, reservationId, null, null]
        );
        return rows[0];
      }
      throw new Error("Failed to create reservation");
    } catch (error) {
      throw new Error(`Error creating reservation: ${error.message}`);
    }
  }

  static async updateStatus(id, estado) {
    try {
      await db.query("CALL sp_update_reservation_status($1, $2)", [id, estado]);
      const { rows } = await db.query(
        "SELECT * FROM sp_get_reservations($1, $2, $3, $4, $5, $6, $7)",
        [null, null, 0, 0, id, null, null]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating reservation status: ${error.message}`);
    }
  }

  static async update(id, data) {
    try {
      const updates = [];
      const values = [id];
      let paramCount = 2;

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (updates.length === 0) return;

      const query = `
        UPDATE reservations 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;

      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating reservation: ${error.message}`);
    }
  }
}

module.exports = Reservation;