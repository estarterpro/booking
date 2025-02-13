// src/models/Transaction.js
const db = require('../config/database');

class Transaction {
  static async create(data) {
    try {
      const { rows } = await db.query(
        `INSERT INTO transactions 
        (reference, wompi_transaction_id, amount, status, payment_method, reservation_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          data.reference,
          data.wompi_transaction_id,
          data.amount,
          data.status || 'PENDING',
          data.payment_method,
          data.reservation_id
        ]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  }

  static async findOne(conditions) {
    try {
      const whereClause = Object.entries(conditions)
        .map(([key, value], index) => `${key} = $${index + 1}`)
        .join(' AND ');

      const { rows } = await db.query(
        `SELECT * FROM transactions WHERE ${whereClause}`,
        Object.values(conditions)
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding transaction: ${error.message}`);
    }
  }

  static async update(conditions, updates) {
    try {
      const setClause = Object.entries(updates)
        .map(([key], index) => `${key} = $${index + 1}`)
        .join(', ');

      const whereClause = Object.entries(conditions)
        .map(([key], index) => `${key} = $${index + Object.keys(updates).length + 1}`)
        .join(' AND ');

      const values = [...Object.values(updates), ...Object.values(conditions)];

      const { rows } = await db.query(
        `UPDATE transactions 
         SET ${setClause}
         WHERE ${whereClause}
         RETURNING *`,
        values
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  }
}

module.exports = Transaction;
